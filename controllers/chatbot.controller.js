const { axios, DEEPSEEK_API, API_KEY } = require('../config/deepseek');

exports.handleMessage = async (req, res) => {
  try {
    const response = await axios.post(
      DEEPSEEK_API,
      {
        messages: [
          {
            role: "system",
            content: "You're a helpful assistant for a learning platform. Focus on helping with fiches, flashcards, and study techniques."
          },
          {
            role: "user",
            content: req.body.message
          }
        ],
        model: "deepseek-chat", // Verify latest model name
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      reply: response.data.choices[0].message.content
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};