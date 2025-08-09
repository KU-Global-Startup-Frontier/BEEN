# Technical Specification

## 1. 시스템 아키텍처

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Client    │────▶│  Next.js API │────▶│  Supabase   │
│  (Browser)  │◀────│   Routes     │◀────│  Database   │
└─────────────┘     └──────────────┘     └─────────────┘
                            │                     │
                            ▼                     ▼
                    ┌──────────────┐     ┌─────────────┐
                    │ Edge Function│     │   Storage   │
                    │  (Analysis)  │     │   (Images)  │
                    └──────────────┘     └─────────────┘
```

## 2. 데이터베이스 스키마

### 2.1 activities 테이블
```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  icon_url VARCHAR(255),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2.2 users 테이블 (Supabase Auth 확장)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  nickname VARCHAR(50),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2.3 ratings 테이블
```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(100), -- 게스트용
  activity_id UUID REFERENCES activities(id),
  score INTEGER CHECK (score >= -1 AND score <= 5), -- -1: 안해봤어요
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, activity_id),
  UNIQUE(session_id, activity_id)
);
```

### 2.4 analysis_results 테이블
```sql
CREATE TABLE analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(100),
  summary_json JSONB NOT NULL,
  image_url VARCHAR(255),
  share_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 3. API 엔드포인트

### 3.1 활동 카드 관련

#### GET /api/activities
```typescript
interface GetActivitiesResponse {
  activities: Activity[];
  total: number;
  hasMore: boolean;
}
```

#### POST /api/ratings
```typescript
interface RateActivityRequest {
  activityId: string;
  score: number; // -1 ~ 5
  sessionId?: string;
}
```

### 3.2 분석 관련

#### POST /api/analyze
```typescript
interface AnalyzeRequest {
  sessionId?: string;
  userId?: string;
}

interface AnalyzeResponse {
  id: string;
  insights: {
    categories: Array<{
      name: string;
      score: number;
    }>;
    keywords: string[];
    strengths: string[];
    recommendations: Activity[];
  };
  chartData: any;
}
```

### 3.3 결과 저장/공유

#### POST /api/results/save-image
```typescript
interface SaveImageRequest {
  resultId: string;
  imageDataUrl: string;
}
```

#### POST /api/results/share
```typescript
interface ShareRequest {
  resultId: string;
  platform: 'kakao' | 'instagram' | 'link';
}
```

## 4. Edge Functions

### 4.1 analyze-ratings
```typescript
// supabase/functions/analyze-ratings/index.ts
export async function analyzeRatings(ratings: Rating[]): Promise<AnalysisResult> {
  // 1. 카테고리별 점수 집계
  // 2. 강점 키워드 추출
  // 3. 유사 활동 추천
  // 4. 시각화 데이터 생성
}
```

## 5. 프론트엔드 구조

```
app/
├── (marketing)/
│   └── page.tsx           # 랜딩 페이지
├── evaluate/
│   ├── page.tsx          # 평가 페이지
│   └── components/
│       ├── ActivityCard.tsx
│       ├── ProgressBar.tsx
│       └── RatingButtons.tsx
├── results/
│   ├── [id]/
│   │   └── page.tsx      # 결과 페이지
│   └── components/
│       ├── RadarChart.tsx
│       ├── WordCloud.tsx
│       └── ShareDialog.tsx
├── api/
│   ├── activities/
│   ├── ratings/
│   └── analyze/
└── layout.tsx
```

## 6. 상태 관리 (Zustand)

```typescript
interface AppState {
  // 사용자 상태
  user: User | null;
  sessionId: string;
  
  // 평가 상태
  ratings: Map<string, number>;
  ratedCount: number;
  
  // 결과 상태
  analysisResult: AnalysisResult | null;
  
  // Actions
  setRating: (activityId: string, score: number) => void;
  analyze: () => Promise<void>;
  reset: () => void;
}
```

## 7. 성능 최적화

### 7.1 목표 지표
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1
- API Response Time: < 300ms (P95)

### 7.2 최적화 전략
- 이미지 최적화: Next.js Image 컴포넌트
- 코드 스플리팅: Dynamic imports
- 캐싱: SWR 또는 React Query
- 무한 스크롤: Intersection Observer
- 데이터베이스: 인덱싱, 쿼리 최적화

## 8. 보안 고려사항

- Rate Limiting: IP당 분당 60 요청
- CORS 설정: 허용된 도메인만
- Input Validation: Zod 스키마
- SQL Injection 방지: Prepared statements
- XSS 방지: React 자동 이스케이핑

## 9. 모니터링 & 로깅

- Vercel Analytics: 페이지 성능
- Supabase Dashboard: DB 쿼리 성능
- Sentry: 에러 트래킹
- Custom Events: 사용자 행동 분석