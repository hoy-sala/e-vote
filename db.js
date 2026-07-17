const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, 'data', 'evote.db');

let db;

function getDb() {
  if (!db) {
    const fs = require('fs');
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS elections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft','active','closed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS positions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      election_id INTEGER NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      max_votes INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      position_id INTEGER NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      class TEXT DEFAULT '',
      symbol TEXT DEFAULT 'star',
      photo_url TEXT DEFAULT '',
      symbol_url TEXT DEFAULT '',
      bio TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS booths (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS otps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      election_id INTEGER NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
      otp TEXT NOT NULL,
      is_used INTEGER DEFAULT 0,
      used_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS voters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booth_id INTEGER REFERENCES booths(id) ON DELETE SET NULL,
      otp_id INTEGER REFERENCES otps(id) ON DELETE SET NULL,
      name TEXT DEFAULT '',
      has_voted INTEGER DEFAULT 0,
      voted_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      election_id INTEGER NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
      position_id INTEGER NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
      candidate_id INTEGER NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
      voter_id INTEGER NOT NULL REFERENCES voters(id) ON DELETE CASCADE,
      booth_id INTEGER REFERENCES booths(id) ON DELETE SET NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_otps_election ON otps(election_id);
    CREATE INDEX IF NOT EXISTS idx_otps_otp ON otps(otp);
    CREATE INDEX IF NOT EXISTS idx_votes_election ON votes(election_id);
  `);

  // Remove duplicate votes before creating UNIQUE index
  try { db.exec("DELETE FROM votes WHERE id NOT IN (SELECT MIN(id) FROM votes GROUP BY voter_id, position_id)"); } catch (e) {}
  try { db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_votes_voter_position ON votes(voter_id, position_id)"); } catch (e) {}

  try { db.exec(`
    CREATE TABLE IF NOT EXISTS ip_bindings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip_address TEXT UNIQUE NOT NULL,
      booth_code TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'voter',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `); } catch (e) {}

  try { db.exec(`
    CREATE TABLE IF NOT EXISTS evms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booth_code TEXT NOT NULL,
      evm_number INTEGER NOT NULL,
      ip_address TEXT DEFAULT '',
      status TEXT DEFAULT 'pending',
      votes_cast INTEGER DEFAULT 0,
      last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(booth_code, evm_number)
    );
  `); } catch (e) {}
  try { db.exec(`
    CREATE TABLE IF NOT EXISTS booth_devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booth_code TEXT NOT NULL,
      ip_address TEXT DEFAULT '',
      status TEXT DEFAULT 'pending',
      last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `); } catch (e) {}
  try { db.exec("ALTER TABLE booth_devices ADD COLUMN ip_address TEXT DEFAULT ''"); } catch (e) {}
  try { db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    );
  `); } catch (e) {}

  try { db.exec("ALTER TABLE candidates ADD COLUMN photo_url TEXT DEFAULT ''"); } catch (e) {}
  try { db.exec("ALTER TABLE candidates ADD COLUMN symbol_url TEXT DEFAULT ''"); } catch (e) {}
  try { db.exec("ALTER TABLE candidates ADD COLUMN is_nota INTEGER DEFAULT 0"); } catch (e) {}
  try { db.exec("ALTER TABLE candidates ADD COLUMN name_kn TEXT DEFAULT ''"); } catch (e) {}
  // Rename party to class
  try { db.exec("ALTER TABLE candidates RENAME COLUMN party TO class"); } catch (e) {}
  try { db.exec("ALTER TABLE candidates ADD COLUMN class TEXT DEFAULT ''"); } catch (e) {}
  try { db.exec("ALTER TABLE candidates ADD COLUMN serial INTEGER DEFAULT 0"); } catch (e) {}
  try { db.exec("ALTER TABLE elections ADD COLUMN total_voters INTEGER DEFAULT 0"); } catch (e) {}
  try { db.exec("ALTER TABLE elections ADD COLUMN is_mock INTEGER DEFAULT 0"); } catch (e) {}
  try { db.exec("UPDATE elections SET is_mock = 1 WHERE title LIKE 'Mock Election%'"); } catch (e) {}
  try { db.exec("ALTER TABLE voters ADD COLUMN name TEXT DEFAULT ''"); } catch (e) {}
  try { db.exec("ALTER TABLE voters ADD COLUMN booth_id INTEGER REFERENCES booths(id)"); } catch (e) {}
  try { db.exec("ALTER TABLE voters ADD COLUMN otp_id INTEGER REFERENCES otps(id)"); } catch (e) {}
  try { db.exec("ALTER TABLE votes ADD COLUMN booth_id INTEGER REFERENCES booths(id)"); } catch (e) {}
  // Ensure NOTA candidates exist for all positions
  const positions = db.prepare("SELECT id FROM positions").all();
  const existingNota = db.prepare("SELECT position_id FROM candidates WHERE is_nota = 1").all();
  const notaPositionIds = new Set(existingNota.map(r => r.position_id));
  const insertNota = db.prepare("INSERT INTO candidates (position_id, name, class, symbol, is_nota) VALUES (?, 'NOTA', '', 'cross', 1)");
  positions.forEach(p => {
    if (!notaPositionIds.has(p.id)) {
      insertNota.run(p.id);
    }
  });
}

