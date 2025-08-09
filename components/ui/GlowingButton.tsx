"use client"

import { motion } from "framer-motion"
import { ReactNode, useState } from "react"

interface GlowingButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  gradient?: string
}

export function GlowingButton({ 
  children, 
  className = "",
  onClick,
  gradient = "from-purple-600 via-pink-600 to-yellow-600"
}: GlowingButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.button
      className={`relative group ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-full blur-xl`}
        animate={{
          scale: isHovered ? [1, 1.3, 1.1] : 1,
          opacity: isHovered ? [0.5, 0.8, 0.6] : 0.3,
        }}
        transition={{ duration: 0.5 }}
      />
      
      <motion.div
        className={`relative bg-gradient-to-r ${gradient} rounded-full px-8 py-4`}
        animate={{
          background: isHovered 
            ? "linear-gradient(90deg, #ec4899, #f59e0b, #a855f7)"
            : `linear-gradient(90deg, ${gradient})`,
        }}
      >
        <span className="relative z-10 flex items-center gap-2 font-bold text-white">
          {children}
        </span>
      </motion.div>
      
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: isHovered
            ? "0 0 80px rgba(168, 85, 247, 0.8)"
            : "0 0 30px rgba(168, 85, 247, 0.3)",
        }}
      />
    </motion.button>
  )
}