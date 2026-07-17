const db = require('./db');
const path = require('path');
const Database = require('better-sqlite3');

const eid = db.createElection('Student Parliament Election 2026-27', 'Annual student council elections for the academic year 2026-27').lastInsertRowid;

function pos(title, desc, order) {
  return db.createPosition(eid, title, desc, order, 1).lastInsertRowid;
}
function cand(posId, name, cls, symbol, nameKn, serial) {
  db.createCandidate(posId, name, cls, symbol, '/uploads/photos/0.jpg', '/uploads/symbols/0.png', '', nameKn, serial);
}

const pCM = pos('Chief Minister', 'Head of the Student Council', 1);
cand(pCM, 'ANJINAMURTHY K', '9', 'star', 'ಅಂಜಿನಮೂರ್ತಿ ಕೆ', 1);
cand(pCM, 'RAMYA B L', '10', 'heart', 'ರಮ್ಯ ಬಿ ಎಲ್', 2);
cand(pCM, 'SANJU N T', '10', 'diamond', 'ಸಂಜು ಎನ್ ಟಿ', 3);
cand(pCM, 'JAGADEESH R S', '10', 'lion', 'ಜಗದೀಶ್ ಆರ್ ಎಸ್', 4);

const pSP = pos('Speaker', 'Council Speaker', 2);
cand(pSP, 'TEJULINGESH P B', '10', 'book', 'ತೇಜುಲಿಂಗೇಶ್ ಪಿ ಬಿ', 5);
cand(pSP, 'LIKHITHA S', '10', 'flower', 'ಲಿಖಿತ ಎಸ್', 6);

const pDM = pos('Discipline Minister', 'Discipline & Conduct', 3);
cand(pDM, 'NAYANA M', '9', 'flag', 'ನಯನ ಎಂ', 7);
cand(pDM, 'TARUN R', '10', 'sun', 'ತರುಣ್ ಆರ್', 8);
cand(pDM, 'BHARATH U', '8', 'moon', 'ಭರತ್ ಯು', 27);

const pEM = pos('Education Minister', 'Academic Affairs', 4);
cand(pEM, 'ARYA J K', '10', 'book', 'ಆರ್ಯ ಜೆ ಕೆ', 9);
cand(pEM, 'RASHMI G R', '10', 'circle', 'ರಶ್ಮಿ ಜಿ ಆರ್', 10);
cand(pEM, 'SHRAVANI C', '10', 'diamond', 'ಶ್ರಾವಣಿ ಸಿ', 11);
cand(pEM, 'PREETHI K', '9', 'star', 'ಪ್ರೀತಿ ಕೆ', 12);
cand(pEM, 'MANITHA T', '7', 'heart', 'ಮನಿತ ಟಿ', 13);

const pCUL = pos('Cultural Minister', 'Cultural Activities', 5);
cand(pCUL, 'HEMALATHA N C', '10', 'flower', 'ಹೇಮಲತಾ ಎನ್ ಸಿ', 14);
cand(pCUL, 'SUCHITRA B M', '10', 'moon', 'ಸುಚಿತ್ರ ಬಿ ಎಂ', 15);
cand(pCUL, 'REVATHI K', '8', 'sun', 'ರೇವತಿ ಕೆ', 16);

const pSM = pos('Sports Minister', 'Sports & Physical Education', 6);
cand(pSM, 'ADARSHA TYAGOR', '10', 'lion', 'ಆದರ್ಶ ಟ್ಯಾಗೋರ್', 17);
cand(pSM, 'SOUPARNI P', '10', 'star', 'ಸೌಪರ್ಣಿ ಪಿ', 18);
cand(pSM, 'PAVAN KUMAR E', '8', 'flag', 'ಪವನ್ ಕುಮಾರ್ ಈ', 19);
cand(pSM, 'HARSHA T', '7', 'triangle', 'ಹರ್ಷ ಟಿ', 20);

