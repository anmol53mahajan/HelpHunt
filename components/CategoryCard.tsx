'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ServiceCategory } from '@/lib/supabase'
import { 
  Home, 
  ChefHat, 
  Scissors, 
  Zap, 
  Wrench, 
  Hammer,
  MoreHorizontal 
} from 'lucide-react'

const serviceIcons = {
  maid: Home,
  cook: ChefHat,
  barber: Scissors,
  electrician: Zap,
  plumber: Wrench,
  carpenter: Hammer,
  other: MoreHorizontal
}

const serviceLabels = {
  maid: 'House Maid',
  cook: 'Cook',
  barber: 'Barber',
  electrician: 'Electrician',
  plumber: 'Plumber',
  carpenter: 'Carpenter',
  other: 'Other Services'
}

const serviceColors = {
  maid: 'bg-pink-100 text-pink-600 hover:bg-pink-200',
  cook: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
  barber: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
  electrician: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200',
  plumber: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
  carpenter: 'bg-green-100 text-green-600 hover:bg-green-200',
  other: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
}

interface CategoryCardProps {
  service: ServiceCategory
  index: number
}

export default function CategoryCard({ service, index }: CategoryCardProps) {
  const Icon = serviceIcons[service] || serviceIcons.other
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="group"
    >
      <Link href={`/hire?service=${service}`}>
        <div className={`card cursor-pointer transition-all duration-300 ${serviceColors[service] || serviceColors.other} group-hover:shadow-lg`}>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-full ${(serviceColors[service] || serviceColors.other).replace('hover:', '')}`}>
                <Icon className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {serviceLabels[service] || serviceLabels.other}
            </h3>
            <p className="text-sm opacity-75">
              Find verified {(serviceLabels[service] || serviceLabels.other || 'service').toLowerCase()} professionals
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function CategoryGrid() {
  const services: ServiceCategory[] = ['maid', 'cook', 'barber', 'electrician', 'plumber', 'carpenter']
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Popular Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our most requested services and find the perfect match for your needs
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {services.map((service, index) => (
            <CategoryCard key={service} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
