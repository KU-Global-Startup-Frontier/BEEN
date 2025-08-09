"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/Card"

interface StrengthCardProps {
  title: string
  description: string
  icon: string
  delay?: number
}

export function StrengthCard({ title, description, icon, delay = 0 }: StrengthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-4 h-full hover:shadow-lg transition-shadow">
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </Card>
    </motion.div>
  )
}