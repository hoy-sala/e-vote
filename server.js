const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
const db = require('./db');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 5050;

const uploadsDir = path.join(__dirname, 'uploads');
const photosDir = path.join(uploadsDir, 'photos');
const symbolsDir = path.join(uploadsDir, 'symbols');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(photosDir)) fs.mkdirSync(photosDir, { recursive: true });
if (!fs.existsSync(symbolsDir)) fs.mkdirSync(symbolsDir, { recursive: true });

function makeStorage(subdir) {
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, subdir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || '.jpg';
      cb(null, crypto.randomBytes(12).toString('hex') + ext);
    }
  });
}
const uploadPhoto = multer({ storage: makeStorage(photosDir), limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: (req, file, cb) => { if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed'), false); cb(null, true); } });
const uploadSymbol = multer({ storage: makeStorage(symbolsDir), limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: (req, file, cb) => { if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed'), false); cb(null, true); } });
const uploadGeneric = multer({ storage: makeStorage(uploadsDir), limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: (req, file, cb) => { if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed'), false); cb(null, true); } });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));

// Simple Basic Auth for admin
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

function adminAuth(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="e-Vote Admin"');
    return res.status(401).json({ error: 'Authentication required' });
  }
  const buf = Buffer.from(auth.slice(6), 'base64').toString();
  const colon = buf.indexOf(':');
  const user = buf.slice(0, colon);
  const pass = buf.slice(colon + 1);
  if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
    return res.status(403).json({ error: 'Invalid credentials' });
  }
  next();
}

// Protect all /api/admin routes and /admin page
app.use('/api/admin', adminAuth);

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(msg);
  });
}

// --- Elections ---

app.get('/api/elections', (req, res) => res.json(db.getElections()));

app.post('/api/elections', (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const result = db.createElection(title, description || '');
  res.json({ id: result.lastInsertRowid });
});

app.get('/api/elections/:id', (req, res) => {
  const election = db.getElection(req.params.id);
  if (!election) return res.status(404).json({ error: 'Not found' });
  election.positions = db.getPositions(election.id);
  election.positions.forEach(p => {
    p.candidates = db.getCandidates(p.id);
  });
  election.otpCount = db.getOTPCount(election.id);
  res.json(election);
});

app.put('/api/elections/:id', (req, res) => {
  const { title, description, total_voters } = req.body;
  db.updateElection(req.params.id, title, description, total_voters);
  res.json({ ok: true });
});

app.delete('/api/elections/:id', (req, res) => {
  db.deleteElection(req.params.id);
  res.json({ ok: true });
});

app.post('/api/elections/:id/activate', (req, res) => {
  const election = db.getElection(req.params.id);
  if (!election) return res.status(404).json({ error: 'Not found' });
  db.deactivateElectionsByType(election.is_mock);
  db.setElectionStatus(req.params.id, 'active');
  broadcast({ type: 'election_status', electionId: parseInt(req.params.id), status: 'active' });
  res.json({ ok: true });
});

app.post('/api/elections/:id/close', (req, res) => {
  db.setElectionStatus(req.params.id, 'closed');
  const remaining = db.getElections().filter(e => e.status === 'active');
  if (remaining.length === 0) {
    db.clearAllEvms();
    db.clearBoothDevices();
    broadcast({ type: 'evms_cleared' });
  }
  broadcast({ type: 'election_status', electionId: parseInt(req.params.id), status: 'closed' });
  res.json({ ok: true });
});

app.post('/api/elections/:id/deactivate', (req, res) => {
  db.setElectionStatus(req.params.id, 'draft');
  broadcast({ type: 'election_status', electionId: parseInt(req.params.id), status: 'draft' });
  res.json({ ok: true });
});

app.post('/api/elections/:id/reset-votes', (req, res) => {
  db.clearElectionVotes(req.params.id);
  broadcast({ type: 'votes_reset', electionId: parseInt(req.params.id) });
  res.json({ ok: true });
});

app.post('/api/elections/mock', (req, res) => {
  const result = db.createElection('Mock Election ' + new Date().getFullYear(), 'Auto-generated mock election for testing', true);
  const eid = result.lastInsertRowid;

  const positions = [
    { title: 'Head Boy', desc: 'School Head Boy', order: 1, candidates: [
      { name: 'Arjun Mehta', cls: '10', sym: 'star', kn: 'ಅರ್ಜುನ್ ಮೆಹ್ತಾ', s: 1 },
      { name: 'Priya Sharma', cls: '10', sym: 'heart', kn: 'ಪ್ರಿಯಾ ಶರ್ಮಾ', s: 2 },
      { name: 'Rahul Verma', cls: '9', sym: 'diamond', kn: 'ರಾಹುಲ್ ವರ್ಮಾ', s: 3 },
    ]},
    { title: 'Head Girl', desc: 'School Head Girl', order: 2, candidates: [
      { name: 'Ananya Gupta', cls: '10', sym: 'flower', kn: 'ಅನನ್ಯಾ ಗುಪ್ತಾ', s: 4 },
      { name: 'Sneha Reddy', cls: '10', sym: 'lion', kn: 'ಸ್ನೇಹಾ ರೆಡ್ಡಿ', s: 5 },
      { name: 'Divya Nair', cls: '9', sym: 'sun', kn: 'ದಿವ್ಯಾ ನಾಯರ್', s: 6 },
    ]},
    { title: 'Sports Captain', desc: 'Sports & Athletics', order: 3, candidates: [
      { name: 'Aarav Khanna', cls: '10', sym: 'flag', kn: 'ಆರವ್ ಖನ್ನಾ', s: 7 },
      { name: 'Isha Patel', cls: '9', sym: 'star', kn: 'ಈಶಾ ಪಟೇಲ್', s: 8 },
      { name: 'Sahil Thakur', cls: '9', sym: 'moon', kn: 'ಸಾಹಿಲ್ ಠಾಕೂರ್', s: 9 },
    ]},
    { title: 'Cultural Secretary', desc: 'Cultural Activities', order: 4, candidates: [
      { name: 'Riya Sen', cls: '10', sym: 'book', kn: 'ರಿಯಾ ಸೇನ್', s: 10 },
      { name: 'Aditya Kapoor', cls: '10', sym: 'tree', kn: 'ಆದಿತ್ಯ ಕಪೂರ್', s: 11 },
    ]},
    { title: 'Discipline Prefect', desc: 'Discipline & Conduct', order: 5, candidates: [
      { name: 'Karan Singh', cls: '10', sym: 'circle', kn: 'ಕರಣ್ ಸಿಂಗ್', s: 12 },
      { name: 'Rohit Joshi', cls: '9', sym: 'triangle', kn: 'ರೋಹಿತ್ ಜೋಷಿ', s: 13 },
      { name: 'Meera Iyer', cls: '8', sym: 'hand', kn: 'ಮೀರಾ ಅಯ್ಯರ್', s: 14 },
    ]},
    { title: 'Class Representative', desc: 'Student Representative', order: 6, candidates: [
      { name: 'Amit Kumar', cls: '10', sym: 'car', kn: 'ಅಮಿತ್ ಕುಮಾರ್', s: 15 },
      { name: 'Pooja Deshmukh', cls: '9', sym: 'diamond', kn: 'ಪೂಜಾ ದೇಶ್ಮುಖ್', s: 16 },
      { name: 'Tanmay Kulkarni', cls: '9', sym: 'star', kn: 'ತನ್ಮಯ್ ಕುಲಕರ್ಣಿ', s: 17 },
      { name: 'Kavya Mohan', cls: '8', sym: 'heart', kn: 'ಕಾವ್ಯಾ ಮೋಹನ್', s: 18 },
    ]},
  ];

  positions.forEach(p => {
    const pid = db.createPosition(eid, p.title, p.desc, p.order, 1).lastInsertRowid;
    p.candidates.forEach(c => {
      db.createCandidate(pid, c.name, c.cls, c.sym, '/uploads/photos/0.jpg', '/uploads/symbols/0.png', '', c.kn, c.s);
    });
  });

  db.generateOTPs(eid, 50);
  db.deactivateElectionsByType(true);
  db.setElectionStatus(eid, 'active');
  res.json({ id: eid, title: 'Mock Election ' + new Date().getFullYear() });
});

// --- Positions ---

app.get('/api/elections/:id/positions', (req, res) => res.json(db.getPositions(req.params.id)));

app.post('/api/elections/:id/positions', (req, res) => {
  const { title, description, sort_order, max_votes } = req.body;
  const result = db.createPosition(req.params.id, title, description, sort_order, max_votes);
  res.json({ id: result.lastInsertRowid });
});

app.put('/api/positions/:id', (req, res) => {
  const { title, description, sort_order, max_votes } = req.body;
  db.updatePosition(req.params.id, title, description, sort_order, max_votes);
  res.json({ ok: true });
});

app.delete('/api/positions/:id', (req, res) => {
  db.deletePosition(req.params.id);
  res.json({ ok: true });
});

// --- Candidates ---

app.get('/api/positions/:id/candidates', (req, res) => res.json(db.getCandidates(req.params.id)));

app.post('/api/positions/:id/candidates', (req, res) => {
  const { name, class: cls, symbol, photo_url, symbol_url, bio, name_kn, serial } = req.body;
  const result = db.createCandidate(req.params.id, name, cls, symbol, photo_url, symbol_url, bio, name_kn, serial);
  res.json({ id: result.lastInsertRowid });
});

app.put('/api/candidates/:id', (req, res) => {
const { name, class: cls, symbol, photo_url, symbol_url, bio, name_kn } = req.body;
      db.updateCandidate(req.params.id, name, cls, symbol, photo_url, symbol_url, bio, name_kn);
  res.json({ ok: true });
});

app.delete('/api/candidates/:id', (req, res) => {
  db.deleteCandidate(req.params.id);
  res.json({ ok: true });
});

function extractSerial(filename) {
  const m = filename.match(/^(\d+)\.\w+$/);
  return m ? parseInt(m[1], 10) : null;
}

app.post('/api/elections/:id/photos/bulk', uploadPhoto.array('files'), (req, res) => {
  const positions = db.getPositions(req.params.id);
  let allCandidates = [];
  positions.forEach(p => {
    db.getCandidates(p.id).filter(c => !c.is_nota).forEach(c => allCandidates.push(c));
  });
  const serialMap = {};
  allCandidates.forEach(c => { if (c.serial) serialMap[c.serial] = c; });
  const sorted = req.files.slice().sort((a, b) => a.originalname.localeCompare(b.originalname, undefined, { numeric: true }));
  const defaultFile = sorted.find(f => /^0\.\w+$/i.test(f.originalname));
  const results = [];
  const updatedIds = new Set();
  sorted.forEach(file => {
    if (/^0\.\w+$/i.test(file.originalname)) return;
    const serial = extractSerial(file.originalname);
    const c = serial ? serialMap[serial] : null;
    if (!c) return;
    const url = '/uploads/photos/' + file.filename;
    db.updateCandidate(c.id, c.name, c.class, c.symbol, url, c.symbol_url, c.bio, c.name_kn);
    updatedIds.add(c.id);
    results.push({ candidateId: c.id, url, file: file.originalname });
  });
  if (defaultFile) {
    const defaultUrl = '/uploads/photos/' + defaultFile.filename;
    allCandidates.forEach(c => {
      if (!updatedIds.has(c.id)) {
        db.updateCandidate(c.id, c.name, c.class, c.symbol, defaultUrl, c.symbol_url, c.bio, c.name_kn);
        results.push({ candidateId: c.id, url: defaultUrl, file: defaultFile.originalname });
      }
    });
  }
  res.json({ updated: results.length, results });
});

app.post('/api/elections/:id/symbols/bulk', uploadSymbol.array('files'), (req, res) => {
  const positions = db.getPositions(req.params.id);
  let allCandidates = [];
  positions.forEach(p => {
    db.getCandidates(p.id).filter(c => !c.is_nota).forEach(c => allCandidates.push(c));
  });
  const serialMap = {};
  allCandidates.forEach(c => { if (c.serial) serialMap[c.serial] = c; });
  const sorted = req.files.slice().sort((a, b) => a.originalname.localeCompare(b.originalname, undefined, { numeric: true }));
  const defaultFile = sorted.find(f => /^0\.\w+$/i.test(f.originalname));
  const results = [];
  const updatedIds = new Set();
  sorted.forEach(file => {
    if (/^0\.\w+$/i.test(file.originalname)) return;
    const serial = extractSerial(file.originalname);
    const c = serial ? serialMap[serial] : null;
    if (!c) return;
    const url = '/uploads/symbols/' + file.filename;
    db.updateCandidate(c.id, c.name, c.class, c.symbol, c.photo_url, url, c.bio, c.name_kn);
    updatedIds.add(c.id);
    results.push({ candidateId: c.id, url, file: file.originalname });
  });
  if (defaultFile) {
    const defaultUrl = '/uploads/symbols/' + defaultFile.filename;
    allCandidates.forEach(c => {
      if (!updatedIds.has(c.id)) {
        db.updateCandidate(c.id, c.name, c.class, c.symbol, c.photo_url, defaultUrl, c.bio, c.name_kn);
        results.push({ candidateId: c.id, url: defaultUrl, file: defaultFile.originalname });
      }
    });
  }
  res.json({ updated: results.length, results });
});

app.post('/api/positions/:id/photos/bulk', uploadPhoto.array('files'), (req, res) => {
  const candidates = db.getCandidates(req.params.id).filter(c => !c.is_nota);
  const serialMap = {};
  candidates.forEach(c => { if (c.serial) serialMap[c.serial] = c; });
  const sorted = req.files.slice().sort((a, b) => a.originalname.localeCompare(b.originalname, undefined, { numeric: true }));
  const defaultFile = sorted.find(f => /^0\.\w+$/i.test(f.originalname));
  const results = [];
  const updatedIds = new Set();
  sorted.forEach(file => {
    if (/^0\.\w+$/i.test(file.originalname)) return;
    const serial = extractSerial(file.originalname);
    const c = serial ? serialMap[serial] : null;
    if (!c) return;
    const url = '/uploads/photos/' + file.filename;
    db.updateCandidate(c.id, c.name, c.class, c.symbol, url, c.symbol_url, c.bio, c.name_kn);
    updatedIds.add(c.id);
    results.push({ candidateId: c.id, url, file: file.originalname });
  });
  if (defaultFile) {
    const defaultUrl = '/uploads/photos/' + defaultFile.filename;
    candidates.forEach(c => {
      if (!updatedIds.has(c.id)) {
        db.updateCandidate(c.id, c.name, c.class, c.symbol, defaultUrl, c.symbol_url, c.bio, c.name_kn);
        results.push({ candidateId: c.id, url: defaultUrl, file: defaultFile.originalname });
      }
    });
  }
  res.json({ updated: results.length, results });
});

app.post('/api/positions/:id/symbols/bulk', uploadSymbol.array('files'), (req, res) => {
  const candidates = db.getCandidates(req.params.id).filter(c => !c.is_nota);
  const serialMap = {};
  candidates.forEach(c => { if (c.serial) serialMap[c.serial] = c; });
  const sorted = req.files.slice().sort((a, b) => a.originalname.localeCompare(b.originalname, undefined, { numeric: true }));
  const defaultFile = sorted.find(f => /^0\.\w+$/i.test(f.originalname));
  const results = [];
  const updatedIds = new Set();
  sorted.forEach(file => {
    if (/^0\.\w+$/i.test(file.originalname)) return;
    const serial = extractSerial(file.originalname);
    const c = serial ? serialMap[serial] : null;
    if (!c) return;
    const url = '/uploads/symbols/' + file.filename;
    db.updateCandidate(c.id, c.name, c.class, c.symbol, c.photo_url, url, c.bio, c.name_kn);
    updatedIds.add(c.id);
    results.push({ candidateId: c.id, url, file: file.originalname });
  });
  if (defaultFile) {
    const defaultUrl = '/uploads/symbols/' + defaultFile.filename;
    candidates.forEach(c => {
      if (!updatedIds.has(c.id)) {
        db.updateCandidate(c.id, c.name, c.class, c.symbol, c.photo_url, defaultUrl, c.bio, c.name_kn);
        results.push({ candidateId: c.id, url: defaultUrl, file: defaultFile.originalname });
      }
    });
  }
  res.json({ updated: results.length, results });
});

// --- Booths ---

app.get('/api/booths', (req, res) => res.json(db.getBooths()));

app.post('/api/booths', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  let code;
  do {
    code = Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');
  } while (db.getBoothByCode(code));
  const booth = db.createBooth(code, name);
  res.json(booth);
});

app.delete('/api/booths/:id', (req, res) => {
  db.deleteBooth(req.params.id);
  res.json({ ok: true });
});

// --- OTPs ---

app.post('/api/elections/:id/otps/generate', (req, res) => {
  const { count } = req.body;
  const n = Math.min(Math.max(parseInt(count) || 10, 1), 500);
  const otps = db.generateOTPs(req.params.id, n);
  res.json({ count: otps.length, otps });
});

app.get('/api/elections/:id/otps', (req, res) => {
  const otps = db.getOTPs(req.params.id);
  res.json(otps);
});

app.get('/api/elections/:id/otps/unused', (req, res) => {
  const otps = db.getUnusedOTPs(req.params.id);
  res.json(otps);
});

// --- Upload ---

app.post('/api/upload', uploadGeneric.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: '/uploads/' + req.file.filename });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) return res.status(400).json({ error: err.message });
  if (err) return res.status(400).json({ error: err.message });
  next();
});

