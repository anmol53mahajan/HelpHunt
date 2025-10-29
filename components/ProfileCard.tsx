'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Shield, Star, MapPin, Clock, DollarSign, User } from 'lucide-react'
import { Profile } from '@/lib/supabase'
import ContactModal from './ContactModal'

interface ProfileCardProps {
  profile: Profile
  index: number
}

export default function ProfileCard({ profile, index }: ProfileCardProps) {
  const [showContactModal, setShowContactModal] = useState(false)

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
    if (profile.verification_status === 'verified') {
      return (
        <div className="flex items-center text-green-600 text-sm">
          <Shield className="w-4 h-4 mr-1" />
          Verified
        </div>
      )
    }
    return (
      <div className="flex items-center text-yellow-600 text-sm">
        <Clock className="w-4 h-4 mr-1" />
        Pending
      </div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="card hover:shadow-lg transition-shadow duration-300"
      >
        {/* Profile Image */}
        <div className="relative mb-4">
          {profile.photo_url ? (
            <img
              src={profile.photo_url}
              alt={profile.full_name}
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <User className="w-16 h-16 text-gray-400" />
            </div>
          )}
          
          {/* Pro Badge */}
          {profile.is_pro && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              PRO
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-gray-900">
              {profile.full_name}
            </h3>
            {getVerificationBadge()}
          </div>

          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{profile.locality}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {profile.availability.type === 'daily' 
                ? `${profile.availability.from} - ${profile.availability.to}`
                : profile.availability.date
              }
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <DollarSign className="w-4 h-4 mr-1" />
            <span className="text-sm">
              ₹{profile.expected_salary_min.toLocaleString()} - ₹{profile.expected_salary_max.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
            <span className="text-sm">{profile.rating.toFixed(1)} ({profile.experience} years exp)</span>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(profile.skill_level)}`}>
              {profile.skill_level}
            </span>
            {profile.skills.slice(0, 2).map((skill, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {skill}
              </span>
            ))}
            {profile.skills.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                +{profile.skills.length - 2} more
              </span>
            )}
          </div>

          {/* Description */}
          {profile.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {profile.description}
            </p>
          )}

          {/* Contact Info */}
          <div className="flex items-center text-gray-600">
            <Phone className="w-4 h-4 mr-1" />
            <span className="text-sm">{maskPhone(profile.phone)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <button
              onClick={() => setShowContactModal(true)}
              className="flex-1 btn-primary text-sm py-2"
            >
              Contact
            </button>
            <button
              onClick={() => window.open(`/profile/${profile.id}`, '_blank')}
              className="flex-1 btn-secondary text-sm py-2"
            >
              View Profile
            </button>
          </div>
        </div>
      </motion.div>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          profile={profile}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </>
  )
}
