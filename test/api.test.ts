import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMocks } from 'node-mocks-http'
import mixColorsHandler from '../pages/api/mixColorsChat'
import getPaintColorHexHandler from '../pages/api/getPaintColorHex'

// Mock OpenAI
vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{
              message: {
                content: JSON.stringify({
                  "#2e3533": {
                    "Titanium White": 2,
                    "Ivory Black": 1,
                    "Burnt Sienna": 1
                  },
                  "#d1bda0": {
                    "Titanium White": 3,
                    "Yellow Ochre": 1
                  },
                  "#9a8c69": {
                    "Yellow Ochre": 2,
                    "Burnt Sienna": 1,
                    "Ivory Black": 1
                  }
                })
              }
            }]
          })
        }
      }
    }))
  }
})

describe('/api/mixColorsChat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return color mixing data with valid input', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        paintColors: 'Titanium White\nYellow Ochre\nBurnt Sienna\nIvory Black',
        hexValues: ['#2e3533', '#d1bda0', '#9a8c69']
      }
    })

    await mixColorsHandler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    
    // Check structure
    expect(data).toHaveProperty('#2e3533')
    expect(data).toHaveProperty('#d1bda0')
    expect(data).toHaveProperty('#9a8c69')
    
    // Check that values are numbers
    expect(typeof data['#2e3533']['Titanium White']).toBe('number')
    expect(data['#2e3533']['Titanium White']).toBeGreaterThanOrEqual(1)
    expect(data['#2e3533']['Titanium White']).toBeLessThanOrEqual(4)
  })

  it('should return 400 for missing paint colors', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        paintColors: '',
        hexValues: ['#2e3533']
      }
    })

    await mixColorsHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
    const data = JSON.parse(res._getData())
    expect(data.error.message).toContain('Please provide valid paint colors')
  })

  it('should return 400 for missing hex values', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        paintColors: 'Titanium White',
        hexValues: []
      }
    })

    await mixColorsHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
    const data = JSON.parse(res._getData())
    expect(data.error.message).toContain('Please provide valid paint colors')
  })

  it('should return 500 for missing API key', async () => {
    // Temporarily remove API key
    const originalKey = process.env.OPENAI_API_KEY
    delete process.env.OPENAI_API_KEY

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        paintColors: 'Titanium White',
        hexValues: ['#2e3533']
      }
    })

    await mixColorsHandler(req, res)

    expect(res._getStatusCode()).toBe(500)
    const data = JSON.parse(res._getData())
    expect(data.error.message).toContain('OpenAI API key not configured')

    // Restore API key
    process.env.OPENAI_API_KEY = originalKey
  })
})

describe('/api/getPaintColorHex', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return hex values for paint colors', async () => {
    // Override the mock for this specific test
    const { default: OpenAI } = await import('openai')
    const mockCreate = vi.fn().mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            "Titanium White": "#ffffff",
            "Burnt Sienna": "#8a3324",
            "Ivory Black": "#000000"
          })
        }
      }]
    })
    
    vi.mocked(OpenAI).mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate
        }
      }
    } as any))

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        paintColors: 'Titanium White\nBurnt Sienna\nIvory Black'
      }
    })

    await getPaintColorHexHandler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    
    console.log('Actual getPaintColorHex response:', JSON.stringify(data, null, 2))
    
    expect(data).toHaveProperty('Titanium White')
    expect(data).toHaveProperty('Burnt Sienna')
    expect(data).toHaveProperty('Ivory Black')
    
    // Check hex format
    expect(data['Titanium White']).toMatch(/^#[0-9a-fA-F]{6}$/)
    expect(data['Burnt Sienna']).toMatch(/^#[0-9a-fA-F]{6}$/)
    expect(data['Ivory Black']).toMatch(/^#[0-9a-fA-F]{6}$/)
  })

  it('should return 400 for empty paint colors', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        paintColors: ''
      }
    })

    await getPaintColorHexHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
    const data = JSON.parse(res._getData())
    expect(data.error.message).toContain('Please provide valid paint colors')
  })
})