// --- EVM routes ---

app.post('/api/evm/register', (req, res) => {
  const { boothCode } = req.body;
  if (!boothCode) return res.status(400).json({ error: 'boothCode required' });
  const booth = db.getBoothByCode(boothCode);
  if (!booth) return res.status(404).json({ error: 'Invalid booth code' });
  const ip = clientIP(req);
  const evm = db.registerEvm(boothCode, ip || '');
  broadcast({ type: 'evm_added', boothCode, evm, status: evm.status });
  if (evm.status === 'pending') {
    res.json({ evmNumber: evm.evm_number, boothCode, status: 'pending', message: 'Awaiting admin approval' });
  } else {
    res.json({ evmNumber: evm.evm_number, boothCode, status: evm.status });
  }
});

app.post('/api/evm/status', (req, res) => {
  const { boothCode, evmNumber, status } = req.body;
  if (!boothCode || !evmNumber || !status) return res.status(400).json({ error: 'Missing fields' });
  db.updateEvmStatus(boothCode, evmNumber, status);
  broadcast({ type: 'evm_status', boothCode, evmNumber, status });
  res.json({ ok: true });
});

app.get('/api/pro/booth/:code/evms', (req, res) => {
  const booth = db.getBoothByCode(req.params.code);
  if (!booth) return res.status(404).json({ error: 'Invalid booth code' });
  const evms = db.getBoothEvms(req.params.code);
  res.json(evms);
});

