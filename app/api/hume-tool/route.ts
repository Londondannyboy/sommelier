import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

/**
 * Hume EVI Tool Endpoint for Sommelier AI
 *
 * This endpoint handles tool calls from Hume for:
 * - Searching wines
 * - Getting wine details
 * - Food pairing suggestions
 * - User preferences
 */

interface HumeToolRequest {
  type: string
  tool_call_id: string
  name: string
  parameters: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[Hume Tool] Received:', body.name)

    if (body.type === 'tool_call' || body.name) {
      const toolName = body.name || body.tool_name
      const params = typeof body.parameters === 'string'
        ? JSON.parse(body.parameters)
        : body.parameters || {}

      let result: string

      switch (toolName) {
        case 'search_wines':
          result = await searchWines(params)
          break

        case 'get_wine_details':
          result = await getWineDetails(params.wine_id)
          break

        case 'get_food_pairing':
          result = await getFoodPairing(params.food)
          break

        case 'get_user_preferences':
          result = await getUserPreferences(params.user_id)
          break

        case 'save_user_preference':
          result = await saveUserPreference(params)
          break

        default:
          result = `Unknown tool: ${toolName}`
      }

      return NextResponse.json({
        type: 'tool_response',
        tool_call_id: body.tool_call_id || 'unknown',
        content: result
      })
    }

    return NextResponse.json(
      { error: 'Invalid request - expected tool_call' },
      { status: 400 }
    )
  } catch (error) {
    console.error('[Hume Tool] Error:', error)
    return NextResponse.json(
      {
        type: 'tool_response',
        tool_call_id: 'error',
        content: `Error processing request: ${error}`
      },
      { status: 500 }
    )
  }
}

// ============ Tool Implementations ============

async function searchWines(params: {
  wine_type?: string
  region?: string
  price_range?: string
  style?: string
  limit?: number
}): Promise<string> {
  try {
    const typePattern = params.wine_type ? `%${params.wine_type}%` : '%'
    const regionPattern = params.region ? `%${params.region}%` : '%'
    const limit = params.limit || 5

    const wines = await sql`
      SELECT id, name, winery, region, country, grape_variety,
             wine_type, style, price_range, tasting_notes
      FROM wines
      WHERE is_active = true
        AND LOWER(COALESCE(wine_type, '')) LIKE LOWER(${typePattern})
        AND LOWER(COALESCE(region, '')) LIKE LOWER(${regionPattern})
      ORDER BY name
      LIMIT ${limit}
    `

    if (wines.length === 0) {
      return `No wines found matching your criteria. Try a broader search.`
    }

    const wineDescriptions = wines.map(w => {
      let desc = `${w.name}`
      if (w.winery) desc += ` by ${w.winery}`
      if (w.region) desc += ` from ${w.region}`
      if (w.wine_type) desc += ` (${w.wine_type})`
      if (w.price_range) desc += ` - ${w.price_range}`
      return desc
    }).join('. ')

    return `Found ${wines.length} wines: ${wineDescriptions}`
  } catch (error) {
    console.error('[searchWines] Error:', error)
    return "Unable to search wines at this time."
  }
}

async function getWineDetails(wineId: string): Promise<string> {
  if (!wineId) {
    return "No wine ID provided."
  }

  try {
    const results = await sql`
      SELECT name, winery, region, country, grape_variety,
             vintage, wine_type, style, price_range,
             tasting_notes, food_pairings, alcohol_percentage
      FROM wines
      WHERE id = ${wineId}
      LIMIT 1
    `

    if (results.length === 0) {
      return "Wine not found."
    }

    const w = results[0]
    let desc = `${w.name}`
    if (w.winery) desc += ` by ${w.winery}`
    if (w.vintage) desc += ` (${w.vintage})`
    desc += `. `
    if (w.region && w.country) desc += `From ${w.region}, ${w.country}. `
    if (w.grape_variety) desc += `Made from ${w.grape_variety}. `
    if (w.tasting_notes) desc += `Tasting notes: ${w.tasting_notes}. `
    if (w.food_pairings) desc += `Pairs well with: ${w.food_pairings.join(', ')}. `
    if (w.price_range) desc += `Price range: ${w.price_range}.`

    return desc
  } catch (error) {
    console.error('[getWineDetails] Error:', error)
    return "Unable to fetch wine details at this time."
  }
}

