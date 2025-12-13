import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

/**
 * Hume Webhook Endpoint
 *
 * Receives conversation data from Hume when a chat session ends.
 * Saves the conversation to Neon for future reference.
 */

interface HumeWebhookPayload {
  type: string
  chat_id: string
  chat_group_id: string
  user_id?: string
  messages?: Array<{
    role: string
    content: string
    timestamp?: string
  }>
  metadata?: Record<string, unknown>
}

export async function POST(request: NextRequest) {
  try {
    const body: HumeWebhookPayload = await request.json()
    console.log('[Hume Webhook] Received:', body.type)

    const { type, chat_id, chat_group_id, user_id, messages, metadata } = body

    // Only process chat_end events
    if (type !== 'chat_end' && type !== 'session_end') {
      return NextResponse.json({ status: 'ignored', reason: `Event type: ${type}` })
    }

    if (!user_id) {
      console.log('[Hume Webhook] No user_id, skipping save')
      return NextResponse.json({ status: 'skipped', reason: 'No user_id' })
    }

    // Get internal user ID from neon_auth_id
    const userResult = await sql`
      SELECT id FROM users WHERE neon_auth_id = ${user_id} LIMIT 1
    `

    if (userResult.length === 0) {
      console.log('[Hume Webhook] User not found:', user_id)
      return NextResponse.json({ status: 'skipped', reason: 'User not found' })
    }

    const internalUserId = userResult[0].id

    // Format messages for storage
    const conversationText = messages?.map(m =>
      `${m.role}: ${m.content}`
    ).join('\n') || ''

    // Save conversation to database
    await sql`
      INSERT INTO user_conversations (
        user_id,
        hume_chat_id,
        hume_chat_group_id,
        conversation_text,
        metadata,
        created_at
      ) VALUES (
        ${internalUserId},
        ${chat_id},
        ${chat_group_id},
        ${conversationText},
        ${JSON.stringify(metadata || {})},
        NOW()
      )
    `

    console.log('[Hume Webhook] Saved conversation for user:', user_id)

    return NextResponse.json({
      status: 'saved',
      chat_id,
      message_count: messages?.length || 0
    })
  } catch (error) {
    console.error('[Hume Webhook] Error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed', details: String(error) },
      { status: 500 }
    )
  }
}

// GET for testing
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'Hume Webhook - Sommelier AI',
    accepts: ['chat_end', 'session_end'],
    saves_to: 'Neon (user_conversations)'
  })
}
