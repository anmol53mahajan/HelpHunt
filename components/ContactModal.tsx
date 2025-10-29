'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Phone, MessageCircle, User } from 'lucide-react'
import { Profile } from '@/lib/supabase'

interface ContactModalProps {
  profile: Profile
  onClose: () => void
}

export default function ContactModal({ profile, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    employerName: '',
    employerPhone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Save hire intent to database
      const response = await fetch('/api/hire-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employer_name: formData.employerName,
          employer_phone: formData.employerPhone,
          profile_id: profile.id,
          message: formData.message
        })
      })

      if (response.ok) {
        // Create WhatsApp message
        const whatsappMessage = `Hi ${profile.full_name}, I found your profile on HelpHunt. I need help for ${profile.availability.type === 'daily' ? 'daily' : 'one-time'} at ${profile.locality} from ${profile.availability.type === 'daily' ? `${profile.availability.from} to ${profile.availability.to}` : profile.availability.date}. My name is ${formData.employerName}, phone ${formData.employerPhone}. Message: ${formData.message}`
        
        const encodedMessage = encodeURIComponent(whatsappMessage)
        const whatsappUrl = `https://wa.me/${profile.phone.replace('+', '')}?text=${encodedMessage}`
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank')
        
        // Close modal
        onClose()
      } else {
        throw new Error('Failed to save hire intent')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Contact {profile.full_name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Your Name</label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.employerName}
              onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="label">Your Phone Number</label>
            <input
              type="tel"
              required
              className="input-field"
              value={formData.employerPhone}
              onChange={(e) => setFormData({ ...formData, employerPhone: e.target.value })}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="label">Message</label>
            <textarea
              required
              rows={3}
              className="input-field"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell them about your requirements..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-primary flex items-center justify-center"
            >
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact via WhatsApp
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This will open WhatsApp with a pre-filled message. 
            You can edit the message before sending.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