// --- Booth/Voter routes ---

app.post('/api/booth/verify', (req, res) => {
  const { code } = req.body;
  const booth = db.getBoothByCode(code);
  if (!booth) return res.status(404).json({ error: 'Invalid booth code' });
  res.json(booth);
});

app.post('/api/booth/device/register', (req, res) => {
  const { boothCode } = req.body;
  if (!boothCode) return res.status(400).json({ error: 'boothCode required' });
  const booth = db.getBoothByCode(boothCode);
  if (!booth) return res.status(404).json({ error: 'Invalid booth code' });
  const ip = clientIP(req);
  const dev = db.registerBoothDevice(boothCode, ip || '');
  broadcast({ type: 'booth_device_added', boothCode, status: dev.status });
  if (dev.status === 'pending') {
    res.json({ status: 'pending', message: 'Awaiting admin approval' });
  } else {
    res.json({ status: dev.status });
  }
});

app.post('/api/voter/verify-otp', (req, res) => {
  const { boothCode, otp } = req.body;
  const booth = db.getBoothByCode(boothCode);
  if (!booth) return res.status(404).json({ error: 'Invalid booth code' });

  const elections = db.getElections();
  const active = elections.find(e => e.status === 'active' && !e.is_mock);
  if (!active) return res.status(400).json({ error: 'No active election' });

  let otpRecord, voterResult;
  otpRecord = db.verifyOTP(active.id, otp);
  if (!otpRecord) return res.status(400).json({ error: 'Invalid or already used OTP' });
  db.useOTP(otpRecord.id);
  voterResult = db.registerVoter(booth.id, otpRecord.id);

  res.json({
    voterId: voterResult.lastInsertRowid,
    boothId: booth.id,
    electionId: active.id,
    booth: booth
  });
});

