import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { stackServerApp } from '@/stack/server'

const sql = neon(process.env.DATABASE_URL!)

// GET - Get user's recent searches
export async function GET() {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's internal ID
    const userResult = await sql`
      SELECT id FROM users WHERE neon_auth_id = ${user.id} LIMIT 1
    `

    if (userResult.length === 0) {
      return NextResponse.json({ searches: [] })
    }

    const userId = userResult[0].id

    // Get recent searches (last 10)
    const searches = await sql`
      SELECT id, query, filters, created_at
      FROM search_history
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 10
    `

    return NextResponse.json({ searches })
  } catch (error) {
    console.error('[Search History API] GET Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch search history' },
      { status: 500 }
    )
  }
}

// POST - Log a search
export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      // Silently ignore for non-logged-in users
      return NextResponse.json({ success: true })
    }

    const body = await request.json()
    const { query, filters } = body

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ success: true })
    }

    // Get user's internal ID
    const userResult = await sql`
      SELECT id FROM users WHERE neon_auth_id = ${user.id} LIMIT 1
    `

    if (userResult.length === 0) {
      return NextResponse.json({ success: true })
    }

    const userId = userResult[0].id

    // Insert search (avoid duplicates in recent history)
    await sql`
      INSERT INTO search_history (user_id, query, filters)
      VALUES (${userId}, ${query.trim()}, ${JSON.stringify(filters || {})})
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Search History API] POST Error:', error)
    return NextResponse.json(
      { error: 'Failed to log search' },
      { status: 500 }
    )
  }
}

// DELETE - Clear search history
export async function DELETE() {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's internal ID
    const userResult = await sql`
      SELECT id FROM users WHERE neon_auth_id = ${user.id} LIMIT 1
    `

    if (userResult.length === 0) {
      return NextResponse.json({ success: true })
    }

    const userId = userResult[0].id

    // Delete all searches for user
    await sql`
      DELETE FROM search_history WHERE user_id = ${userId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Search History API] DELETE Error:', error)
    return NextResponse.json(
      { error: 'Failed to clear search history' },
      { status: 500 }
    )
  }
}
