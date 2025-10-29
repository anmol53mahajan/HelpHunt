import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    // Extract form data
    const phone = formData.get('phone') as string
    const formDataJson = JSON.parse(formData.get('formData') as string)
    
    // Extract files
    const photo = formData.get('photo') as File
    const idProof = formData.get('idProof') as File
    const selfie = formData.get('selfie') as File
    const audio = formData.get('audio') as File

    if (!phone || !formDataJson.fullName || !formDataJson.service) {
      throw new Error('Missing required fields')
    }

    // Upload files to Supabase Storage
    const fileUploads = []
    
    if (photo) {
      const photoPath = `profiles/${Date.now()}-photo.jpg`
      const { data: photoData, error: photoError } = await supabase.storage
        .from('profiles')
        .upload(photoPath, photo)
      
      if (photoError) throw photoError
      fileUploads.push({ type: 'photo', url: photoData.path })
    }

    if (idProof) {
      const idProofPath = `profiles/${Date.now()}-id-proof.jpg`
      const { data: idProofData, error: idProofError } = await supabase.storage
        .from('profiles')
        .upload(idProofPath, idProof)
      
      if (idProofError) throw idProofError
      fileUploads.push({ type: 'idProof', url: idProofData.path })
    }

    if (selfie) {
      const selfiePath = `profiles/${Date.now()}-selfie.jpg`
      const { data: selfieData, error: selfieError } = await supabase.storage
        .from('profiles')
        .upload(selfiePath, selfie)
      
      if (selfieError) throw selfieError
      fileUploads.push({ type: 'selfie', url: selfieData.path })
    }

    if (audio) {
      const audioPath = `profiles/${Date.now()}-audio.mp3`
      const { data: audioData, error: audioError } = await supabase.storage
        .from('profiles')
        .upload(audioPath, audio)
      
      if (audioError) throw audioError
      fileUploads.push({ type: 'audio', url: audioData.path })
    }

    // Get public URLs
    const getPublicUrl = (path: string) => {
      const { data } = supabase.storage.from('profiles').getPublicUrl(path)
      return data.publicUrl
    }

    // Create profile data
    const profileData = {
      full_name: formDataJson.fullName,
      gender: formDataJson.gender,
      phone: phone,
      service: formDataJson.service,
      experience: formDataJson.experience,
      locality: formDataJson.locality,
      availability: formDataJson.availability,
      skills: formDataJson.skills,
      skill_level: formDataJson.skillLevel,
      expected_salary_min: formDataJson.expectedSalaryMin,
      expected_salary_max: formDataJson.expectedSalaryMax,
      description: formDataJson.description,
      photo_url: fileUploads.find(f => f.type === 'photo')?.url ? 
        getPublicUrl(fileUploads.find(f => f.type === 'photo')!.url) : null,
      id_proof_url: fileUploads.find(f => f.type === 'idProof')?.url ? 
        getPublicUrl(fileUploads.find(f => f.type === 'idProof')!.url) : null,
      selfie_url: fileUploads.find(f => f.type === 'selfie')?.url ? 
        getPublicUrl(fileUploads.find(f => f.type === 'selfie')!.url) : null,
      audio_url: fileUploads.find(f => f.type === 'audio')?.url ? 
        getPublicUrl(fileUploads.find(f => f.type === 'audio')!.url) : null,
      verification_status: 'pending',
      is_pro: false
    }

    // Insert profile into database
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ profileId: data.id }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating profile:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create profile' },
      { status: 500 }
    )
  }
}
