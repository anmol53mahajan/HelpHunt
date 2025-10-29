import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const {
      phone,
      service,
      hireType,
      genderPreference,
      locality,
      timePref,
      maxSalary,
      skillLevel,
      extraFilters
    } = body

    if (!phone || !service || !locality || !maxSalary) {
      throw new Error('Missing required fields')
    }

    const employerRequestData = {
      phone,
      gender_preference: genderPreference,
      service,
      locality,
      time_pref: timePref,
      hire_type: hireType,
      max_salary: maxSalary,
      skill_level: skillLevel,
      extra_filters: extraFilters
    }

    const { data, error } = await supabase
      .from('employer_requests')
      .insert([employerRequestData])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ requestId: data.id }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating employer request:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create request' },
      { status: 500 }
    )
  }
}
