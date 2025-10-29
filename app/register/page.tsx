'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ServiceCategory } from '@/lib/supabase'
import { 
  Upload, 
  Camera, 
  Mic, 
  CheckCircle, 
  User, 
  MapPin, 
  DollarSign,
  Star,
  Calendar,
  Clock
} from 'lucide-react'
import { useReactMediaRecorder } from 'react-media-recorder'

export default function RegisterPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form data
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    service: '' as ServiceCategory,
    experience: 0,
    locality: '',
    availability: {
      type: 'daily' as 'daily' | 'one-time',
      from: '',
      to: '',
      date: '',
      slot: ''
    },
    skills: [] as string[],
    skillLevel: 'Basic' as 'Basic' | 'Medium' | 'Premium',
    expectedSalaryMin: 0,
    expectedSalaryMax: 0,
    description: ''
  })

  // File uploads
  const [files, setFiles] = useState({
    photo: null as File | null,
    idProof: null as File | null,
    selfie: null as File | null,
    audio: null as File | null
  })

  const [fileUrls, setFileUrls] = useState({
    photo: '',
    idProof: '',
    selfie: '',
    audio: ''
  })

  // Audio recording
  const {
    status: audioStatus,
    startRecording: startAudioRecording,
    stopRecording: stopAudioRecording,
    mediaBlobUrl: audioBlobUrl,
  } = useReactMediaRecorder({ audio: true, video: false })

  const cameraRef = useRef<HTMLVideoElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  // No OTP verification needed

  const handleFileUpload = (type: keyof typeof files, file: File) => {
    setFiles({ ...files, [type]: file })
    setFileUrls({ ...fileUrls, [type]: URL.createObjectURL(file) })
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Could not access camera. Please try again.')
    }
  }

  const captureSelfie = () => {
    if (cameraRef.current) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      canvas.width = cameraRef.current.videoWidth
      canvas.height = cameraRef.current.videoHeight
      
      ctx?.drawImage(cameraRef.current, 0, 0)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' })
          handleFileUpload('selfie', file)
          setIsVerified(true)
        }
      }, 'image/jpeg')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      
      // Add form data
      formDataToSend.append('phone', phone)
      formDataToSend.append('formData', JSON.stringify(formData))
      
      // Add files
      if (files.photo) formDataToSend.append('photo', files.photo)
      if (files.idProof) formDataToSend.append('idProof', files.idProof)
      if (files.selfie) formDataToSend.append('selfie', files.selfie)
      if (files.audio) formDataToSend.append('audio', files.audio)

      const response = await fetch('/api/profile', {
        method: 'POST',
        body: formDataToSend
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/profile/${data.profileId}`)
      } else {
        throw new Error('Failed to create profile')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create profile. Please try again.')
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

  const skillOptions = [
    'House Cleaning', 'Cooking', 'Laundry', 'Child Care', 'Elderly Care',
    'Pet Care', 'Ironing', 'Deep Cleaning', 'Grocery Shopping', 'Gardening',
    'North Indian Cuisine', 'South Indian Cuisine', 'Tiffin Preparation',
    'Hair Cutting', 'Beard Trimming', 'Hair Styling', 'Head Massage',
    'Wiring', 'Switch Installation', 'Fan Repair', 'Light Fixtures',
    'Pipe Repair', 'Tap Installation', 'Bathroom Fitting', 'Leak Repair',
    'Furniture Making', 'Repair Work', 'Custom Carpentry', 'Door Installation'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join HelpHunt
            </h1>
            <p className="text-gray-600">
              Create your profile and start earning with verified opportunities
            </p>
          </div>

          {/* Simple form - no progress steps needed */}

          {/* Form Content */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className="space-y-8"
            >
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Basic Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Full Name</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="label">Phone Number</label>
                    <input
                      type="tel"
                      required
                      className="input-field"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="label">Gender</label>
                    <select
                      required
                      className="input-field"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Service Category</label>
                    <select
                      required
                      className="input-field"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value as ServiceCategory })}
                    >
                      <option value="">Select service</option>
                      {serviceOptions.map((service) => (
                        <option key={service.value} value={service.value}>
                          {service.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="label">Experience (Years)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="input-field"
                      value={formData.experience || ''}
                      onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

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
              </div>

              {/* Availability */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Availability
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Availability Type</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="availabilityType"
                          value="daily"
                          checked={formData.availability.type === 'daily'}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            availability: { ...formData.availability, type: 'daily' }
                          })}
                          className="mr-2"
                        />
                        Daily (Regular hours)
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="availabilityType"
                          value="one-time"
                          checked={formData.availability.type === 'one-time'}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            availability: { ...formData.availability, type: 'one-time' }
                          })}
                          className="mr-2"
                        />
                        One-time (Specific dates)
                      </label>
                    </div>
                  </div>

                  {formData.availability.type === 'daily' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-gray-600">From</label>
                        <input
                          type="time"
                          className="input-field"
                          value={formData.availability.from}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            availability: { ...formData.availability, from: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">To</label>
                        <input
                          type="time"
                          className="input-field"
                          value={formData.availability.to}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            availability: { ...formData.availability, to: e.target.value }
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
                          value={formData.availability.date}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            availability: { ...formData.availability, date: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Time Slot</label>
                        <select
                          className="input-field"
                          value={formData.availability.slot}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            availability: { ...formData.availability, slot: e.target.value }
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

              {/* Skills & Pricing */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Skills & Pricing
                </h3>
                
                <div>
                  <label className="label">Skills</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                    {skillOptions.map((skill) => (
                      <label key={skill} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={formData.skills.includes(skill)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, skills: [...formData.skills, skill] })
                            } else {
                              setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) })
                            }
                          }}
                          className="mr-2"
                        />
                        {skill}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="label">Skill Level</label>
                    <select
                      required
                      className="input-field"
                      value={formData.skillLevel}
                      onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value as 'Basic' | 'Medium' | 'Premium' })}
                    >
                      <option value="Basic">Basic</option>
                      <option value="Medium">Medium</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="label">Min Salary (₹)</label>
                    <input
                      type="number"
                      required
                      className="input-field"
                      value={formData.expectedSalaryMin || ''}
                      onChange={(e) => setFormData({ ...formData, expectedSalaryMin: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  
                  <div>
                    <label className="label">Max Salary (₹)</label>
                    <input
                      type="number"
                      required
                      className="input-field"
                      value={formData.expectedSalaryMax || ''}
                      onChange={(e) => setFormData({ ...formData, expectedSalaryMax: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    rows={3}
                    className="input-field"
                    placeholder="Tell us about yourself and your experience..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              {/* File Uploads */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Verification Documents
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Photo Upload */}
                  <div>
                    <label className="label">Profile Photo</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('photo', e.target.files[0])}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        {fileUrls.photo ? (
                          <img src={fileUrls.photo} alt="Profile" className="w-24 h-24 object-cover rounded-lg mx-auto mb-2" />
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        )}
                        <p className="text-sm text-gray-600">Click to upload photo</p>
                      </label>
                    </div>
                  </div>

                  {/* ID Proof Upload */}
                  <div>
                    <label className="label">ID Proof (Aadhaar)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('idProof', e.target.files[0])}
                        className="hidden"
                        id="id-proof-upload"
                      />
                      <label htmlFor="id-proof-upload" className="cursor-pointer">
                        {fileUrls.idProof ? (
                          <img src={fileUrls.idProof} alt="ID Proof" className="w-24 h-24 object-cover rounded-lg mx-auto mb-2" />
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        )}
                        <p className="text-sm text-gray-600">Click to upload ID proof</p>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Selfie Capture */}
                <div>
                  <label className="label">Selfie Verification</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {!isCameraActive ? (
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <button
                          type="button"
                          onClick={startCamera}
                          className="btn-secondary"
                        >
                          Start Camera
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <video
                          ref={cameraRef}
                          autoPlay
                          muted
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={captureSelfie}
                            className="btn-primary"
                          >
                            Capture Selfie
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsCameraActive(false)}
                            className="btn-secondary"
                          >
                            Stop Camera
                          </button>
                          {isVerified && (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="w-5 h-5 mr-2" />
                              Verified
                            </div>
                          )}
                        </div>
                        {fileUrls.selfie && (
                          <div className="text-center">
                            <img src={fileUrls.selfie} alt="Selfie" className="w-24 h-24 object-cover rounded-lg mx-auto" />
                            <p className="text-sm text-green-600 mt-2">✓ Selfie captured</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Audio Introduction */}
                <div>
                  <label className="label">Audio Introduction</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center space-y-4">
                      <Mic className="w-8 h-8 text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-600">
                        Record a brief introduction about yourself
                      </p>
                      <div className="flex space-x-3 justify-center">
                        <button
                          type="button"
                          onClick={startAudioRecording}
                          disabled={audioStatus === 'recording'}
                          className="btn-primary"
                        >
                          {audioStatus === 'recording' ? 'Recording...' : 'Start Recording'}
                        </button>
                        <button
                          type="button"
                          onClick={stopAudioRecording}
                          disabled={audioStatus !== 'recording'}
                          className="btn-secondary"
                        >
                          Stop Recording
                        </button>
                      </div>
                      {audioBlobUrl && (
                        <div>
                          <audio src={audioBlobUrl} controls className="w-full" />
                          <p className="text-sm text-green-600 mt-2">✓ Audio recorded</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.fullName || !formData.service || !files.photo || !files.idProof}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  {isSubmitting ? (
                    'Creating Profile...'
                  ) : (
                    <>
                      <User className="w-4 h-4 mr-2" />
                      Create Profile
                    </>
                  )}
                </button>
              </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  )
}