const pFH = pos('Food & Health Minister', 'Food & Health Affairs', 7);
cand(pFH, 'NAYANA B', '10', 'heart', 'ನಯನ ಬಿ', 21);
cand(pFH, 'BINDUSHREE C', '9', 'diamond', 'ಬಿಂದುಶ್ರೀ ಸಿ', 22);
cand(pFH, 'HITHAISHI K', '9', 'flower', 'ಹಿತೈಷಿ ಕೆ', 23);
cand(pFH, 'ANUSHA T', '9', 'star', 'ಅನುಷ ಟಿ', 24);
cand(pFH, 'MANASA V', '8', 'circle', 'ಮಾನಸ ವಿ', 25);
cand(pFH, 'NAGARAJ R', '8', 'hand', 'ನಾಗರಾಜ್ ಆರ್', 26);

const pCRA = pos('Craft Minister', 'Crafts & Vocational', 8);
cand(pCRA, 'INDRESH S', '8', 'tree', 'ಇಂದ್ರೇಶ್ ಎಸ್', 29);
cand(pCRA, 'NIKHIL R', '8', 'car', 'ನಿಖಿಲ್ ಆರ್', 30);
cand(pCRA, 'SHREEHARI P', '8', 'moon', 'ಶ್ರೀಹರಿ ಪಿ', 31);
cand(pCRA, 'AHWITH S WALIKAR', '7', 'star', 'ಅಶ್ವಿತ್ ಎಸ್ ವಾಲೀಕಾರ್', 32);
cand(pCRA, 'CHANDAN S P', '7', 'sun', 'ಚಂದನ್ ಎಸ್ ಪಿ', 33);

const pWW = pos('Women Welfare Minister', 'Women Welfare', 9);
cand(pWW, 'INCHARA T', '10', 'flower', 'ಇಂಚರ ಟಿ', 34);
cand(pWW, 'LIKHITHA A', '10', 'heart', 'ಲಿಖಿತ ಎ', 35);
cand(pWW, 'INCHARA S S', '9', 'diamond', 'ಇಂಚರ ಎಸ್ ಎಸ್', 36);

const pHG = pos('Head Girl - Girls Hostel', 'Girls Hostel Representative', 10);
cand(pHG, 'GAGANA H', '10', 'star', 'ಗಗನ ಹೆಚ್', 37);
cand(pHG, 'AMRUTHA', '9', 'moon', 'ಅಮೃತ', 38);
cand(pHG, 'TULASI M', '9', 'flower', 'ತುಳಸಿ ಎಂ', 39);

const pTM = pos('Tourism Minister', 'Tourism & Cultural Heritage', 11);
cand(pTM, 'DHARANESH K V', '9', 'lion', 'ಧರಣೇಶ್ ಕೆ ವಿ', 40);
cand(pTM, 'CHANDU H R', '9', 'sun', 'ಚಂದು ಹೆಚ್ ಆರ್', 41);
cand(pTM, 'GOWTHAMI B', '9', 'hand', 'ಗೌತಮಿ ಬಿ', 42);

const pCH = pos('Cleaning & Hygiene Minister', 'Cleanliness & Hygiene', 12);
cand(pCH, 'SINDHU P', '10', 'diamond', 'ಸಿಂಧು ಪಿ', 44);
cand(pCH, 'BHUVANASHREE N', '9', 'star', 'ಭುವನಶ್ರೀ ಎನ್', 45);
cand(pCH, 'KISHAN KUMAR G', '7', 'circle', 'ಕಿಶನ್ ಕುಮಾರ್ ಜಿ', 46);
cand(pCH, 'NIKETHAN N', '7', 'heart', 'ನಿಕೇತನ್ ಎನ್', 47);

db.createBooth('SCHOOL', 'Main School Hall');
db.createBooth('SCIENC', 'Science Block');
db.createBooth('LIBRAR', 'Library');

db.generateOTPs(eid, 100);

const totalCands = 44;
console.log('Seed (real) complete!');
console.log(' Election: Student Council Election 2025 (active)');
console.log(' Positions: 12');
console.log(' Candidates: ' + (totalCands + 12) + ' (incl. 12 NOTA)');
console.log(' Booths: SCHOOL, SCIENC, LIBRAR');
console.log(' OTPs: 100 generated');
