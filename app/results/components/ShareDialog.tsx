"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Copy, Check, MessageCircle, Link2, Instagram } from "lucide-react"
import { motion } from "framer-motion"

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  resultId: string
}

export function ShareDialog({ isOpen, onClose, resultId }: ShareDialogProps) {
  const [isCopied, setIsCopied] = useState(false)
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/results/${resultId}`
    : ''

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleKakaoShare = () => {
    // Kakao SDK would be integrated here
    console.log("Kakao share:", shareUrl)
  }

  const handleInstagramShare = () => {
    // Instagram share logic
    console.log("Instagram share")
  }

  const shareOptions = [
    {
      name: "링크 복사",
      icon: isCopied ? Check : Copy,
      onClick: handleCopyLink,
      color: "bg-gray-100 hover:bg-gray-200",
      iconColor: isCopied ? "text-green-600" : "text-gray-600"
    },
    {
      name: "카카오톡",
      icon: MessageCircle,
      onClick: handleKakaoShare,
      color: "bg-yellow-100 hover:bg-yellow-200",
      iconColor: "text-yellow-600"
    },
    {
      name: "인스타그램",
      icon: Instagram,
      onClick: handleInstagramShare,
      color: "bg-pink-100 hover:bg-pink-200",
      iconColor: "text-pink-600"
    }
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="결과 공유하기"
    >
      <div className="space-y-4">
        <p className="text-gray-600 text-sm">
          당신의 흥미·강점 분석 결과를 친구들과 공유해보세요!
        </p>

        {/* Share URL */}
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Link2 className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyLink}
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Share Options */}
        <div className="grid grid-cols-3 gap-3">
          {shareOptions.map((option, index) => (
            <motion.button
              key={option.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={option.onClick}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-colors ${option.color}`}
            >
              <option.icon className={`w-6 h-6 ${option.iconColor}`} />
              <span className="text-xs font-medium text-gray-700">
                {option.name}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Hashtags */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">추천 해시태그</p>
          <div className="flex flex-wrap gap-2">
            {["#BEEN", "#흥미강점분석", "#자기발견", "#AI분석", "#진로탐색"].map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100"
                onClick={() => navigator.clipboard.writeText(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}