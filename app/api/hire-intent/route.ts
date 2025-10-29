import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const {
      employer_name,
      employer_phone,
      profile_id,
      message
    } = body

    if (!employer_name || !employer_phone || !profile_id) {
      throw new Error('Missing required fields')
    }

    const hireIntentData = {
      employer_name,
      employer_phone,
      profile_id,
      message: message || ''
    }

    const { data, error } = await supabase
      .from('hire_intents')
      .insert([hireIntentData])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, hireIntentId: data.id }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating hire intent:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create hire intent' },
      { status: 500 }
    )
  }
}
