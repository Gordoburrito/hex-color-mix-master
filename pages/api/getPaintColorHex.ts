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

  if (paintColors.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please provide valid paint colors.',
      },
    });
    return;
  }

  try {
    const prompt = generatePaintColorHexPrompt(paintColors);
    
    // Simplified schema for paint color hex values
    const schema = {
      type: "object",
      additionalProperties: {
        type: "string",
        pattern: "^#[0-9a-fA-F]{6}$"
      }
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06", // Use a model that supports structured outputs
      temperature: 0,
      max_tokens: 1024,
      messages: [{role: "user", content: prompt}],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "paint_color_hex",
          strict: true,
          schema: schema
        }
      }
    });
    
    const jsonResponse = JSON.parse(response.choices[0].message.content);

    res.status(200).json(jsonResponse);
  } catch (error: any) {
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

function generatePaintColorHexPrompt(paintColors: string): string {
  const paintColorsList = paintColors
    .split('\n')
    .map((color) => `- ${color}`)
    .join('\n');

  return `
  I have the following paint colors: 
  ${paintColorsList}

  Please provide the closest hex color code for each paint color.
  `;
}