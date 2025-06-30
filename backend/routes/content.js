const router = require('express').Router();
const Groq = require('groq-sdk');
const Content = require('../models/Content');
const auth = require('../middleware/auth');

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Generate content
router.post('/generate', auth, async (req, res) => {
  try {
    const { prompt, type } = req.body;
    console.log('Received prompt:', prompt);
    
    // Call Groq
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful AI content creator. Create engaging and informative content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-8b-8192", // Fast and good quality
      max_tokens: 1000,
      temperature: 0.7
    });
    
    const generatedContent = completion.choices[0].message.content;
    
    // Save to database
    const content = new Content({
      userId: req.userId,
      type,
      prompt,
      content: generatedContent
    });
    
    await content.save();
    
    res.json({ content });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get user content
router.get('/my-content', auth, async (req, res) => {
  try {
    const content = await Content.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
