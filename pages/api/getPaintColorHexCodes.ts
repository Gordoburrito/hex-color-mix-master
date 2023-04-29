/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  const paintColorsList = req.body.paintColorsList || '';

  if (paintColorsList.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please provide a valid list of paint colors.',
      },
    });
    return;
  }

  try {
    const prompt = generatePrompt(paintColorsList);
    const response = await openai.createCompletion({
      model: 'gpt-3.5-turbo',
      prompt: prompt,
      max_tokens: 200,
      n: 1,
      stop: null,
      temperature: 0.5,
    });

    const outputData = JSON.parse(response.data.choices[0].text.trim());
    res.status(200).json(outputData);
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
}

function generatePrompt(paintColorsList: string): string {
  const paintColors = paintColorsList
    .split('\n')
    .map((color) => `- ${color}`)
    .join('\n');

  return `
  Provide me with the closest hex codes for these paint colors:

  ${paintColors}

  In the format below:

  "output_data": {
        "colors": [
            {"name": "{color_name_1}", "hex": "{closest_hex_1}"},
            {"name": "{color_name_2}", "hex": "{closest_hex_2}"},
            {"name": "{color_name_3}", "hex": "{closest_hex_3}"},
            ...
        ]
    }`;
}