app.get('/api/voter/election/:id', (req, res) => {
  const election = db.getElection(req.params.id);
  if (!election) return res.status(404).json({ error: 'Not found' });
  if (election.status !== 'active') return res.status(400).json({ error: 'Election not active' });
  const positions = db.getPositions(election.id);
  positions.forEach(p => {
    p.candidates = db.getCandidates(p.id);
  });
  res.json({ election, positions });
});

app.post('/api/voter/cast', (req, res) => {
  const { electionId, positionId, candidateId, voterId, boothId } = req.body;
  const voter = db.getVoter(voterId);
  if (!voter || voter.has_voted) return res.status(400).json({ error: 'Voter already voted' });
  if (db.hasVotedForPosition(voterId, positionId)) return res.status(400).json({ error: 'Already voted for this position' });

  db.castVote(electionId, positionId, candidateId, voterId, boothId);
  broadcast({ type: 'vote_cast', electionId, positionId, candidateId, boothId });

  res.json({ ok: true });
});

app.post('/api/voter/finalize', (req, res) => {
  const { voterId, evmNumber } = req.body;
  db.markVoted(voterId);
  const voter = db.getVoter(voterId);
  if (evmNumber && voter) {
    const boothCode = db.getBooth(voter.booth_id)?.code;
    if (boothCode) db.incrementEvmVotes(boothCode, evmNumber);
    broadcast({ type: 'evm_vote', boothCode, evmNumber, voterId });
  }
  broadcast({ type: 'voter_done', voterId, boothId: voter.booth_id });
  res.json({ ok: true });
});

