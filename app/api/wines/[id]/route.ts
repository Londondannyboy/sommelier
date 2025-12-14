import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const results = await sql`
      SELECT id, name, winery, region, country, grape_variety,
             vintage, wine_type, style, price_range,
             tasting_notes, food_pairings, alcohol_percentage, image_url
      FROM wines
      WHERE id = ${id} AND is_active = true
      LIMIT 1
    `

    if (results.length === 0) {
      return NextResponse.json(
        { error: 'Wine not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(results[0])
  } catch (error) {
    console.error('[Wine Detail API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wine details' },
      { status: 500 }
    )
  }
}
