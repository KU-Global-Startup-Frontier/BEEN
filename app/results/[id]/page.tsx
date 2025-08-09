"use client"

import { useState, useRef, use, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { 
  Download, 
  Share2, 
  ArrowLeft, 
  Copy, 
  Check,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  Lock,
  User
} from "lucide-react"
import Link from "next/link"
import html2canvas from "html2canvas"
import { RadarChart } from "../components/RadarChart"
import { StrengthCard } from "../components/StrengthCard"
import { ShareDialog } from "../components/ShareDialog"
import { GoogleAuthButton } from "@/components/GoogleAuthButton"
import { createClient } from "@/lib/supabase/client"
import { User as SupabaseUser } from "@supabase/supabase-js"

// 샘플 분석 결과 데이터
const sampleResult = {
  id: "sample",
  categories: [
    { name: "창작", score: 85 },
    { name: "기술", score: 78 },
    { name: "학습", score: 72 },
    { name: "운동", score: 45 },
    { name: "사회활동", score: 60 },
    { name: "예술", score: 55 },
  ],
  keywords: [
    "창의적", "논리적", "도전적", "분석적", "혁신적",
    "실용적", "체계적", "문제해결", "성장지향", "탐구심"
  ],
  strengths: [
    {
      title: "창의적 문제해결자",
      description: "복잡한 문제를 창의적인 방법으로 해결하는 능력이 뛰어납니다",
      icon: "🎨"
    },
    {
      title: "기술 혁신가",
      description: "새로운 기술을 빠르게 습득하고 활용하는 재능이 있습니다",
      icon: "💡"
    },
    {
      title: "지속적 학습자",
      description: "끊임없이 배우고 성장하려는 열정을 가지고 있습니다",
      icon: "📚"
    }
  ],
  recommendations: [
    "프로그래밍 프로젝트 시작하기",
    "창작 활동과 기술을 결합한 프로젝트",
    "온라인 강의나 워크샵 참여",
    "해커톤이나 공모전 도전",
    "기술 블로그 운영 시작"
  ]
}

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    // Check for logged in user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleDownload = async () => {
    if (!resultRef.current || isDownloading) return
    
    setIsDownloading(true)
    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
      })
      
      const link = document.createElement('a')
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      link.download = `been-result-${timestamp}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/evaluate">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                다시 평가하기
              </Button>
            </Link>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? "저장 중..." : "이미지 저장"}
              </Button>
              <Button
                size="sm"
                onClick={() => setIsShareOpen(true)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                공유하기
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Result Content */}
      <main className="container mx-auto px-4 py-8">
        <div ref={resultRef} className="max-w-4xl mx-auto space-y-8 bg-white rounded-2xl p-8">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI 분석 완료
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              당신의 흥미·강점 분석 결과
            </h1>
            <p className="text-gray-600">
              25개 활동 평가 기반 개인 맞춤 분석
            </p>
          </motion.div>

          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              관심 분야 분석
            </h2>
            <RadarChart data={sampleResult.categories} />
          </motion.div>

          {/* Keywords */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              핵심 키워드
            </h2>
            <div className="flex flex-wrap gap-2">
              {sampleResult.keywords.map((keyword, index) => (
                <motion.span
                  key={keyword}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm"
                >
                  {keyword}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              당신의 강점
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {sampleResult.strengths.map((strength, index) => (
                <StrengthCard
                  key={index}
                  {...strength}
                  delay={0.6 + index * 0.1}
                />
              ))}
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              추천 활동
            </h2>
            <ul className="space-y-2">
              {sampleResult.recommendations.map((rec, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span className="text-gray-700">{rec}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Save Results CTA - Only show if not logged in */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-8 text-white"
            >
              <div className="text-center">
                <Lock className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <h3 className="text-2xl font-bold mb-2">
                  이 정보를 저장하고 더 많은 기능을 이용하세요!
                </h3>
                <p className="text-white/90 mb-6">
                  Google 계정으로 가입하면 평가 기록을 저장하고<br />
                  더 자세한 분석 결과를 받아볼 수 있어요.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <GoogleAuthButton 
                    text="Google로 무료 가입하기"
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100"
                    redirectTo={`/results/${id}`}
                  />
                  <div className="text-sm text-white/70">
                    ✓ 평가 기록 저장<br />
                    ✓ 상세 분석 리포트<br />
                    ✓ 맞춤 추천 활동
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              BEEN - AI 기반 흥미·강점 분석 서비스
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="max-w-4xl mx-auto mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/evaluate">
            <Button size="lg" variant="outline">
              다시 평가하기
            </Button>
          </Link>
          <Button size="lg" onClick={() => setIsShareOpen(true)}>
            친구에게 공유하기
          </Button>
        </motion.div>
      </main>

      {/* Share Dialog */}
      <ShareDialog 
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        resultId={id}
      />
    </div>
  )
}