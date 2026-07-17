const db = require('./db');
const path = require('path');
const Database = require('better-sqlite3');

const d = new Database(path.join(__dirname, 'data', 'evote.db'));
d.exec('DELETE FROM votes');
d.exec('DELETE FROM voters');
d.exec('DELETE FROM otps');
d.exec('DELETE FROM candidates');
d.exec('DELETE FROM positions');
d.exec('DELETE FROM booths');
d.exec('DELETE FROM elections');
d.close();

const e1 = db.createElection('Mock Poll 2025', 'Demo mock election for testing');
db.setElectionStatus(e1.lastInsertRowid, 'active');
const eid = e1.lastInsertRowid;

function pos(title, desc, order) {
  return db.createPosition(eid, title, desc, order, 1).lastInsertRowid;
}
function cand(posId, name, cls, symbol, nameKn, serial) {
  db.createCandidate(posId, name, cls, symbol, '/uploads/photos/0.jpg', '/uploads/symbols/0.png', '', nameKn, serial);
}

const pCM = pos('Chief Minister', 'Head of the Student Council', 1);
cand(pCM, 'Arjun Mehta', '9', 'star', 'ಅರ್ಜುನ್ ಮೆಹ್ತಾ', 1);
cand(pCM, 'Priya Sharma', '10', 'heart', 'ಪ್ರಿಯಾ ಶರ್ಮಾ', 2);
cand(pCM, 'Rahul Verma', '10', 'diamond', 'ರಾಹುಲ್ ವರ್ಮಾ', 3);
cand(pCM, 'Sneha Reddy', '10', 'lion', 'ಸ್ನೇಹಾ ರೆಡ್ಡಿ', 4);

const pSP = pos('Speaker', 'Council Speaker', 2);
cand(pSP, 'Vikram Patel', '10', 'book', 'ವಿಕ್ರಮ್ ಪಟೇಲ್', 5);
cand(pSP, 'Ananya Gupta', '10', 'flower', 'ಅನನ್ಯಾ ಗುಪ್ತಾ', 6);

const pDM = pos('Discipline Minister', 'Discipline & Conduct', 3);
cand(pDM, 'Karan Singh', '9', 'flag', 'ಕರಣ್ ಸಿಂಗ್', 7);
cand(pDM, 'Divya Nair', '10', 'sun', 'ದಿವ್ಯಾ ನಾಯರ್', 8);
cand(pDM, 'Rohit Joshi', '8', 'moon', 'ರೋಹಿತ್ ಜೋಷಿ', 27);

const pEM = pos('Education Minister', 'Academic Affairs', 4);
cand(pEM, 'Meera Iyer', '10', 'book', 'ಮೀರಾ ಅಯ್ಯರ್', 9);
cand(pEM, 'Amit Kumar', '10', 'circle', 'ಅಮಿತ್ ಕುಮಾರ್', 10);
cand(pEM, 'Pooja Deshmukh', '10', 'diamond', 'ಪೂಜಾ ದೇಶ್ಮುಖ್', 11);
cand(pEM, 'Tanmay Kulkarni', '9', 'star', 'ತನ್ಮಯ್ ಕುಲಕರ್ಣಿ', 12);
cand(pEM, 'Kavya Mohan', '7', 'heart', 'ಕಾವ್ಯಾ ಮೋಹನ್', 13);

const pCUL = pos('Cultural Minister', 'Cultural Activities', 5);
cand(pCUL, 'Riya Sen', '10', 'flower', 'ರಿಯಾ ಸೇನ್', 14);
cand(pCUL, 'Aditya Kapoor', '10', 'moon', 'ಆದಿತ್ಯ ಕಪೂರ್', 15);
cand(pCUL, 'Neha Gupta', '8', 'sun', 'ನೇಹಾ ಗುಪ್ತಾ', 16);

const pSM = pos('Sports Minister', 'Sports & Physical Education', 6);
cand(pSM, 'Aarav Khanna', '10', 'lion', 'ಆರವ್ ಖನ್ನಾ', 17);
cand(pSM, 'Isha Patel', '10', 'star', 'ಈಶಾ ಪಟೇಲ್', 18);
cand(pSM, 'Sahil Thakur', '8', 'flag', 'ಸಾಹಿಲ್ ಠಾಕೂರ್', 19);
cand(pSM, 'Naina Rao', '7', 'triangle', 'ನೈನಾ ರಾವ್', 20);

