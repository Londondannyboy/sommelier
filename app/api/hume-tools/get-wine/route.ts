import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// Hume Tool: Get full wine details by ID or name
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { wine_id, wine_name } = body

    let wine

    if (wine_id) {
      const result = await sql`
        SELECT * FROM wines WHERE id = ${wine_id} AND is_active = true
      `
      wine = result[0]
    } else if (wine_name) {
      const result = await sql`
        SELECT * FROM wines
        WHERE LOWER(name) LIKE LOWER(${`%${wine_name}%`}) AND is_active = true
        LIMIT 1
      `
      wine = result[0]
    }

    if (!wine) {
      return NextResponse.json({
        success: false,
        message: 'Wine not found in our database'
      })
    }

    // Format comprehensive response for Hume
    const formattedWine = {
      id: wine.id,
      name: wine.name,
      winery: wine.winery,
      region: wine.region,
      country: wine.country,
      grape_variety: wine.grape_variety,
      vintage: wine.vintage,
      wine_type: wine.wine_type,
      style: wine.style,
      appellation: wine.appellation,
      classification: wine.classification,
      price_retail: wine.price_retail ? `£${wine.price_retail}` : null,
      price_trade: wine.price_trade ? `£${wine.price_trade}` : null,
      bottle_size: wine.bottle_size || '750ml',
      case_size: wine.case_size,
      tasting_notes: wine.tasting_notes,
      food_pairings: wine.food_pairings,
      alcohol_percentage: wine.alcohol_percentage ? `${wine.alcohol_percentage}%` : null,
      critic_scores: wine.critic_scores,
      drinking_window: wine.drinking_window,
      stock_quantity: wine.stock_quantity,
      image_url: wine.image_url,
    }

    return NextResponse.json({
      success: true,
      wine: formattedWine,
      message: `Found ${wine.name} in our database`
    })

  } catch (error) {
    console.error('[Hume Tool] get-wine error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get wine details' },
      { status: 500 }
    )
  }
}
