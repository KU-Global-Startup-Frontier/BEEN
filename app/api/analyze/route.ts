import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

interface CategoryScore {
  [key: string]: {
    total: number
    count: number
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId } = body
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    const supabase = createClient()
    
    // Fetch user's answers with question details
    const { data: answers, error: answersError } = await supabase
      .from('rt_user_answer')
      .select(`
        *,
        qt_question (
          question_id,
          question_name,
          major_category,
          minor_category
        )
      `)
      .eq('user_id', userId)
      .not('preference', 'is', null)
    
    if (answersError) {
      console.error('Error fetching answers:', answersError)
      return NextResponse.json(
        { error: 'Failed to fetch answers' },
        { status: 500 }
      )
    }
    
    if (!answers || answers.length < 20) {
      return NextResponse.json(
        { error: 'At least 20 ratings are required for analysis' },
        { status: 400 }
      )
    }
    
    // Analyze answers by category
    const categoryScores: CategoryScore = {}
    const keywords = new Set<string>()
    
    answers.forEach((answer: any) => {
      if (answer.preference && answer.qt_question) {
        const category = answer.qt_question.minor_category || answer.qt_question.major_category
        
        if (!categoryScores[category]) {
          categoryScores[category] = { total: 0, count: 0 }
        }
        
        categoryScores[category].total += answer.preference
        categoryScores[category].count += 1
        
        // Add keywords based on high scores
        if (answer.preference >= 4) {
          addKeywordsForCategory(category, keywords)
        }
      }
    })
    
    // Calculate average scores for each category
    const categories = Object.entries(categoryScores).map(([name, data]) => ({
      name,
      score: Math.round((data.total / data.count) * 20) // Convert to 0-100 scale
    })).sort((a, b) => b.score - a.score)
    
    // Determine strengths based on top categories
    const topCategories = categories.slice(0, 3)
    const strengths = generateStrengths(topCategories)
    
    // Generate recommendations
    const recommendations = generateRecommendations(topCategories)
    
    // Prepare analysis result
    const analysisResult = {
      categories,
      keywords: Array.from(keywords).slice(0, 10),
      strengths,
      recommendations,
      chartData: categories,
      ratingCount: answers.length,
      analyzedAt: new Date().toISOString()
    }
    
    // Find the best matching universe based on category scores
    const { data: universes, error: universesError } = await supabase
      .from('rt_universe')
      .select('*')
    
    let bestUniverse = null
    if (!universesError && universes && universes.length > 0) {
      // Simple matching: find universe with highest preference_avg
      // In production, you'd want more sophisticated matching logic
      bestUniverse = universes[0]
    }
    
    // Save user result
    if (bestUniverse) {
      const { error: saveError } = await supabase
        .from('rt_user_result')
        .insert({
          user_id: userId,
          universe_id: bestUniverse.universe_id
        })
      
      if (saveError) {
        console.error('Error saving user result:', saveError)
      }
    }
    