async function getFoodPairing(food: string): Promise<string> {
  if (!food) {
    return "Please tell me what food you're looking to pair."
  }

  try {
    const foodPattern = `%${food}%`

    const pairings = await sql`
      SELECT food_item, recommended_wine_types, recommended_styles, notes
      FROM food_pairings
      WHERE LOWER(food_item) LIKE LOWER(${foodPattern})
         OR LOWER(food_category) LIKE LOWER(${foodPattern})
      LIMIT 3
    `

    if (pairings.length === 0) {
      // Provide general guidance based on common pairings
      return `I don't have a specific pairing for ${food} in my database, but I can suggest:
        - Red meats: Full-bodied reds like Cabernet Sauvignon or Malbec
        - Poultry: Medium-bodied whites or light reds like Pinot Noir
        - Seafood: Crisp whites like Sauvignon Blanc or Chardonnay
        - Vegetarian: Versatile wines like Pinot Grigio or Grenache`
    }

    const pairingDescriptions = pairings.map(p => {
      let desc = `${p.food_item}: ${p.recommended_wine_types.join(', ')}`
      if (p.notes) desc += ` (${p.notes})`
      return desc
    }).join('. ')

    return pairingDescriptions
  } catch (error) {
    console.error('[getFoodPairing] Error:', error)
    return "Unable to fetch pairing suggestions at this time."
  }
}

async function getUserPreferences(userId: string): Promise<string> {
  if (!userId) {
    return "No user ID provided. The user may not be logged in."
  }

  try {
    const results = await sql`
      SELECT wine_experience_level, preferred_wine_types, price_preference
      FROM users
      WHERE neon_auth_id = ${userId}
      LIMIT 1
    `

    if (results.length === 0) {
      return "No preferences found for this user yet. Ask them about their wine preferences."
    }

    const p = results[0]
    const parts = []
    if (p.wine_experience_level) parts.push(`Experience: ${p.wine_experience_level}`)
    if (p.preferred_wine_types) parts.push(`Prefers: ${p.preferred_wine_types.join(', ')}`)
    if (p.price_preference) parts.push(`Budget: ${p.price_preference}`)

    return parts.length > 0 ? parts.join('. ') : "Profile exists but no preferences set yet."
  } catch (error) {
    console.error('[getUserPreferences] Error:', error)
    return "Unable to fetch preferences at this time."
  }
}

async function saveUserPreference(params: {
  user_id: string
  field: string
  value: string
}): Promise<string> {
  if (!params.user_id) {
    return "Cannot save - no user ID provided."
  }

  const allowedFields = ['wine_experience_level', 'price_preference']

  if (!allowedFields.includes(params.field)) {
    return `Cannot update ${params.field}. Allowed fields: ${allowedFields.join(', ')}`
  }

  try {
    switch (params.field) {
      case 'wine_experience_level':
        await sql`UPDATE users SET wine_experience_level = ${params.value} WHERE neon_auth_id = ${params.user_id}`
        break
      case 'price_preference':
        await sql`UPDATE users SET price_preference = ${params.value} WHERE neon_auth_id = ${params.user_id}`
        break
    }

    return `Saved ${params.field}: ${params.value}`
  } catch (error) {
    console.error('[saveUserPreference] Error:', error)
    return "Unable to save preference at this time."
  }
}

// GET for testing
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    tools: [
      'search_wines',
      'get_wine_details',
      'get_food_pairing',
      'get_user_preferences',
      'save_user_preference'
    ],
    usage: 'POST tool calls from Hume EVI'
  })
}
