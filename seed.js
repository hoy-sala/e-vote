const db = require('./db');

// Clear existing data
const d = require('better-sqlite3')(require('path').join(__dirname, 'data', 'evote.db'));
d.exec('DELETE FROM votes');
d.exec('DELETE FROM voters');
d.exec('DELETE FROM otps');
d.exec('DELETE FROM candidates');
d.exec('DELETE FROM positions');
d.exec('DELETE FROM booths');
d.exec('DELETE FROM elections');
d.close();

// Election
const e1 = db.createElection('Student Council Election 2025', 'Annual student council elections for the academic year 2025-26');
db.setElectionStatus(e1.lastInsertRowid, 'active');

// Positions
const pos1 = db.createPosition(e1.lastInsertRowid, 'President', 'Head of Student Council', 1, 1);
const pos2 = db.createPosition(e1.lastInsertRowid, 'Vice President', 'Deputy Head of Student Council', 2, 1);
const pos3 = db.createPosition(e1.lastInsertRowid, 'Secretary', 'Student Council Secretary', 3, 1);
const pos4 = db.createPosition(e1.lastInsertRowid, 'Class Representative', 'CR - Science Wing', 4, 2);

// Candidates for President
db.createCandidate(pos1.lastInsertRowid, 'Arjun Sharma', 'Progressive Party', 'star', '', '', '', 'ಅರ್ಜುನ್ ಶರ್ಮಾ');
db.createCandidate(pos1.lastInsertRowid, 'Kavya Nair', 'Unity Alliance', 'heart', '', '', '', 'ಕಾವ್ಯಾ ನಾಯರ್');
db.createCandidate(pos1.lastInsertRowid, 'Rahul Verma', 'Student Front', 'lion', '', '', '', 'ರಾಹುಲ್ ವರ್ಮಾ');
db.createCandidate(pos1.lastInsertRowid, 'Priya Singh', 'Forward Bloc', 'sun', '', '', '', 'ಪ್ರಿಯಾ ಸಿಂಗ್');

// Candidates for Vice President
db.createCandidate(pos2.lastInsertRowid, 'Ananya Gupta', 'Progressive Party', 'diamond', '', '', '', 'ಅನನ್ಯಾ ಗುಪ್ತಾ');
db.createCandidate(pos2.lastInsertRowid, 'Vikram Patel', 'Unity Alliance', 'flag', '', '', '', 'ವಿಕ್ರಮ್ ಪಟೇಲ್');
db.createCandidate(pos2.lastInsertRowid, 'Sneha Reddy', 'Student Front', 'flower', '', '', '', 'ಸ್ನೇಹಾ ರೆಡ್ಡಿ');

// Candidates for Secretary
db.createCandidate(pos3.lastInsertRowid, 'Rohit Kumar', 'Progressive Party', 'book', '', '', '', 'ರೋಹಿತ್ ಕುಮಾರ್');
db.createCandidate(pos3.lastInsertRowid, 'Meera Iyer', 'Unity Alliance', 'moon', '', '', '', 'ಮೀರಾ ಅಯ್ಯರ್');
db.createCandidate(pos3.lastInsertRowid, 'Amit Joshi', 'Independent', 'star', '', '', '', 'ಅಮಿತ್ ಜೋಷಿ');
db.createCandidate(pos3.lastInsertRowid, 'Pooja Deshmukh', 'Student Front', 'hand', '', '', '', 'ಪೂಜಾ ದೇಶ್ಮುಖ್');

// Candidates for Class Representative (max 2 votes)
db.createCandidate(pos4.lastInsertRowid, 'Tanmay Kulkarni', 'Progressive Party', 'circle', '', '', '', 'ತನ್ಮಯ್ ಕುಲಕರ್ಣಿ');
db.createCandidate(pos4.lastInsertRowid, 'Divya Mohan', 'Unity Alliance', 'square', '', '', '', 'ದಿವ್ಯಾ ಮೋಹನ್');
db.createCandidate(pos4.lastInsertRowid, 'Karan Thakur', 'Student Front', 'triangle', '', '', '', 'ಕರಣ್ ಠಾಕೂರ್');

// Booths
db.createBooth('SCHOOL', 'Main School Hall');
db.createBooth('SCIENC', 'Science Block');
db.createBooth('LIBRAR', 'Library');

// OTPs for testing
const otps = db.generateOTPs(e1.lastInsertRowid, 50);

console.log('Seed complete!');
console.log(' Election: Student Council Election 2025 (active)');
console.log(' Positions: 4 (President, VP, Secretary, CR)');
console.log(' Candidates: ' + (4 + 3 + 4 + 3 + 4) + ' (incl. 4 NOTA)');
console.log(' Booths: SCHOOL, SCIENC, LIBRAR');
console.log(' OTPs: 50 generated');
console.log('');
console.log('Access URLs:');
console.log('  Admin: http://localhost:3000/admin');
console.log('  Voter: http://localhost:3000/voter?booth=SCHOOL');
console.log('  Pro:   http://localhost:3000/pro?booth=SCHOOL');
