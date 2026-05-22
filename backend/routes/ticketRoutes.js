const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
} = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/create', protect, createTicket);
router.get('/', protect, getTickets);
router.get('/:id', protect, getTicketById);
router.put('/:id/update', protect, authorizeRoles('HR', 'Admin'), updateTicket);

module.exports = router;
