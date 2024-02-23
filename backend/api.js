const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai');
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({ project: 'neon-deployment-414620', location: 'us-central1' });
const model = 'gemini-1.0-pro-001';

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generation_config: {
    "max_output_tokens": 2048,
    "temperature": 0.9,
    "top_p": 1
  },
  safety_settings: [
    {
      "category": "HARM_CATEGORY_HATE_SPEECH",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_HARASSMENT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    }
  ],
});

// Define an Express route handler
app.get('/generate-content', async (req, res) => {
  try {
    const requestPayload = {
      contents: [{ role: 'user', parts: [] }],
    };

    const streamingResp = await generativeModel.generateContentStream(requestPayload);
    let generatedContent = '';

    for await (const item of streamingResp.stream) {
      generatedContent += 'stream chunk: ' + JSON.stringify(item);
    }

    generatedContent += 'aggregated response: ' + JSON.stringify(await streamingResp.response);
    
    // Send the generated content as response
    res.send(generatedContent);
  } catch (error) {
    // Handle errors
    console.error('Error generating content:', error);
    res.status(500).send('Error generating content');
  }
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
