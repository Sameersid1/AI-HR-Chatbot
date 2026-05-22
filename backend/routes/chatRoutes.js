const express = require('express');
const router = express.Router();
const { askAI, getChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/ask', protect, askAI);
router.get('/history', protect, getChatHistory);

module.exports = router;
