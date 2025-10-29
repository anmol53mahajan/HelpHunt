'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Filter, Star, MapPin, Clock, DollarSign, Shield } from 'lucide-react'
import ProfileCard from '@/components/ProfileCard'
import { Profile, EmployerRequest } from '@/lib/supabase'

// Prevent static generation due to dynamic searchParams
export const dynamic = 'force-dynamic'

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const reqId = searchParams.get('reqId')
  
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [employerRequest, setEmployerRequest] = useState<EmployerRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    showVerifiedOnly: false,
    minRating: 0,
    maxSalary: 0
  })

  useEffect(() => {
    if (reqId) {
      fetchResults()
    } else {
      setError('No request ID provided')
      setIsLoading(false)
    }
  }, [reqId])

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/matching?reqId=${reqId}`)
      if (response.ok) {
        const data = await response.json()
        setProfiles(data.profiles)
        setEmployerRequest(data.request)
      } else {
        throw new Error('Failed to fetch results')
      }
    } catch (err) {
      setError('Failed to load results. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProfiles = profiles.filter(profile => {
    if (filters.showVerifiedOnly && profile.verification_status !== 'verified') {
      return false
    }
    if (filters.minRating > 0 && profile.rating < filters.minRating) {
      return false
    }
    if (filters.maxSalary > 0 && profile.expected_salary_min > filters.maxSalary) {
      return false
    }
    return true
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding the best matches for you...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <a href="/hire" className="btn-primary">
            Try Again
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Search Results
            </h1>
            <div className="text-sm text-gray-600">
              {filteredProfiles.length} matches found
            </div>
          </div>

          {employerRequest && (
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Search className="w-4 h-4 mr-2" />
                <span>{employerRequest.service}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{employerRequest.locality}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>{employerRequest.hire_type}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign className="w-4 h-4 mr-2" />
                <span>₹{employerRequest.max_salary.toLocaleString()}</span>
              </div>
            </div>
          )}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/4"
          >
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.showVerifiedOnly}
                      onChange={(e) => setFilters({ ...filters, showVerifiedOnly: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium">Verified only</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    className="input-field"
                    value={filters.minRating}
                    onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                  >
                    <option value={0}>Any rating</option>
                    <option value={3}>3+ stars</option>
                    <option value={4}>4+ stars</option>
                    <option value={4.5}>4.5+ stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Budget (₹)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="Enter max budget"
                    value={filters.maxSalary || ''}
                    onChange={(e) => setFilters({ ...filters, maxSalary: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <button
                  onClick={() => setFilters({ showVerifiedOnly: false, minRating: 0, maxSalary: 0 })}
                  className="w-full text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results Grid */}
          <div className="lg:w-3/4">
            {filteredProfiles.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-12 text-center"
              >
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No matches found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or expanding your search criteria.
                </p>
                <a href="/hire" className="btn-primary">
                  Modify Search
                </a>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProfiles.map((profile, index) => (
                  <ProfileCard key={profile.id} profile={profile} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Back to Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <a href="/hire" className="btn-secondary">
            ← Start New Search
          </a>
        </motion.div>
      </div>
    </div>
  )
}
