const Database = require('better-sqlite3');
const fs = require('fs');
const db = new Database('/app/data/evote.db');
const cands = db.prepare('SELECT id, serial FROM candidates WHERE is_nota=0 AND serial>0').all();
let fixed = 0;
cands.forEach(c => {
  const hp = fs.existsSync('/app/uploads/photos/' + c.serial + '.jpg') || fs.existsSync('/app/uploads/photos/' + c.serial + '.png');
  const hs = fs.existsSync('/app/uploads/symbols/' + c.serial + '.jpg') || fs.existsSync('/app/uploads/symbols/' + c.serial + '.png');
  if (!hp) { db.prepare("UPDATE candidates SET photo_url='/uploads/photos/0.jpg' WHERE id=?").run(c.id); fixed++; }
  if (!hs) { db.prepare("UPDATE candidates SET symbol_url='/uploads/symbols/0.jpg' WHERE id=?").run(c.id); fixed++; }
});
console.log('Fixed ' + fixed);
db.close();
