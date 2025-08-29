/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (!process.env.OPENAI_API_KEY) {
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      temperature: 0,
      max_tokens: 1024,
      messages: [{role: "user", content: prompt}],
      response_format: { type: "json_object" }
    });

    const jsonResponse = JSON.parse(response.choices[0].message.content);
    res.status(200).json(jsonResponse);
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    console.error('Full error details:', error);
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: `An error occurred during your request: ${error.message}`,
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

  I would like to mix these paint colors to create the following hexadecimal colors (any number of colors can be provided):

  ${hexValuesList}

  You will need to specify the paint colors and their respective quantities needed to create each color. The quantity should be a number on a scale of 1 - 4 representing the proportion of each color needed to create the final color.
  
  For each hex color provided, analyze and provide the paint colors and their quantities needed to mix that color. Handle any number of colors from 1 to many.

  Please respond with valid JSON only. The format should be:
  {
    "#hexcolor1": {
      "Paint Color Name": quantity,
      "Another Paint Color": quantity
    },
    "#hexcolor2": {
      "Paint Color Name": quantity
    }
  }
  `;
}
