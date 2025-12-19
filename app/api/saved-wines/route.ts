import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { stackServerApp } from '@/stack/server'

const sql = neon(process.env.DATABASE_URL!)

// Helper to get or create user in public.users from neon_auth
async function getOrCreateUser(authUser: { id: string; primaryEmail?: string | null; displayName?: string | null }) {
  // Check if user exists
  let userResult = await sql`
    SELECT id FROM users WHERE neon_auth_id = ${authUser.id} LIMIT 1
  `

  if (userResult.length === 0) {
    // Create user from neon_auth data
    const firstName = authUser.displayName?.split(' ')[0] || null
    userResult = await sql`
      INSERT INTO users (neon_auth_id, email, first_name)
      VALUES (${authUser.id}, ${authUser.primaryEmail || null}, ${firstName})
      ON CONFLICT (neon_auth_id) DO UPDATE SET email = EXCLUDED.email
      RETURNING id
    `
  }

  return userResult[0]?.id
}

// GET - List user's saved wines
export async function GET() {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create user's internal ID
    const userId = await getOrCreateUser(user)

    if (!userId) {
      return NextResponse.json({ savedWines: [], savedWineIds: [] })
    }

    // Get saved wines with wine details
    const savedWines = await sql`
      SELECT
        w.id,
        w.name,
        w.slug,
        w.winery,
        w.region,
        w.wine_type,
        w.price_retail,
        w.image_url,
        w.vintage,
        sw.created_at as saved_at
      FROM saved_wines sw
      JOIN wines w ON w.id = sw.wine_id
      WHERE sw.user_id = ${userId}
      ORDER BY sw.created_at DESC
    `

    // Also return just the IDs for quick lookup
    const savedWineIds = savedWines.map(w => w.id)

    return NextResponse.json({ savedWines, savedWineIds })
  } catch (error) {
    console.error('[Saved Wines API] GET Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved wines' },
      { status: 500 }
    )
  }
}

// POST - Save a wine
export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { wineId } = body

    if (!wineId) {
      return NextResponse.json({ error: 'Wine ID required' }, { status: 400 })
    }

    // Get or create user's internal ID
    const userId = await getOrCreateUser(user)

    if (!userId) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    // Insert saved wine (ignore if already exists)
    await sql`
      INSERT INTO saved_wines (user_id, wine_id)
      VALUES (${userId}, ${wineId})
      ON CONFLICT (user_id, wine_id) DO NOTHING
    `

    return NextResponse.json({ success: true, wineId })
  } catch (error) {
    console.error('[Saved Wines API] POST Error:', error)
    return NextResponse.json(
      { error: 'Failed to save wine' },
      { status: 500 }
    )
  }
}

// DELETE - Remove a saved wine
export async function DELETE(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const wineId = searchParams.get('wineId')

    if (!wineId) {
      return NextResponse.json({ error: 'Wine ID required' }, { status: 400 })
    }

    // Get or create user's internal ID
    const userId = await getOrCreateUser(user)

    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Delete saved wine
    await sql`
      DELETE FROM saved_wines
      WHERE user_id = ${userId} AND wine_id = ${wineId}
    `

    return NextResponse.json({ success: true, wineId: parseInt(wineId) })
  } catch (error) {
    console.error('[Saved Wines API] DELETE Error:', error)
    return NextResponse.json(
      { error: 'Failed to remove saved wine' },
      { status: 500 }
    )
  }
}
