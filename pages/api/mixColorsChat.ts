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

  const paintColors = req.body.paintColors || '';
  const hexValues = req.body.hexValues || [];

  if (paintColors.trim().length === 0 || hexValues.length === 0) {
    res.status(400).json({
      error: {
        message: 'Please provide valid paint colors and hexadecimal values.',
      },
    });
    return;
  }

  try {
    const prompt = generatePrompt(paintColors, hexValues);
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      temperature: 0,
      max_tokens: 2048,
      frequency_penalty: 0,
      presence_penalty: 0,
      top_p: 1,
      messages: [{role: "assistant", content: prompt}]
    });
    const jsonResponse = response && response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message ? JSON.parse(response.data.choices[0].message.content.trim()) : null;

    res.status(200).json(jsonResponse);
  } catch (error: any) {
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

// TODO: add a ui for paintcolors, adding them more easily.
function generatePrompt(paintColors: string, hexValues: string[]): string {
  const paintColorsList = paintColors
    .split('\n')
    .map((color) => `- ${color}`)
    .join('\n');
  const hexValuesList = hexValues.map((hex) => `- ${hex}`).join('\n');

  return `
  I have the following paint colors: 
  ${paintColorsList}

  I would like to mix these paint colors to create the following hexadecimal colors:

  ${hexValuesList}

  You will need to specify the paint colors and their respective quantities needed to create the color. The quantity should be a number on a scale of 1 - 4 representing the proportion of each color needed to create the final color. Be sure to include the closest hex value for each paint color.
  Please provide a JSON structure with the hexadecimal color codes as keys and the paint colors with their respective quantities as values. The JSON should be tidy and easy to understand. Use the following example format for your response:

  {
    "HEX_CODE": {
      "Paint Color 1": {
        'hex': 'closest hex value',
        'Quantity' : quantity,
      },
      "Paint Color 2": {
        'hex': 'closest hex value',
        'Quantity' : quantity,
      },
      ...
    },
    ...
  }
  
  `;
}
