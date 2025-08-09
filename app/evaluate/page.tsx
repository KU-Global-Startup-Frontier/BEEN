"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "@/lib/store/useStore"
import { ActivityCard } from "./components/ActivityCard"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Button } from "@/components/ui/Button"
import { Loading } from "@/components/ui/Loading"
import { ChevronLeft, Sparkles } from "lucide-react"
import Link from "next/link"

export default function EvaluatePage() {
  const router = useRouter()
  const {
    sessionId,
    ratings,
    activityStatuses,
    ratedCount,
    initSession,
    setRating,
    setActivityStatus,
    canAnalyze,
    setIsAnalyzing
  } = useStore()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [activities, setActivities] = useState<any[]>([])
  const [isFetchingActivities, setIsFetchingActivities] = useState(true)
  const [isSaving, setIsSaving] = useState(false) // eslint-disable-line @typescript-eslint/no-unused-vars

  // Initialize session and fetch activities
  useEffect(() => {
    const init = async () => {
      if (!sessionId) {
        initSession()
      }

      // Fetch activities from API
      try {
        const response = await fetch('/api/activities')
        const data = await response.json()

        if (data.activities && data.activities.length > 0) {
          setActivities(data.activities)
        } else {
          // Fallback to mock data if API fails
          setActivities([
            { id: "1", name: "블로그 글쓰기", category: "창작", description: "생각과 경험을 글로 표현하는 활동" },
            { id: "2", name: "소설 쓰기", category: "창작", description: "상상력을 발휘해 이야기를 창작하는 활동" },
            { id: "3", name: "프로그래밍 공부", category: "학습", description: "코딩과 개발 기술을 배우는 활동" },
            { id: "4", name: "조깅/러닝", category: "운동", description: "달리기를 통한 유산소 운동" },
            { id: "5", name: "봉사활동", category: "사회활동", description: "사회에 기여하는 자원봉사 활동" },
            { id: "6", name: "웹 개발", category: "기술", description: "웹사이트와 웹 애플리케이션 개발" },
            { id: "7", name: "창업 준비", category: "비즈니스", description: "사업 아이디어 구상과 준비" },
            { id: "8", name: "전시회 관람", category: "예술", description: "미술 작품 감상" },
            { id: "9", name: "요리", category: "취미", description: "음식을 만드는 활동" },
            { id: "10", name: "사진 촬영", category: "창작", description: "순간을 포착하고 예술적으로 표현하는 활동" },
            { id: "11", name: "요가", category: "운동", description: "몸과 마음의 균형을 찾는 운동" },
            { id: "12", name: "독서", category: "학습", description: "책을 읽으며 지식과 교양을 쌓는 활동" },
            { id: "13", name: "음악 작곡", category: "창작", description: "멜로디와 화음을 만들어내는 활동" },
            { id: "14", name: "등산", category: "운동", description: "자연 속에서 즐기는 신체 활동" },
            { id: "15", name: "동아리 활동", category: "사회활동", description: "관심사를 공유하는 모임 활동" },
            { id: "16", name: "데이터 분석", category: "기술", description: "데이터를 수집하고 분석하는 활동" },
            { id: "17", name: "마케팅 기획", category: "비즈니스", description: "마케팅 전략 수립과 실행" },
            { id: "18", name: "영화 감상", category: "예술", description: "영화를 보고 감상하는 활동" },
            { id: "19", name: "여행", category: "취미", description: "국내외 여행과 탐험" },
            { id: "20", name: "팟캐스트 제작", category: "창작", description: "음성 콘텐츠를 기획하고 제작하는 활동" },
            { id: "21", name: "헬스/웨이트", category: "운동", description: "근력 운동과 체력 단련" },
            { id: "22", name: "외국어 학습", category: "학습", description: "새로운 언어를 배우고 익히는 활동" },
            { id: "23", name: "그림 그리기", category: "창작", description: "시각적 예술 작품을 창작하는 활동" },
            { id: "24", name: "축구", category: "운동", description: "팀 스포츠로 즐기는 구기 운동" },
            { id: "25", name: "네트워킹 이벤트 참가", category: "사회활동", description: "인맥을 넓히는 사교 활동" },
          ])
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error)
        // Use fallback mock data
        setActivities([
          { id: "1", name: "블로그 글쓰기", category: "창작", description: "생각과 경험을 글로 표현하는 활동" },
          { id: "2", name: "소설 쓰기", category: "창작", description: "상상력을 발휘해 이야기를 창작하는 활동" },
          { id: "3", name: "프로그래밍 공부", category: "학습", description: "코딩과 개발 기술을 배우는 활동" },
          { id: "4", name: "조깅/러닝", category: "운동", description: "달리기를 통한 유산소 운동" },
          { id: "5", name: "봉사활동", category: "사회활동", description: "사회에 기여하는 자원봉사 활동" },
          { id: "6", name: "웹 개발", category: "기술", description: "웹사이트와 웹 애플리케이션 개발" },
          { id: "7", name: "창업 준비", category: "비즈니스", description: "사업 아이디어 구상과 준비" },
          { id: "8", name: "전시회 관람", category: "예술", description: "미술 작품 감상" },
          { id: "9", name: "요리", category: "취미", description: "음식을 만드는 활동" },
          { id: "10", name: "사진 촬영", category: "창작", description: "순간을 포착하고 예술적으로 표현하는 활동" },
          { id: "11", name: "요가", category: "운동", description: "몸과 마음의 균형을 찾는 운동" },
          { id: "12", name: "독서", category: "학습", description: "책을 읽으며 지식과 교양을 쌓는 활동" },
          { id: "13", name: "음악 작곡", category: "창작", description: "멜로디와 화음을 만들어내는 활동" },
          { id: "14", name: "등산", category: "운동", description: "자연 속에서 즐기는 신체 활동" },
          { id: "15", name: "동아리 활동", category: "사회활동", description: "관심사를 공유하는 모임 활동" },
          { id: "16", name: "데이터 분석", category: "기술", description: "데이터를 수집하고 분석하는 활동" },
          { id: "17", name: "마케팅 기획", category: "비즈니스", description: "마케팅 전략 수립과 실행" },
          { id: "18", name: "영화 감상", category: "예술", description: "영화를 보고 감상하는 활동" },
          { id: "19", name: "여행", category: "취미", description: "국내외 여행과 탐험" },
          { id: "20", name: "팟캐스트 제작", category: "창작", description: "음성 콘텐츠를 기획하고 제작하는 활동" },
          { id: "21", name: "헬스/웨이트", category: "운동", description: "근력 운동과 체력 단련" },
          { id: "22", name: "외국어 학습", category: "학습", description: "새로운 언어를 배우고 익히는 활동" },
          { id: "23", name: "그림 그리기", category: "창작", description: "시각적 예술 작품을 창작하는 활동" },
          { id: "24", name: "축구", category: "운동", description: "팀 스포츠로 즐기는 구기 운동" },
          { id: "25", name: "네트워킹 이벤트 참가", category: "사회활동", description: "인맥을 넓히는 사교 활동" },
        ])
      } finally {
        setIsFetchingActivities(false)
      }

      // Load existing ratings from API if available
      if (sessionId) {
        try {
          const response = await fetch(`/api/ratings?sessionId=${sessionId}`)
          const data = await response.json()

          if (data.ratings && data.ratings.length > 0) {
            // Restore ratings from database
            data.ratings.forEach((rating: any) => {
              setRating(rating.activity_id, rating.score)
            })
          }
        } catch (error) {
          console.error('Failed to load existing ratings:', error)
        }
      }
    }

    init()
  }, [sessionId, initSession, setRating])

  // Save rating to database
  const saveRatingToDatabase = useCallback(async (activityId: string, score: number) => {
    if (!sessionId) return

    // setIsSaving(true) - UI feedback removed
    try {
      await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityId,
          score,
          sessionId,
        }),
      })
    } catch (error) {
      console.error('Failed to save rating:', error)
    } finally {
      // setIsSaving(false) - UI feedback removed
    }
  }, [sessionId])

  const handleRate = useCallback(async (score: number) => {
    const activity = activities[currentIndex]
    if (!activity) return

    // Update local state
    setRating(activity.id, score)

    // Save to database
    await saveRatingToDatabase(activity.id, score)

    // Move to next card with shorter delay
    if (currentIndex < activities.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1)
      }, 150)
    }
  }, [activities, currentIndex, setRating, saveRatingToDatabase])

  const handleStatusChange = useCallback(async (status: 'not_tried' | 'want_to_try' | null) => {
    const activity = activities[currentIndex]
    if (!activity) return

    // Update local state
    setActivityStatus(activity.id, status)

    // Save to database if status is set
    if (status) {
      await saveRatingToDatabase(activity.id, status === 'not_tried' ? -1 : -2)
    }

    // Move to next card if status is set (not null)
    if (status && currentIndex < activities.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1)
      }, 150)
    }
  }, [activities, currentIndex, setActivityStatus, saveRatingToDatabase])

  const handleNext = useCallback(() => {
    if (currentIndex < activities.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }, [currentIndex, activities.length])

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }, [currentIndex])

  const handleSkip = () => {
    handleNext()
  }

  const handleAnalyze = async () => {
    if (!canAnalyze()) return

    setIsAnalyzing(true)
    setIsLoading(true)

    try {
      // Call analysis API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
        }),
      })

      const data = await response.json()

      if (data.id) {
        // Navigate to results page
        router.push(`/results/${data.id}`)
      } else {
        // Fallback to sample results
        router.push('/results/sample')
      }
    } catch (error) {
      console.error('Failed to analyze:', error)
      // Fallback to sample results
      router.push('/results/sample')
    }
  }

  const currentActivity = activities[currentIndex]
  const hasRated = currentActivity && ratings.has(currentActivity.id)
  const currentRating = hasRated ? ratings.get(currentActivity.id) : undefined
  const currentStatus = currentActivity ? activityStatuses.get(currentActivity.id) : undefined

  if (isFetchingActivities) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Loading size="lg" text="활동 목록을 불러오는 중..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                처음으로
              </Button>
            </Link>

            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">활동 평가</h1>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              disabled={currentIndex >= activities.length - 1}
            >
              건너뛰기
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 py-6">
        <ProgressBar
          value={ratedCount}
          max={100}
          showLabel={true}
          animated={true}
        />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20">
        <div className="max-w-lg mx-auto touch-none">
          <AnimatePresence mode="wait">
            {currentActivity && (
              <ActivityCard
                key={currentActivity.id}
                activity={currentActivity}
                onRate={handleRate}
                onStatusChange={handleStatusChange}
                onNext={handleNext}
                onPrevious={handlePrevious}
                currentRating={currentRating}
                currentStatus={currentStatus}
                index={currentIndex}
                total={activities.length}
              />
            )}
          </AnimatePresence>

          {/* Navigation hints */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 space-y-2"
          >
            <p className="text-center text-sm text-gray-500">
              좌우로 드래그하여 카드 넘기기
            </p>
            <p className="text-center text-xs text-gray-400">
              키보드: 1-5 (점수), 0 (안 할거에요), ← → (이동), Space (건너뛰기)
            </p>
          </motion.div>
        </div>
      </main>

      {/* Fixed Bottom CTA */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4"
      >
        <div className="container mx-auto max-w-lg">
          {ratedCount < 20 ? (
            <div>
              <Button
                size="lg"
                className="w-full gap-2 opacity-50 cursor-not-allowed"
                disabled={true}
              >
                <Sparkles className="w-5 h-5" />
                {20 - ratedCount}개만 더 평가하면 결과를 볼 수 있어요!
              </Button>
              <p className="text-xs text-center text-gray-500 mt-2">
                최소 20개 이상 평가가 필요합니다
              </p>
            </div>
          ) : (
            <div>
              <Button
                size="lg"
                className="w-full gap-2"
                onClick={handleAnalyze}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loading size="sm" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    분석 결과 보기 ({ratedCount}개 평가 완료)
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-green-600 mt-2">
                더 평가하면 더 정확한 결과를 볼 수 있어요!
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div className="text-center">
            <Loading size="lg" text="AI가 당신의 흥미와 강점을 분석하고 있어요..." />
          </div>
        </motion.div>
      )}
    </div>
  )
}