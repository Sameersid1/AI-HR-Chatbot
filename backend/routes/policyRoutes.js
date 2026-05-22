const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadPolicy, getLatestPolicy } = require('../controllers/policyController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Storage config for Multer - using memory storage so we can parse directly
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/upload', protect, authorizeRoles('HR', 'Admin'), upload.single('document'), uploadPolicy);
router.get('/latest', protect, getLatestPolicy);

module.exports = router;
