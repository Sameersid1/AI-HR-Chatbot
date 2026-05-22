const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/users', protect, authorizeRoles('Admin'), getUsers);
router.put('/users/:id/role', protect, authorizeRoles('Admin'), updateUserRole);

module.exports = router;
