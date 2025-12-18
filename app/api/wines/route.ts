import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const wines = await sql`
      SELECT id, name, winery, region, country, wine_type, price_retail, image_url, vintage, grape_variety
      FROM wines
      WHERE is_active = true
      ORDER BY id ASC
    `

    return NextResponse.json(wines)
  } catch (error) {
    console.error('[Wines API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wines' },
      { status: 500 }
    )
  }
}
