# BEEN - 활동 평가 및 강점 분석 플랫폼

## 프로젝트 소개
BEEN은 사용자가 다양한 활동들을 평가하고, AI 기반 분석을 통해 개인의 강점과 관심사를 파악할 수 있는 웹 애플리케이션입니다.

## 주요 기능
- 랜덤 질문 로딩: `question_raw` 테이블에서 질문을 랜덤하게 불러와 표시
- 진행 상태 보존: 세션 ID 기반으로 중도 이탈 후에도 평가 진행 상태 유지
- 활동 평가: 1-5점 척도 또는 "안 할거에요/해보고 싶어요" 선택
- AI 기반 분석: 평가 결과를 바탕으로 강점과 관심사 분석
- 결과 공유: 분석 결과를 이미지로 저장하고 공유

## 기술 스택
- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **State Management**: Zustand
- **Animation**: Framer Motion
- **Database**: PostgreSQL (Supabase)

## 시작하기

### 환경 설정
1. 환경 변수 설정 (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. 의존성 설치
```bash
pnpm install
```

3. 개발 서버 실행
```bash
pnpm run dev
```

4. 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 데이터베이스 구조

### question_raw 테이블
- 활동/질문 데이터를 저장하는 테이블
- 랜덤 정렬로 사용자에게 다양한 순서로 질문 제공

### ratings 테이블
- 사용자의 평가 데이터 저장
- session_id 또는 user_id로 연결
- score: -2(해보고 싶어요), -1(안 할거에요), 1-5(점수)

### analysis_results 테이블
- AI 분석 결과 저장
- JSON 형태로 분석 데이터 저장

## 주요 로직

### 랜덤 질문 로딩
- 페이지 로드 시 `qt_question` 테이블에서 질문을 랜덤하게 가져옴
- Fisher-Yates 알고리즘을 사용해 서버 사이드에서 셔플
- 이미 평가한 질문 제외 옵션 지원

### 진행 상태 보존
- sessionId를 통해 사용자 식별
- 평가한 내용은 실시간으로 데이터베이스에 저장
- 재접속 시 이전 평가 내용 자동 복원

### 새 평가 시작
- 모든 질문 평가 완료 시 "새로운 질문 받기" 버튼 표시
- 클릭 시 새로운 랜덤 순서로 질문 재배치

## 배포
Vercel을 통한 배포 권장
```bash
vercel deploy
```

## 라이선스
MIT

## 기여
Pull Request와 Issue를 환영합니다.
