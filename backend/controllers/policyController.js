const Policy = require('../models/Policy');
const pdfParse = require('pdf-parse');

// @desc    Upload Company Policy Document (TXT or PDF)
// @route   POST /api/policy/upload
// @access  Private (HR/Admin)
const uploadPolicy = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    let extractedText = '';

    if (req.file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(req.file.buffer);
      extractedText = pdfData.text;
    } else if (req.file.mimetype === 'text/plain') {
      extractedText = req.file.buffer.toString('utf-8');
    } else {
      return res.status(400).json({ message: 'Only PDF or TXT files are supported' });
    }

    // For simplicity, we keep updating/creating a single main policy or keeping the latest.
    // Let's create a new policy record. Over time we could mark them active/inactive.
    const newPolicy = await Policy.create({
      title: req.file.originalname,
      content: extractedText,
      uploadedBy: req.user._id
    });

    res.status(201).json({
      message: 'Policy uploaded accurately.',
      policy: newPolicy
    });

  } catch (error) {
    console.error('Upload Policy Error:', error);
    res.status(500).json({ message: 'Failed to process document', error: error.message });
  }
};

// @desc    Get the latest policy
// @route   GET /api/policy/latest
// @access  Private
const getLatestPolicy = async (req, res) => {
  try {
    const policy = await Policy.findOne().sort({ createdAt: -1 });
    res.json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadPolicy,
  getLatestPolicy
};