const api = {
  // Elections
  getElections() {
    return getDb().prepare('SELECT * FROM elections ORDER BY created_at DESC').all();
  },

  getElection(id) {
    return getDb().prepare('SELECT * FROM elections WHERE id = ?').get(id);
  },

  createElection(title, description, isMock = false) {
    const stmt = getDb().prepare('INSERT INTO elections (title, description, is_mock) VALUES (?, ?, ?)');
    return stmt.run(title, description, isMock ? 1 : 0);
  },

  updateElection(id, title, description, totalVoters) {
    const stmt = getDb().prepare('UPDATE elections SET title = ?, description = ?, total_voters = ? WHERE id = ?');
    return stmt.run(title, description, totalVoters || 0, id);
  },

  deleteElection(id) {
    return getDb().prepare('DELETE FROM elections WHERE id = ?').run(id);
  },

  setElectionStatus(id, status) {
    return getDb().prepare('UPDATE elections SET status = ? WHERE id = ?').run(status, id);
  },

  deactivateAllElections() {
    return getDb().prepare("UPDATE elections SET status = 'draft' WHERE status = 'active'").run();
  },

  deactivateElectionsByType(isMock) {
    return getDb().prepare("UPDATE elections SET status = 'draft' WHERE status = 'active' AND is_mock = ?").run(isMock ? 1 : 0);
  },

  // Positions
  getPositions(electionId) {
    return getDb().prepare('SELECT * FROM positions WHERE election_id = ? ORDER BY sort_order').all(electionId);
  },

  createPosition(electionId, title, description, sortOrder, maxVotes) {
    const stmt = getDb().prepare('INSERT INTO positions (election_id, title, description, sort_order, max_votes) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(electionId, title, description, sortOrder || 0, maxVotes || 1);
    // Auto-create NOTA candidate
    const notaStmt = getDb().prepare("INSERT INTO candidates (position_id, name, class, symbol, is_nota) VALUES (?, 'NOTA', '', 'cross', 1)");
    notaStmt.run(result.lastInsertRowid);
    return result;
  },

  updatePosition(id, title, description, sortOrder, maxVotes) {
    const stmt = getDb().prepare('UPDATE positions SET title = ?, description = ?, sort_order = ?, max_votes = ? WHERE id = ?');
    return stmt.run(title, description, sortOrder, maxVotes, id);
  },

  deletePosition(id) {
    return getDb().prepare('DELETE FROM positions WHERE id = ?').run(id);
  },

  // Candidates
  getCandidates(positionId) {
    return getDb().prepare('SELECT * FROM candidates WHERE position_id = ? ORDER BY is_nota, serial, id').all(positionId);
  },

  createCandidate(positionId, name, cls, symbol, photoUrl, symbolUrl, bio, nameKn, serial) {
    const stmt = getDb().prepare('INSERT INTO candidates (position_id, name, class, symbol, photo_url, symbol_url, bio, name_kn, serial) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    return stmt.run(positionId, name, cls, symbol || 'star', photoUrl || '', symbolUrl || '', bio || '', nameKn || '', serial || 0);
  },

  updateCandidate(id, name, cls, symbol, photoUrl, symbolUrl, bio, nameKn) {
    const stmt = getDb().prepare('UPDATE candidates SET name = ?, class = ?, symbol = ?, photo_url = ?, symbol_url = ?, bio = ?, name_kn = ? WHERE id = ?');
    return stmt.run(name, cls, symbol, photoUrl, symbolUrl, bio, nameKn || '', id);
  },

  deleteCandidate(id) {
    const c = getDb().prepare('SELECT is_nota FROM candidates WHERE id = ?').get(id);
    if (c && c.is_nota) return { changes: 0 };
    return getDb().prepare('DELETE FROM candidates WHERE id = ?').run(id);
  },

  // Booths
  getBooths() {
    return getDb().prepare('SELECT * FROM booths ORDER BY created_at DESC').all();
  },

  createBooth(code, name) {
    const stmt = getDb().prepare('INSERT INTO booths (code, name) VALUES (?, ?)');
    stmt.run(code.toUpperCase(), name);
    return { code: code.toUpperCase(), name };
  },

  deleteBooth(id) {
    return getDb().prepare('DELETE FROM booths WHERE id = ?').run(id);
  },

  getBoothByCode(code) {
    return getDb().prepare('SELECT * FROM booths WHERE code = ?').get(code.toUpperCase());
  },

  getBooth(id) {
    return getDb().prepare('SELECT * FROM booths WHERE id = ?').get(id);
  },

  // OTPs
  generateOTPs(electionId, count) {
    const stmt = getDb().prepare('INSERT INTO otps (election_id, otp) VALUES (?, ?)');
    const insertMany = getDb().transaction((eId, cnt) => {
      const ids = [];
      for (let i = 0; i < cnt; i++) {
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const result = stmt.run(eId, otp);
        ids.push({ id: result.lastInsertRowid, otp });
      }
      return ids;
    });
    return insertMany(electionId, count);
  },

  getOTPs(electionId) {
    return getDb().prepare('SELECT * FROM otps WHERE election_id = ? ORDER BY created_at').all(electionId);
  },

  getUnusedOTPs(electionId) {
    return getDb().prepare('SELECT * FROM otps WHERE election_id = ? AND is_used = 0 ORDER BY created_at').all(electionId);
  },

  verifyOTP(electionId, otp) {
    return getDb().prepare('SELECT * FROM otps WHERE election_id = ? AND otp = ? AND is_used = 0').get(electionId, otp);
  },

  useOTP(otpId) {
    return getDb().prepare('UPDATE otps SET is_used = 1, used_at = CURRENT_TIMESTAMP WHERE id = ?').run(otpId);
  },

  getOTPCount(electionId) {
    const total = getDb().prepare('SELECT COUNT(*) as c FROM otps WHERE election_id = ?').get(electionId);
    const used = getDb().prepare('SELECT COUNT(*) as c FROM otps WHERE election_id = ? AND is_used = 1').get(electionId);
    return { total: total.c, used: used.c };
  },

  // Voters
  registerVoter(boothId, otpId) {
    const stmt = getDb().prepare('INSERT INTO voters (booth_id, otp_id) VALUES (?, ?)');
    return stmt.run(boothId, otpId);
  },

  getVoter(id) {
    return getDb().prepare('SELECT * FROM voters WHERE id = ?').get(id);
  },

  markVoted(voterId) {
    return getDb().prepare('UPDATE voters SET has_voted = 1, voted_at = CURRENT_TIMESTAMP WHERE id = ?').run(voterId);
  },

  getVoterByOtp(otpId) {
    return getDb().prepare('SELECT * FROM voters WHERE otp_id = ? ORDER BY id DESC LIMIT 1').get(otpId);
  },

  hasVotedForPosition(voterId, positionId) {
    const row = getDb().prepare('SELECT id FROM votes WHERE voter_id = ? AND position_id = ?').get(voterId, positionId);
    return !!row;
  },

  clearElectionVotes(electionId) {
    const db = getDb();
    const voterIds = db.prepare('SELECT DISTINCT voter_id FROM votes WHERE election_id = ?').all(electionId).map(r => r.voter_id);
    db.prepare('DELETE FROM votes WHERE election_id = ?').run(electionId);
    if (voterIds.length > 0) {
      const placeholders = voterIds.map(() => '?').join(',');
      db.prepare(`UPDATE voters SET has_voted = 0, voted_at = NULL WHERE id IN (${placeholders})`).run(...voterIds);
    }
    db.prepare('UPDATE evms SET votes_cast = 0').run();
    db.prepare('DELETE FROM voters WHERE booth_id IS NULL AND otp_id IS NULL').run();
  },

  // IP Bindings
  setBinding(ip, boothCode, type) {
    getDb().prepare(`
      INSERT INTO ip_bindings (ip_address, booth_code, type) VALUES (?, ?, ?)
      ON CONFLICT(ip_address) DO UPDATE SET booth_code = excluded.booth_code, type = excluded.type
    `).run(ip, boothCode, type);
  },

  getBinding(ip) {
    return getDb().prepare('SELECT * FROM ip_bindings WHERE ip_address = ?').get(ip);
  },

  deleteBinding(ip) {
    getDb().prepare('DELETE FROM ip_bindings WHERE ip_address = ?').run(ip);
  },

  getAllBindings() {
    return getDb().prepare('SELECT * FROM ip_bindings ORDER BY created_at DESC').all();
  },

  // Votes
  castVote(electionId, positionId, candidateId, voterId, boothId) {
    const stmt = getDb().prepare('INSERT INTO votes (election_id, position_id, candidate_id, voter_id, booth_id) VALUES (?, ?, ?, ?, ?)');
    return stmt.run(electionId, positionId, candidateId, voterId, boothId);
  },

  getVoteCounts(electionId) {
    return getDb().prepare(`
      SELECT c.id, c.name, c.name_kn, c.class, c.symbol, c.photo_url, c.symbol_url, c.is_nota, c.serial, p.title as position_title,
             COUNT(v.id) as vote_count
      FROM candidates c
      JOIN positions p ON c.position_id = p.id
      LEFT JOIN votes v ON v.candidate_id = c.id AND v.election_id = ?
      WHERE p.election_id = ?
      GROUP BY c.id
      ORDER BY p.sort_order, c.is_nota, c.serial, c.id
    `).all(electionId, electionId);
  },

  getVoterProgress(electionId) {
    const voted = getDb().prepare('SELECT COUNT(DISTINCT voter_id) as c FROM votes WHERE election_id = ?').get(electionId);
    const election = getDb().prepare('SELECT total_voters FROM elections WHERE id = ?').get(electionId);
    const total = (election && election.total_voters > 0) ? election.total_voters : getDb().prepare('SELECT COUNT(*) as c FROM voters').get().c;
    return { voted: voted.c, total };
  },

  getElectionResults(electionId) {
    return getDb().prepare(`
      SELECT p.id as position_id, p.title as position_title,
             c.id as candidate_id, c.name as candidate_name, c.name_kn, c.class, c.symbol, c.photo_url, c.symbol_url, c.is_nota, c.serial,
             COUNT(v.id) as vote_count
      FROM positions p
      JOIN candidates c ON c.position_id = p.id
      LEFT JOIN votes v ON v.candidate_id = c.id AND v.election_id = ?
      WHERE p.election_id = ?
      GROUP BY c.id
      ORDER BY p.sort_order, c.is_nota, c.serial, vote_count DESC
    `).all(electionId, electionId);
  },

  // EVMs
  registerEvm(boothCode, ip) {
    const existing = getDb().prepare('SELECT * FROM evms WHERE booth_code = ? AND ip_address = ?').get(boothCode, ip);
    if (existing) {
      getDb().prepare('UPDATE evms SET last_seen = CURRENT_TIMESTAMP WHERE id = ?').run(existing.id);
      return existing;
    }
    const pendingCount = getDb().prepare('SELECT COUNT(*) as c FROM evms WHERE booth_code = ? AND status = ?').get(boothCode, 'pending');
    const maxNum = getDb().prepare('SELECT MAX(evm_number) as mx FROM evms WHERE booth_code = ?').get(boothCode);
    const nextNum = (maxNum?.mx || 0) + 1;
    const stmt = getDb().prepare('INSERT INTO evms (booth_code, evm_number, ip_address, status) VALUES (?, ?, ?, ?)');
    stmt.run(boothCode, nextNum, ip, 'pending');
    return { evm_number: nextNum, ip_address: ip, status: 'pending', votes_cast: 0, booth_code: boothCode };
  },

  updateEvmStatus(boothCode, evmNumber, status) {
    getDb().prepare('UPDATE evms SET status = ?, last_seen = CURRENT_TIMESTAMP WHERE booth_code = ? AND evm_number = ? AND status IN (\'approved\',\'ready\',\'voting\')').run(status, boothCode, evmNumber);
  },

  getBoothEvms(boothCode) {
    return getDb().prepare("SELECT * FROM evms WHERE booth_code = ? AND status != 'pending' ORDER BY evm_number").all(boothCode);
  },

  getPendingEvms() {
    return getDb().prepare(`SELECT e.*, b.name as booth_name FROM evms e JOIN booths b ON b.code = e.booth_code WHERE e.status = 'pending' ORDER BY e.created_at DESC`).all();
  },

  getAllEvms() {
    return getDb().prepare(`SELECT e.*, b.name as booth_name FROM evms e JOIN booths b ON b.code = e.booth_code WHERE e.status != 'pending' ORDER BY e.booth_code, e.evm_number`).all();
  },

  approveEvm(id) {
    getDb().prepare("UPDATE evms SET status = 'ready', last_seen = CURRENT_TIMESTAMP WHERE id = ?").run(id);
  },

  rejectEvm(id) {
    getDb().prepare('DELETE FROM evms WHERE id = ?').run(id);
  },

  clearEvmsForBooth(boothCode) {
    getDb().prepare('DELETE FROM evms WHERE booth_code = ?').run(boothCode);
  },

  clearAllEvms() {
    getDb().prepare('DELETE FROM evms').run();
  },

  incrementEvmVotes(boothCode, evmNumber) {
    getDb().prepare('UPDATE evms SET votes_cast = votes_cast + 1, last_seen = CURRENT_TIMESTAMP WHERE booth_code = ? AND evm_number = ?').run(boothCode, evmNumber);
  },

  // Booth Devices
  registerBoothDevice(boothCode, ip) {
    const existing = getDb().prepare('SELECT * FROM booth_devices WHERE booth_code = ? AND ip_address = ?').get(boothCode, ip);
    if (existing) {
      getDb().prepare('UPDATE booth_devices SET last_seen = CURRENT_TIMESTAMP WHERE id = ?').run(existing.id);
      return existing;
    }
    const stmt = getDb().prepare('INSERT INTO booth_devices (booth_code, ip_address, status) VALUES (?, ?, ?)');
    stmt.run(boothCode, ip, 'pending');
    return { booth_code: boothCode, ip_address: ip, status: 'pending' };
  },

  getPendingBoothDevices() {
    return getDb().prepare(`SELECT d.*, b.name as booth_name FROM booth_devices d JOIN booths b ON b.code = d.booth_code WHERE d.status = 'pending' ORDER BY d.created_at DESC`).all();
  },

  getAllBoothDevices() {
    return getDb().prepare(`SELECT d.*, b.name as booth_name FROM booth_devices d JOIN booths b ON b.code = d.booth_code WHERE d.status = 'approved' ORDER BY d.booth_code`).all();
  },

  approveBoothDevice(id) {
    getDb().prepare("UPDATE booth_devices SET status = 'approved', last_seen = CURRENT_TIMESTAMP WHERE id = ?").run(id);
  },

  rejectBoothDevice(id) {
    getDb().prepare('DELETE FROM booth_devices WHERE id = ?').run(id);
  },

  clearBoothDevices(boothCode) {
    if (boothCode) {
      getDb().prepare('DELETE FROM booth_devices WHERE booth_code = ?').run(boothCode);
    } else {
      getDb().prepare('DELETE FROM booth_devices').run();
    }
  },

  // Settings
  getSettings() {
    const rows = getDb().prepare('SELECT key, value FROM settings').all();
    const s = {};
    rows.forEach(r => s[r.key] = r.value);
    return s;
  },

  getSetting(key) {
    const row = getDb().prepare('SELECT value FROM settings WHERE key = ?').get(key);
    return row ? row.value : null;
  },

  setSetting(key, value) {
    getDb().prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
  }
};

module.exports = api;
