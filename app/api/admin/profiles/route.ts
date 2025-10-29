import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    // Check admin access (simple check for demo)
    const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET
    if (!adminSecret) {
      throw new Error('Admin access not configured')
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)

  } catch (error: any) {
    console.error('Error fetching profiles for admin:', error)
    return NextResponse.json(
      { error: error.message || 'Access denied' },
      { status: 403 }
    )
  }
}
