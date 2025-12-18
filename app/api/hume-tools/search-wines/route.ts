import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// Hume Tool: Search wines in database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { country, region, wine_type, max_price, min_price, style, grape_variety } = body

    // Fetch all active wines and filter in application
    // This is simpler and works well for small wine databases (~20-100 wines)
    const allWines = await sql`
      SELECT
        id, name, winery, region, country, grape_variety, vintage,
        wine_type, style, price_retail, price_trade, bottle_size,
        tasting_notes, critic_scores, drinking_window, image_url,
        stock_quantity, case_size, classification
      FROM wines
      WHERE is_active = true
      ORDER BY price_retail ASC
    `

    // Filter in application based on provided criteria
    let filteredWines = allWines.filter((wine: any) => {
      if (country && !wine.country?.toLowerCase().includes(country.toLowerCase())) {
        return false
      }
      if (region && !wine.region?.toLowerCase().includes(region.toLowerCase())) {
        return false
      }
      if (wine_type && wine.wine_type?.toLowerCase() !== wine_type.toLowerCase()) {
        return false
      }
      if (max_price && wine.price_retail > max_price) {
        return false
      }
      if (min_price && wine.price_retail < min_price) {
        return false
      }
      if (style && !wine.style?.toLowerCase().includes(style.toLowerCase())) {
        return false
      }
      if (grape_variety && !wine.grape_variety?.toLowerCase().includes(grape_variety.toLowerCase())) {
        return false
      }
      return true
    })

    // Limit to 5 results
    filteredWines = filteredWines.slice(0, 5)

    // Format for Hume voice response
    const formattedWines = filteredWines.map((wine: any) => ({
      id: wine.id,
      name: wine.name,
      winery: wine.winery,
      region: wine.region,
      country: wine.country,
      grape_variety: wine.grape_variety,
      vintage: wine.vintage,
      wine_type: wine.wine_type,
      style: wine.style,
      price_retail: wine.price_retail ? `£${wine.price_retail}` : null,
      price_trade: wine.price_trade ? `£${wine.price_trade}` : null,
      bottle_size: wine.bottle_size,
      tasting_notes: wine.tasting_notes,
      critic_scores: wine.critic_scores,
      drinking_window: wine.drinking_window,
      image_url: wine.image_url,
      stock_quantity: wine.stock_quantity,
      case_size: wine.case_size,
      classification: wine.classification,
    }))

    return NextResponse.json({
      success: true,
      count: formattedWines.length,
      wines: formattedWines,
      message: formattedWines.length > 0
        ? `Found ${formattedWines.length} wines in our database`
        : 'No wines found matching those criteria in our database'
    })

  } catch (error) {
    console.error('[Hume Tool] search-wines error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to search wines' },
      { status: 500 }
    )
  }
}