// --- Pro routes ---

app.get('/api/pro/election/:id/progress', (req, res) => {
  const election = db.getElection(req.params.id);
  if (!election) return res.status(404).json({ error: 'Not found' });
  const positions = db.getPositions(election.id);
  const voteCounts = db.getVoteCounts(election.id);
  const totalVoters = db.getVoterProgress(election.id);
  res.json({ election, positions, voteCounts, progress: totalVoters });
});

app.get('/api/pro/election/:id/results', (req, res) => {
  const results = db.getElectionResults(req.params.id);
  res.json(results);
});

// --- IP Binding ---
function clientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.socket.remoteAddress;
}

app.get('/api/binding', (req, res) => {
  const ip = clientIP(req);
  if (!ip) return res.json({ error: 'No IP' });
  const binding = db.getBinding(ip);
  res.json(binding || {});
});

app.delete('/api/binding', (req, res) => {
  const ip = clientIP(req);
  if (ip) db.deleteBinding(ip);
  res.json({ ok: true });
});

app.get('/api/admin/bindings', (req, res) => {
  res.json(db.getAllBindings());
});

app.post('/api/admin/bindings', (req, res) => {
  const { ip, boothCode, type } = req.body;
  if (!ip || !boothCode) return res.status(400).json({ error: 'ip and boothCode required' });
  db.setBinding(ip, boothCode.toUpperCase(), type || 'voter');
  res.json({ ok: true });
});

