'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Shield, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface OTPFormProps {
  phone: string
  onVerified: () => void
  onBack: () => void
}

export default function OTPForm({ phone, onVerified, onBack }: OTPFormProps) {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isResending, setIsResending] = useState(false)

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms'
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        onVerified()
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsResending(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: 'sms'
        }
      })

      if (error) {
        setError(error.message)
      } else {
        setError('')
        alert('OTP sent successfully!')
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verify Your Phone
        </h2>
        <p className="text-gray-600">
          We sent a verification code to
        </p>
        <p className="font-semibold text-gray-900">
          {phone}
        </p>
      </div>

      <form onSubmit={handleVerifyOTP} className="space-y-4">
        <div>
          <label className="label">Enter OTP</label>
          <input
            type="text"
            required
            maxLength={6}
            className="input-field text-center text-2xl tracking-widest"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full btn-primary flex items-center justify-center"
        >
          {isLoading ? (
            'Verifying...'
          ) : (
            <>
              Verify OTP
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Didn't receive the code?
        </p>
        <button
          onClick={handleResendOTP}
          disabled={isResending}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {isResending ? 'Resending...' : 'Resend OTP'}
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 text-sm"
        >
          ← Change phone number
        </button>
      </div>
    </motion.div>
  )
}

interface PhoneFormProps {
  onOTPSent: (phone: string) => void
}

export function PhoneForm({ onOTPSent }: PhoneFormProps) {
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: 'sms'
        }
      })

      if (error) {
        setError(error.message)
      } else {
        onOTPSent(phone)
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Phone className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Enter Your Phone Number
        </h2>
        <p className="text-gray-600">
          We'll send you a verification code via SMS
        </p>
      </div>

      <form onSubmit={handleSendOTP} className="space-y-4">
        <div>
          <label className="label">Phone Number</label>
          <input
            type="tel"
            required
            className="input-field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 9876543210"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !phone}
          className="w-full btn-primary flex items-center justify-center"
        >
          {isLoading ? (
            'Sending OTP...'
          ) : (
            <>
              Send OTP
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </form>

      <div className="p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Make sure your phone number is correct. 
          You'll receive an SMS with the verification code.
        </p>
      </div>
    </motion.div>
  )
}
