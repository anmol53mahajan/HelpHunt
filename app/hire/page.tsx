'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ServiceCategory } from '@/lib/supabase'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  User, 
  CheckCircle,
  Filter
} from 'lucide-react'

export default function HirePage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [formData, setFormData] = useState({
    service: '' as ServiceCategory,
    hireType: 'one-time' as 'one-time' | 'monthly',
    genderPreference: '',
    locality: '',
    timePref: {
      type: 'daily' as 'daily' | 'one-time',
      from: '',
      to: '',
      date: '',
      slot: ''
    },
    maxSalary: 0,
    skillLevel: 'Basic' as 'Basic' | 'Medium' | 'Premium',
    extraFilters: {
      cookingRequired: false,
      childCare: false,
      elderlyCare: false,
      petCare: false,
      deepCleaning: false,
      ironing: false
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // No OTP verification needed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/employer-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          ...formData
        })
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/results?reqId=${data.requestId}`)
      } else {
        throw new Error('Failed to submit request')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const serviceOptions: { value: ServiceCategory; label: string }[] = [
    { value: 'maid', label: 'House Maid' },
    { value: 'cook', label: 'Cook' },
    { value: 'barber', label: 'Barber' },
    { value: 'electrician', label: 'Electrician' },
    { value: 'plumber', label: 'Plumber' },
    { value: 'carpenter', label: 'Carpenter' },
    { value: 'other', label: 'Other Services' }
  ]

  const skillLevels = [
    { value: 'Basic', label: 'Basic', description: 'Entry level, basic tasks' },
    { value: 'Medium', label: 'Medium', description: 'Some experience, moderate skills' },
    { value: 'Premium', label: 'Premium', description: 'Expert level, advanced skills' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Find the Perfect Help
            </h1>
            <p className="text-gray-600">
              Tell us what you need and we'll find the best matches for you
            </p>
          </div>

          {/* Simple form - no progress steps needed */}

          {/* Form Content */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
            >
              {/* Phone Number */}
              <div>
                <label className="label">Your Phone Number</label>
                <input
                  type="tel"
                  required
                  className="input-field"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Service Selection */}
              <div>
                <label className="label">What service do you need?</label>
                <div className="grid grid-cols-2 gap-3">
                  {serviceOptions.map((service) => (
                    <label key={service.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="service"
                        value={service.value}
                        checked={formData.service === service.value}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value as ServiceCategory })}
                        className="mr-3"
                      />
                      <span>{service.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Hire Type */}
              <div>
                <label className="label">Hire Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="hireType"
                      value="one-time"
                      checked={formData.hireType === 'one-time'}
                      onChange={(e) => setFormData({ ...formData, hireType: e.target.value as 'one-time' | 'monthly' })}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">One-time</div>
                      <div className="text-sm text-gray-600">Single service</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="hireType"
                      value="monthly"
                      checked={formData.hireType === 'monthly'}
                      onChange={(e) => setFormData({ ...formData, hireType: e.target.value as 'one-time' | 'monthly' })}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Monthly</div>
                      <div className="text-sm text-gray-600">Regular service</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Gender Preference */}
              <div>
                <label className="label">Gender Preference</label>
                <select
                  className="input-field"
                  value={formData.genderPreference}
                  onChange={(e) => setFormData({ ...formData, genderPreference: e.target.value })}
                >
                  <option value="">No preference</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="label">Location</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Enter your area/locality"
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                />
              </div>

              {/* Time Preference */}
              <div>
                <label className="label">Time Preference</label>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="timeType"
                        value="daily"
                        checked={formData.timePref.type === 'daily'}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          timePref: { ...formData.timePref, type: 'daily' }
                        })}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">Daily</div>
                        <div className="text-sm text-gray-600">Regular hours</div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="timeType"
                        value="one-time"
                        checked={formData.timePref.type === 'one-time'}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          timePref: { ...formData.timePref, type: 'one-time' }
                        })}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">One-time</div>
                        <div className="text-sm text-gray-600">Specific date</div>
                      </div>
                    </label>
                  </div>

                  {formData.timePref.type === 'daily' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-gray-600">From</label>
                        <input
                          type="time"
                          className="input-field"
                          value={formData.timePref.from}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            timePref: { ...formData.timePref, from: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">To</label>
                        <input
                          type="time"
                          className="input-field"
                          value={formData.timePref.to}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            timePref: { ...formData.timePref, to: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-gray-600">Date</label>
                        <input
                          type="date"
                          className="input-field"
                          value={formData.timePref.date}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            timePref: { ...formData.timePref, date: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Time Slot</label>
                        <select
                          className="input-field"
                          value={formData.timePref.slot}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            timePref: { ...formData.timePref, slot: e.target.value }
                          })}
                        >
                          <option value="">Select slot</option>
                          <option value="morning">Morning (8AM-12PM)</option>
                          <option value="afternoon">Afternoon (12PM-4PM)</option>
                          <option value="evening">Evening (4PM-8PM)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="label">Maximum Budget (₹)</label>
                <input
                  type="number"
                  required
                  className="input-field"
                  placeholder="Enter your maximum budget"
                  value={formData.maxSalary || ''}
                  onChange={(e) => setFormData({ ...formData, maxSalary: parseInt(e.target.value) || 0 })}
                />
              </div>

              {/* Skill Level */}
              <div>
                <label className="label">Required Skill Level</label>
                <div className="space-y-2">
                  {skillLevels.map((level) => (
                    <label key={level.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="skillLevel"
                        value={level.value}
                        checked={formData.skillLevel === level.value}
                        onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value as 'Basic' | 'Medium' | 'Premium' })}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-gray-600">{level.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Extra Filters */}
              <div>
                <label className="label">Additional Requirements</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(formData.extraFilters).map(([key, value]) => (
                    <label key={key} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setFormData({
                          ...formData,
                          extraFilters: { ...formData.extraFilters, [key]: e.target.checked }
                        })}
                        className="mr-3"
                      />
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.service || !formData.locality || !formData.maxSalary}
                className="w-full btn-primary flex items-center justify-center"
              >
                {isSubmitting ? (
                  'Finding Matches...'
                ) : (
                  <>
                    <Filter className="w-4 h-4 mr-2" />
                    Find Perfect Matches
                  </>
                )}
              </button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  )
}
