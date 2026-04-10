import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const supabase = await createClient()

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if (body.status) {
    updates.status = body.status
    if (body.status === 'approved' || body.status === 'rejected') {
      updates.reviewed_at = new Date().toISOString()
    }
    if (body.status === 'published') {
      updates.published_at = new Date().toISOString()
    }
  }

  if (body.rejection_note !== undefined) updates.rejection_note = body.rejection_note
  if (body.title !== undefined) updates.title = body.title
  if (body.body !== undefined) updates.body = body.body
  if (body.image_url !== undefined) updates.image_url = body.image_url

  const { data, error } = await supabase
    .from('content_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }

  return Response.json(data)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { error } = await supabase
    .from('content_items')
    .delete()
    .eq('id', id)

  if (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }

  return Response.json({ ok: true })
}
