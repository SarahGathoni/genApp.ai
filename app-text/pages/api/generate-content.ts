import { NextApiRequest, NextApiResponse } from 'next';
import { VertexAI } from '@google-cloud/vertexai';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
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
      /*safety_settings: [
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
      ],*/
    });

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
    res.status(200).json({ generatedContent });
  } catch (error) {
    // Handle errors
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Error generating content' });
  }
};

export default handler;
