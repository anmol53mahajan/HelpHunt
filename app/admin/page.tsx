'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Star, 
  Eye, 
  Play, 
  Download,
  User,
  Phone,
  MapPin,
  Clock
} from 'lucide-react'
import { Profile } from '@/lib/supabase'

export default function AdminPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/admin/profiles')
      if (response.ok) {
        const data = await response.json()
        setProfiles(data)
      } else {
        throw new Error('Failed to fetch profiles')
      }
    } catch (err) {
      setError('Failed to load profiles')
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfileStatus = async (profileId: string, status: 'verified' | 'rejected', isPro?: boolean) => {
    setIsUpdating(true)
    try {
      const response = await fetch('/api/admin/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId,
          verification_status: status,
          is_pro: isPro
        })
      })

      if (response.ok) {
        // Update local state
        setProfiles(profiles.map(profile => 
          profile.id === profileId 
            ? { ...profile, verification_status: status, is_pro: isPro ?? profile.is_pro }
            : profile
        ))
        
        if (selectedProfile?.id === profileId) {
          setSelectedProfile({ ...selectedProfile, verification_status: status, is_pro: isPro ?? selectedProfile.is_pro })
        }
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (err) {
      console.error('Error:', err)
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-50'
      case 'rejected': return 'text-red-600 bg-red-50'
      default: return 'text-yellow-600 bg-yellow-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <a href="/" className="btn-primary">
            Go Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
              <p className="text-gray-600">Manage worker profiles and verifications</p>
            </div>
            <div className="flex items-center text-blue-600">
              <Shield className="w-6 h-6 mr-2" />
              <span className="font-semibold">Admin Access</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-2xl font-bold text-blue-600">{profiles.length}</div>
              <div className="text-sm text-gray-600">Total Profiles</div>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <div className="text-2xl font-bold text-green-600">
                {profiles.filter(p => p.verification_status === 'verified').length}
              </div>
              <div className="text-sm text-gray-600">Verified</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-6">
              <div className="text-2xl font-bold text-yellow-600">
                {profiles.filter(p => p.verification_status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="text-2xl font-bold text-purple-600">
                {profiles.filter(p => p.is_pro).length}
              </div>
              <div className="text-sm text-gray-600">Pro Workers</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profiles List */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profiles</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {profiles.map((profile) => (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedProfile?.id === profile.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedProfile(profile)}
                  >
                    <div className="flex items-center space-x-4">
                      {profile.photo_url ? (
                        <img
                          src={profile.photo_url}
                          alt={profile.full_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{profile.full_name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className="capitalize">{profile.service}</span>
                          <span>•</span>
                          <span>{profile.locality}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className={`flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(profile.verification_status)}`}>
                            {getStatusIcon(profile.verification_status)}
                            <span className="ml-1 capitalize">{profile.verification_status}</span>
                          </div>
                          {profile.is_pro && (
                            <div className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                              PRO
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                        <span className="text-sm">{profile.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-1">
              {selectedProfile ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-50 rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedProfile.full_name}</h4>
                      <p className="text-sm text-gray-600">{selectedProfile.service} • {selectedProfile.locality}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span>{selectedProfile.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Experience:</span>
                        <span>{selectedProfile.experience} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Skill Level:</span>
                        <span>{selectedProfile.skill_level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Salary:</span>
                        <span>₹{selectedProfile.expected_salary_min.toLocaleString()}-{selectedProfile.expected_salary_max.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Verification Documents */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Verification Documents</h4>
                      
                      {selectedProfile.id_proof_url && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">ID Proof</p>
                          <img
                            src={selectedProfile.id_proof_url}
                            alt="ID Proof"
                            className="w-full h-24 object-cover rounded border"
                          />
                        </div>
                      )}
                      
                      {selectedProfile.selfie_url && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Selfie</p>
                          <img
                            src={selectedProfile.selfie_url}
                            alt="Selfie"
                            className="w-full h-24 object-cover rounded border"
                          />
                        </div>
                      )}
                      
                      {selectedProfile.audio_url && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Audio Introduction</p>
                          <audio src={selectedProfile.audio_url} controls className="w-full" />
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-4 border-t">
                      {selectedProfile.verification_status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateProfileStatus(selectedProfile.id, 'verified', true)}
                            disabled={isUpdating}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium disabled:opacity-50"
                          >
                            ✓ Approve & Make Pro
                          </button>
                          <button
                            onClick={() => updateProfileStatus(selectedProfile.id, 'verified', false)}
                            disabled={isUpdating}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium disabled:opacity-50"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => updateProfileStatus(selectedProfile.id, 'rejected')}
                            disabled={isUpdating}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium disabled:opacity-50"
                          >
                            ✗ Reject
                          </button>
                        </>
                      )}
                      
                      {selectedProfile.verification_status === 'verified' && (
                        <div className="space-y-2">
                          <button
                            onClick={() => updateProfileStatus(selectedProfile.id, 'verified', !selectedProfile.is_pro)}
                            disabled={isUpdating}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium disabled:opacity-50"
                          >
                            {selectedProfile.is_pro ? 'Remove Pro Status' : 'Make Pro'}
                          </button>
                          <button
                            onClick={() => updateProfileStatus(selectedProfile.id, 'rejected')}
                            disabled={isUpdating}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium disabled:opacity-50"
                          >
                            ✗ Reject
                          </button>
                        </div>
                      )}
                      
                      {selectedProfile.verification_status === 'rejected' && (
                        <button
                          onClick={() => updateProfileStatus(selectedProfile.id, 'verified', false)}
                          disabled={isUpdating}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                          ✓ Approve
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a profile to view details</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
