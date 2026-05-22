const Message = require('../models/Message');
const Ticket = require('../models/Ticket');
const Policy = require('../models/Policy');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// @desc    Ask AI a question utilizing RAG (Retrieval-Augmented Generation) on Company Policy
// @route   POST /api/chat/ask
// @access  Private
const askAI = async (req, res) => {
  const { query } = req.body;
  const userId = req.user._id;

  try {
    // 1. Save User Message
    await Message.create({
      userId,
      sender: 'User',
      content: query,
    });

    let aiResponseText = '';
    let confidenceIsLow = false;

    // 2. Retrieve Latest Company Policy as Context
    const latestPolicy = await Policy.findOne().sort({ createdAt: -1 });
    const policyContext = latestPolicy 
      ? latestPolicy.content 
      : "No company policy has been uploaded yet. Provide general professional HR advice, but warn the user that company specific policies are missing.";

    // 3. Call OpenAI using RAG prompt strategy
    const systemPrompt = `You are a helpful internal HR Assistant. 
    You must answer the employee's query strictly based on the following Company Policy extracted text.
    If the answer cannot be found in the policy, or if the question is complex (e.g. requires manual calculation, complaints, or sensitive human judgement), you MUST respond with EXACTLY and ONLY the word "CONFIDENCE_LOW". Do not include any other text if you use CONFIDENCE_LOW.
    
    --- COMPANY POLICY START ---
    ${policyContext}
    --- COMPANY POLICY END ---
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      temperature: 0.1 // Low temperature for factual RAG responses
    });

    aiResponseText = response.choices[0].message.content.trim();

    // 4. Evaluate AI Response for Fallback Ticket Generation
    let relatedTicket = null;
    let finalBotReply = aiResponseText;

    if (aiResponseText === 'CONFIDENCE_LOW' || aiResponseText.includes('CONFIDENCE_LOW')) {
      confidenceIsLow = true;
      finalBotReply = "I'm not completely certain about this according to the current policy text. To ensure you get the right answer, I've escalated this to the HR team via a priority support ticket!";

      // Automatically Create a Ticket
      const newTicket = new Ticket({
        title: `Auto-Generated: Employee Query needs Human Review`,
        description: `Employee asked: "${query}". \nThe AI Assistant yielded low confidence based on the current policy document.`,
        userId: userId,
        priority: 'High', // Elevated priority since AI failed
        status: 'Open'
      });
      
      relatedTicket = await newTicket.save();

      // Dispatch to HR realtime dashboard if configured
      if (global.io) {
         global.io.emit('newTicket', relatedTicket);
      }
    }

    // 5. Save AI Response in Chat History
    const aiMessage = await Message.create({
      userId,
      sender: 'AI',
      content: finalBotReply,
      isFallback: confidenceIsLow,
      relatedTicketId: relatedTicket ? relatedTicket._id : null
    });

    // 6. Return response
    res.status(200).json({
      chatResponse: aiMessage,
      ticketCreated: confidenceIsLow,
      ticketDetails: relatedTicket
    });

  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ message: 'Error communicating with AI engine', error: error.message });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.user._id }).sort('createdAt');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  askAI,
  getChatHistory
};