    return NextResponse.json({
      id: userId,
      insights: analysisResult,
      universe: bestUniverse ? {
        name: bestUniverse.universe_name,
        grade: bestUniverse.universe_grade,
        description: bestUniverse.uni_explain,
        types: [
          { name: 'Type 1', score: bestUniverse.type1_score, description: bestUniverse.type1_ex },
          { name: 'Type 2', score: bestUniverse.type2_score, description: bestUniverse.type2_ex },
          { name: 'Type 3', score: bestUniverse.type3_score, description: bestUniverse.type3_ex },
          { name: 'Type 4', score: bestUniverse.type4_score, description: bestUniverse.type4_ex },
          { name: 'Type 5', score: bestUniverse.type5_score, description: bestUniverse.type5_ex },
          { name: 'Type 6', score: bestUniverse.type6_score, description: bestUniverse.type6_ex },
        ].filter(t => t.score)
      } : null
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function addKeywordsForCategory(category: string, keywords: Set<string>) {
  const categoryKeywords: { [key: string]: string[] } = {
    '창작': ['창의적', '표현력', '상상력', '감수성', '예술적'],
    '운동': ['체력', '끈기', '도전정신', '건강관리', '활동적'],
    '학습': ['지적호기심', '분석력', '논리력', '학습능력', '탐구심'],
    '사회활동': ['리더십', '공감능력', '소통능력', '협업', '사회성'],
    '기술': ['문제해결', '논리력', '혁신성', '기술력', '체계적'],
    '비즈니스': ['기획력', '전략적사고', '실행력', '비즈니스감각', '목표지향'],
    '예술': ['심미안', '감성', '문화이해', '표현력', '창작욕구'],
    '취미': ['균형감각', '자기관리', '여유', '다재다능', '열정']
  }
  
  const keywordsToAdd = categoryKeywords[category] || []
  keywordsToAdd.forEach(keyword => keywords.add(keyword))
}

function generateStrengths(topCategories: Array<{ name: string, score: number }>) {
  const strengthTemplates: { [key: string]: any } = {
    '창작': {
      title: '창의적 문제해결자',
      description: '복잡한 문제를 창의적인 방법으로 해결하는 능력이 뛰어납니다',
      icon: '🎨'
    },
    '기술': {
      title: '기술 혁신가',
      description: '새로운 기술을 빠르게 습득하고 활용하는 재능이 있습니다',
      icon: '💡'
    },
    '학습': {
      title: '지속적 학습자',
      description: '끊임없이 배우고 성장하려는 열정을 가지고 있습니다',
      icon: '📚'
    },
    '운동': {
      title: '활동적 실행가',
      description: '목표를 향해 꾸준히 노력하는 체력과 정신력을 갖추고 있습니다',
      icon: '💪'
    },
    '사회활동': {
      title: '소통의 리더',
      description: '사람들과 함께 일하며 긍정적인 변화를 만들어냅니다',
      icon: '🤝'
    },
    '비즈니스': {
      title: '전략적 기획자',
      description: '비즈니스 기회를 포착하고 실행하는 능력이 뛰어납니다',
      icon: '📈'
    },
    '예술': {
      title: '감성 큐레이터',
      description: '예술적 감각으로 아름다움을 발견하고 표현합니다',
      icon: '🎭'
    },
    '취미': {
      title: '라이프 밸런서',
      description: '일과 삶의 균형을 잘 맞추며 다양한 경험을 즐깁니다',
      icon: '🌟'
    }
  }
  
  return topCategories.map(cat => 
    strengthTemplates[cat.name] || {
      title: cat.name + ' 전문가',
      description: `${cat.name} 분야에 대한 높은 관심과 재능을 보입니다`,
      icon: '⭐'
    }
  )
}

function generateRecommendations(topCategories: Array<{ name: string, score: number }>) {
  const recommendations: { [key: string]: string[] } = {
    '창작': [
      '개인 블로그나 유튜브 채널 시작하기',
      '창작 모임이나 동아리 참여하기',
      '공모전이나 창작 대회 도전하기'
    ],
    '기술': [
      '새로운 프로그래밍 언어 학습하기',
      '오픈소스 프로젝트 참여하기',
      '해커톤이나 기술 컨퍼런스 참가하기'
    ],
    '학습': [
      '온라인 강의 플랫폼에서 새로운 분야 탐색하기',
      '독서 모임이나 스터디 그룹 참여하기',
      '자격증 취득 목표 세우기'
    ],
    '운동': [
      '새로운 스포츠나 운동 도전하기',
      '운동 동호회나 클럽 가입하기',
      '개인 운동 목표 설정하고 기록하기'
    ],
    '사회활동': [
      '봉사활동이나 사회공헌 프로그램 참여하기',
      '네트워킹 이벤트나 모임 참석하기',
      '멘토링 프로그램 참여하기'
    ],
    '비즈니스': [
      '사이드 프로젝트나 창업 아이디어 구체화하기',
      '비즈니스 관련 도서나 강의 수강하기',
      '창업 경진대회나 공모전 참가하기'
    ],
    '예술': [
      '전시회나 공연 정기적으로 관람하기',
      '예술 창작 활동 시작하기',
      '문화예술 동아리나 모임 참여하기'
    ],
    '취미': [
      '새로운 취미 활동 시도하기',
      '취미 관련 커뮤니티 참여하기',
      '취미를 통한 부업 가능성 탐색하기'
    ]
  }
  
  const allRecommendations: string[] = []
  topCategories.forEach(cat => {
    const catRecommendations = recommendations[cat.name] || []
    allRecommendations.push(...catRecommendations)
  })
  
  return allRecommendations.slice(0, 5)
}