const multer = require('multer');
const storage = multer.memoryStorage(); // Store image in memory
const upload = multer({ storage: storage });

module.exports = upload;