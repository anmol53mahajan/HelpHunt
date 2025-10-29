import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Mark as dynamic since it uses request.url
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const reqId = searchParams.get('reqId')

    if (!reqId) {
      throw new Error('Request ID is required')
    }

    // Fetch employer request
    const { data: employerRequest, error: requestError } = await supabase
      .from('employer_requests')
      .select('*')
      .eq('id', reqId)
      .single()

    if (requestError) throw requestError

    // Build matching query
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('service', employerRequest.service)
      .lte('expected_salary_min', employerRequest.max_salary)

    // Add locality filter (case-insensitive contains)
    if (employerRequest.locality) {
      query = query.ilike('locality', `%${employerRequest.locality}%`)
    }

    // Add skill level filter
    if (employerRequest.skill_level) {
      const skillLevels = ['Basic', 'Medium', 'Premium']
      const requestedLevelIndex = skillLevels.indexOf(employerRequest.skill_level)
      
      if (requestedLevelIndex >= 0) {
        const allowedLevels = skillLevels.slice(requestedLevelIndex)
        query = query.in('skill_level', allowedLevels)
      }
    }

    // Add gender preference filter
    if (employerRequest.gender_preference) {
      query = query.eq('gender', employerRequest.gender_preference)
    }

    // Add availability filter (simplified for now)
    if (employerRequest.time_pref?.type) {
      // For now, let's skip the availability filter to avoid JSON issues
      // We can add this back later with proper JSON handling
      console.log('Availability filter skipped for now:', employerRequest.time_pref.type)
    }

    // Order results
    query = query
      .order('is_pro', { ascending: false })
      .order('rating', { ascending: false })

    const { data: profiles, error: profilesError } = await query

    if (profilesError) throw profilesError

    return NextResponse.json({
      profiles: profiles || [],
      request: employerRequest
    })

  } catch (error: any) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}
