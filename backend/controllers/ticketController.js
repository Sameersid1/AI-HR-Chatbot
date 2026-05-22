const Ticket = require('../models/Ticket');

// @desc    Create new ticket
// @route   POST /api/tickets/create
// @access  Private
const createTicket = async (req, res) => {
  const { title, description, priority } = req.body;

  try {
    const ticket = new Ticket({
      title,
      description,
      priority: priority || 'Medium',
      userId: req.user._id,
    });

    const createdTicket = await ticket.save();

    // In a real app, emit a socket event here to notify HR
    if (global.io) {
      global.io.emit('newTicket', createdTicket);
    }

    res.status(201).json(createdTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tickets (HR/Admin) or User's tickets (Employee)
// @route   GET /api/tickets
// @access  Private
const getTickets = async (req, res) => {
  try {
    let tickets;
    if (req.user.role === 'HR' || req.user.role === 'Admin') {
      tickets = await Ticket.find({}).populate('userId', 'name email department');
    } else {
      tickets = await Ticket.find({ userId: req.user._id });
    }
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ticket by ID
// @route   GET /api/tickets/:id
// @access  Private
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('userId', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Checking if employee is trying to access someone else's ticket
    if (req.user.role === 'Employee' && ticket.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update ticket status
// @route   PUT /api/tickets/:id/update
// @access  Private (HR/Admin)
const updateTicket = async (req, res) => {
  const { status, assignedTo } = req.body;

  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (status) ticket.status = status;
    if (assignedTo) ticket.assignedTo = assignedTo;

    const updatedTicket = await ticket.save();

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
};