app.delete('/api/admin/binding/:ip', (req, res) => {
  db.deleteBinding(req.params.ip);
  res.json({ ok: true });
});

// --- Admin EVM management ---

// --- Admin Booth Device management ---

app.get('/api/admin/booth-devices/pending', (req, res) => {
  res.json(db.getPendingBoothDevices());
});

app.get('/api/admin/booth-devices/all', (req, res) => {
  res.json(db.getAllBoothDevices());
});

app.post('/api/admin/booth-devices/:id/approve', (req, res) => {
  db.approveBoothDevice(req.params.id);
  broadcast({ type: 'booth_device_approved', deviceId: parseInt(req.params.id) });
  res.json({ ok: true });
});

app.delete('/api/admin/booth-devices/:id', (req, res) => {
  db.rejectBoothDevice(req.params.id);
  res.json({ ok: true });
});

app.get('/api/admin/evms/pending', (req, res) => {
  res.json(db.getPendingEvms());
});

app.get('/api/admin/evms/all', (req, res) => {
  res.json(db.getAllEvms());
});

app.post('/api/admin/evms/:id/approve', (req, res) => {
  db.approveEvm(req.params.id);
  broadcast({ type: 'evm_approved', evmId: parseInt(req.params.id) });
  res.json({ ok: true });
});

app.delete('/api/admin/evms/:id', (req, res) => {
  db.rejectEvm(req.params.id);
  res.json({ ok: true });
});

// Settings
app.get('/api/admin/settings', (req, res) => {
  res.json(db.getSettings());
});

app.put('/api/admin/settings', (req, res) => {
  const { school_name, school_logo_url, language } = req.body;
  if (school_name !== undefined) db.setSetting('school_name', school_name);
  if (school_logo_url !== undefined) db.setSetting('school_logo_url', school_logo_url);
  if (language !== undefined) db.setSetting('language', language);
  res.json(db.getSettings());
});

app.get('/api/settings/language', (req, res) => {
  const lang = db.getSetting('language');
  res.json({ language: lang || 'kn' });
});

// --- Frontend ---

app.get('/admin', adminAuth, (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/pro', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pro.html')));
app.get('/voter', (req, res) => res.sendFile(path.join(__dirname, 'public', 'voter.html')));
app.get('/mock', (req, res) => res.sendFile(path.join(__dirname, 'public', 'mock.html')));

server.listen(PORT, '0.0.0.0', () => {
  console.log(`e-vote server running on http://0.0.0.0:${PORT}`);
  console.log(`  Admin: http://localhost:${PORT}/admin`);
  console.log(`  Pro:   http://localhost:${PORT}/pro`);
  console.log(`  Voter: http://localhost:${PORT}/voter`);
  console.log(`  Mock:  http://localhost:${PORT}/mock`);
});