const pFH = pos('Food & Health Minister', 'Food & Health Affairs', 7);
cand(pFH, 'Rohan Das', '10', 'heart', 'ರೋಹನ್ ದಾಸ್', 21);
cand(pFH, 'Simran Kaur', '9', 'diamond', 'ಸಿಮ್ರನ್ ಕೌರ್', 22);
cand(pFH, 'Akash Yadav', '9', 'flower', 'ಆಕಾಶ್ ಯಾದವ್', 23);
cand(pFH, 'Pallavi Joshi', '9', 'star', 'ಪಲ್ಲವಿ ಜೋಷಿ', 24);
cand(pFH, 'Manav Singh', '8', 'circle', 'ಮಾನವ್ ಸಿಂಗ್', 25);
cand(pFH, 'Deepa Menon', '8', 'hand', 'ದೀಪಾ ಮೆನನ್', 26);

const pCRA = pos('Craft Minister', 'Crafts & Vocational', 8);
cand(pCRA, 'Siddharth Gowda', '8', 'tree', 'ಸಿದ್ಧಾರ್ಥ್ ಗೌಡ', 29);
cand(pCRA, 'Ankita Shetty', '8', 'car', 'ಅಂಕಿತಾ ಶೆಟ್ಟಿ', 30);
cand(pCRA, 'Pranav Hegde', '8', 'moon', 'ಪ್ರಣವ್ ಹೆಗ್ಡೆ', 31);
cand(pCRA, 'Lavanya K', '7', 'star', 'ಲಾವಣ್ಯ ಕೆ', 32);
cand(pCRA, 'Vishal P', '7', 'sun', 'ವಿಶಾಲ್ ಪಿ', 33);

const pWW = pos('Women Welfare Minister', 'Women Welfare', 9);
cand(pWW, 'Shweta Rao', '10', 'flower', 'ಶ್ವೇತಾ ರಾವ್', 34);
cand(pWW, 'Manoj Kumar', '10', 'heart', 'ಮನೋಜ್ ಕುಮಾರ್', 35);
cand(pWW, 'Bhavya S', '9', 'diamond', 'ಭಾವ್ಯ ಎಸ್', 36);

const pHG = pos('Head Girl - Girls Hostel', 'Girls Hostel Representative', 10);
cand(pHG, 'Sanjana Prakash', '10', 'star', 'ಸಂಜನಾ ಪ್ರಕಾಶ್', 37);
cand(pHG, 'Arpita B', '9', 'moon', 'ಅರ್ಪಿತ ಬಿ', 38);
cand(pHG, 'Keerthi N', '9', 'flower', 'ಕೀರ್ತಿ ಎನ್', 39);

const pTM = pos('Tourism Minister', 'Tourism & Cultural Heritage', 11);
cand(pTM, 'Rajeshwari H', '9', 'lion', 'ರಾಜೇಶ್ವರಿ ಹೆಚ್', 40);
cand(pTM, 'Ganesh M', '9', 'sun', 'ಗಣೇಶ್ ಎಂ', 41);
cand(pTM, 'Latha S', '9', 'hand', 'ಲತಾ ಎಸ್', 42);

const pCH = pos('Cleaning & Hygiene Minister', 'Cleanliness & Hygiene', 12);
cand(pCH, 'Harish K', '10', 'diamond', 'ಹರೀಶ್ ಕೆ', 44);
cand(pCH, 'Shruthi N', '9', 'star', 'ಶೃತಿ ಎನ್', 45);
cand(pCH, 'Karthik G', '7', 'circle', 'ಕಾರ್ತಿಕ್ ಜಿ', 46);
cand(pCH, 'Yashaswini M', '7', 'heart', 'ಯಶಸ್ವಿನಿ ಎಂ', 47);

db.createBooth('SCHOOL', 'Main School Hall');
db.createBooth('SCIENC', 'Science Block');
db.createBooth('LIBRAR', 'Library');

db.generateOTPs(eid, 100);

const totalCands = 44;
console.log('Seed (mock) complete!');
console.log(' Election: Mock Poll 2025 (active)');
console.log(' Positions: 12');
console.log(' Candidates: ' + (totalCands + 12) + ' (incl. 12 NOTA)');
console.log(' Booths: SCHOOL, SCIENC, LIBRAR');
console.log(' OTPs: 100 generated');
