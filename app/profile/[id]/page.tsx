'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  User, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Phone, 
  Shield, 
  Calendar,
  Play,
  Download,
  MessageCircle
} from 'lucide-react'
import { Profile } from '@/lib/supabase'
import ContactModal from '@/components/ContactModal'

export default function ProfileDetailPage() {
  const params = useParams()
  const profileId = params.id as string
  
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showContactModal, setShowContactModal] = useState(false)

  useEffect(() => {
    if (profileId) {
      fetchProfile()
    }
  }, [profileId])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/profile/${profileId}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      } else {
        throw new Error('Profile not found')
      }
    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const maskPhone = (phone: string) => {
    if (phone.length > 6) {
      return phone.slice(0, 3) + '****' + phone.slice(-3)
    }
    return phone
  }

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Premium': return 'bg-purple-100 text-purple-800'
      case 'Medium': return 'bg-blue-100 text-blue-800'
      case 'Basic': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getVerificationBadge = () => {
    if (!profile) return null
    
    if (profile.verification_status === 'verified') {
      return (
        <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
          <Shield className="w-4 h-4 mr-1" />
          Verified
        </div>
      )
    } else if (profile.verification_status === 'rejected') {
      return (
        <div className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full">
          <Shield className="w-4 h-4 mr-1" />
          Rejected
        </div>
      )
    }
    return (
      <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
        <Clock className="w-4 h-4 mr-1" />
        Pending Verification
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The profile you are looking for does not exist.'}</p>
          <a href="/" className="btn-primary">
            Go Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-6">
                {profile.photo_url ? (
                  <img
                    src={profile.photo_url}
                    alt={profile.full_name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-4 border-white">
                    <User className="w-12 h-12" />
                  </div>
                )}
                
                <div>
                  <h1 className="text-3xl font-bold mb-2">{profile.full_name}</h1>
                  <div className="flex items-center space-x-4 text-blue-100">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{profile.locality}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span>{profile.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{profile.experience} years exp</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-col items-end space-y-2">
                {getVerificationBadge()}
                {profile.is_pro && (
                  <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    PRO
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="md:col-span-2 space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600">
                      <User className="w-5 h-5 mr-2" />
                      <span className="font-medium">Gender:</span>
                      <span className="ml-2">{profile.gender}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-5 h-5 mr-2" />
                      <span className="font-medium">Phone:</span>
                      <span className="ml-2">{maskPhone(profile.phone)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium">Service:</span>
                      <span className="ml-2 capitalize">{profile.service}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium">Skill Level:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(profile.skill_level)}`}>
                        {profile.skill_level}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Availability</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-600 mb-2">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span className="font-medium">Type:</span>
                      <span className="ml-2 capitalize">{profile.availability.type}</span>
                    </div>
                    {profile.availability.type === 'daily' ? (
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-2" />
                        <span className="font-medium">Hours:</span>
                        <span className="ml-2">{profile.availability.from} - {profile.availability.to}</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-2" />
                        <span className="font-medium">Date:</span>
                        <span className="ml-2">{profile.availability.date}</span>
                        {profile.availability.slot && (
                          <>
                            <span className="font-medium ml-4">Slot:</span>
                            <span className="ml-2 capitalize">{profile.availability.slot}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                {profile.description && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">About</h3>
                    <p className="text-gray-600 leading-relaxed">{profile.description}</p>
                  </div>
                )}

                {/* Verification Documents */}
                {(profile.id_proof_url || profile.selfie_url || profile.audio_url) && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Verification Documents</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {profile.id_proof_url && (
                        <div className="text-center">
                          <img
                            src={profile.id_proof_url}
                            alt="ID Proof"
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                          <p className="text-sm text-gray-600">ID Proof</p>
                        </div>
                      )}
                      {profile.selfie_url && (
                        <div className="text-center">
                          <img
                            src={profile.selfie_url}
                            alt="Selfie"
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                          <p className="text-sm text-gray-600">Selfie</p>
                        </div>
                      )}
                      {profile.audio_url && (
                        <div className="text-center">
                          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                            <Play className="w-8 h-8 text-gray-400" />
                          </div>
                          <audio src={profile.audio_url} controls className="w-full" />
                          <p className="text-sm text-gray-600">Audio Introduction</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Pricing */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-5 h-5 mr-2" />
                    <span className="font-medium">Expected Salary:</span>
                  </div>
                  <p className="text-xl font-bold text-blue-600 mt-2">
                    ₹{profile.expected_salary_min.toLocaleString()} - ₹{profile.expected_salary_max.toLocaleString()}
                  </p>
                </div>

                {/* Contact Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Now
                  </button>
                  
                  <a
                    href={`https://wa.me/${profile.phone.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-secondary flex items-center justify-center"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </a>
                </div>

                {/* Profile Stats */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-semibold">{profile.rating.toFixed(1)} ⭐</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience</span>
                      <span className="font-semibold">{profile.experience} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Joined</span>
                      <span className="font-semibold">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className="font-semibold capitalize">{profile.verification_status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <a href="/results" className="btn-secondary">
            ← Back to Results
          </a>
        </motion.div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          profile={profile}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  )
}