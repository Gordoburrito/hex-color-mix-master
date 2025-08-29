import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Test the color mixing API with sample data
    const testPaintColors = `Titanium White
Hansa Yellow Pale
Yellow Ochre
Cadmium Red Hue
Alizarin Crimson Hue
Phthalo Blue (Green Shade)
Phthalo Green (Blue Shade)
Burnt Sienna
Ivory Black`;

    const testHexValues = ["#2e3533", "#d1bda0", "#9a8c69"];

    console.log('Testing API with:', {
      paintColors: testPaintColors,
      hexValues: testHexValues
    });

    // Call our own API
    const response = await fetch(`${req.headers.origin || 'http://localhost:3000'}/api/mixColorsChat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paintColors: testPaintColors,
        hexValues: testHexValues,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`API call failed: ${JSON.stringify(data)}`);
    }

    console.log('API response:', data);

    // Validate the response structure
    const validation = validateResponse(data, testHexValues);
    
    res.status(200).json({
      success: true,
      data: data,
      validation: validation,
      message: 'Test completed successfully'
    });

  } catch (error: any) {
    console.error('Test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Test failed'
    });
  }
}

function validateResponse(data: any, expectedHexValues: string[]) {
  const results = {
    isObject: typeof data === 'object' && data !== null,
    hasAllHexKeys: true,
    validStructure: true,
    issues: [] as string[]
  };

  if (!results.isObject) {
    results.issues.push('Response is not an object');
    return results;
  }

  // Check if all expected hex values are present
  for (const hex of expectedHexValues) {
    if (!(hex in data)) {
      results.hasAllHexKeys = false;
      results.issues.push(`Missing hex key: ${hex}`);
    }
  }

  // Check structure of each hex value
  for (const [hex, paintColors] of Object.entries(data)) {
    if (typeof paintColors !== 'object' || paintColors === null) {
      results.validStructure = false;
      results.issues.push(`Invalid structure for ${hex}: not an object`);
      continue;
    }

    // Check that all values are numbers between 1-4
    for (const [paintColor, quantity] of Object.entries(paintColors as Record<string, any>)) {
      if (typeof quantity !== 'number') {
        results.validStructure = false;
        results.issues.push(`Invalid quantity for ${hex}.${paintColor}: not a number`);
      } else if (quantity < 1 || quantity > 4) {
        results.validStructure = false;
        results.issues.push(`Invalid quantity for ${hex}.${paintColor}: ${quantity} (should be 1-4)`);
      }
    }
  }

  return results;
}