const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    type: String,
    enum: ['User', 'AI', 'HR'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isFallback: {
    type: Boolean,
    default: false,
  },
  relatedTicketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
