'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, Users, Star, Shield } from 'lucide-react'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Find Trusted Help
            <br />
            <span className="text-yellow-300">Near You</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Connect with verified domestic workers, cooks, barbers, electricians, 
            plumbers and more. Safe, reliable, and professional services.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/hire">
              <motion.button 
                className="btn-primary bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-lg font-semibold flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-5 h-5 mr-2" />
                I'm Looking for Help
              </motion.button>
            </Link>
            
            <Link href="/register">
              <motion.button 
                className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 rounded-lg font-semibold flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="w-5 h-5 mr-2" />
                I Want to Work
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">500+</div>
              <div className="text-sm opacity-90">Verified Workers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">1000+</div>
              <div className="text-sm opacity-90">Happy Families</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">4.8</div>
              <div className="text-sm opacity-90 flex items-center justify-center">
                <Star className="w-4 h-4 mr-1 fill-current" />
                Average Rating
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">100%</div>
              <div className="text-sm opacity-90 flex items-center justify-center">
                <Shield className="w-4 h-4 mr-1" />
                Verified Profiles
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
