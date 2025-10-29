import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    // Check admin access (simple check for demo)
    const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET
    if (!adminSecret) {
      throw new Error('Admin access not configured')
    }

    const body = await request.json()
    
    const {
      profileId,
      verification_status,
      is_pro
    } = body

    if (!profileId || !verification_status) {
      throw new Error('Missing required fields')
    }

    const updateData: any = {
      verification_status
    }

    if (typeof is_pro === 'boolean') {
      updateData.is_pro = is_pro
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', profileId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, profile: data })

  } catch (error: any) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    )
  }
}
