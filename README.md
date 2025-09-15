# 챗봇 관리 시스템

Vite, React, TypeScript, Tailwind CSS를 사용한 챗봇 서비스 및 관리 대시보드 플랫폼입니다.

## 주요 기능

### 1. 챗 에이전트 관리
- 챗봇 에이전트 생성, 수정, 삭제
- 에이전트 상태 모니터링 (활성/비활성/오류)
- 실시간 채팅 인터페이스
- 대화 사이클 관리

### 2. 문서 관리
- FAQ 및 가이드 문서 업로드
- 문서 타입별 분류 (FAQ, 가이드)
- 문서 검색 및 필터링
- 문서 다운로드 기능

### 3. 모델 관리
- 임베딩 모델 관리
- 어댑터 설정
- 파인튜닝 기능
- 벡터 DB 저장
- 문서 청킹

### 4. 사용자 관리
- 사용자 생성, 수정, 삭제
- 권한 관리 (관리자, 매니저, 사용자)
- 사용자 검색 및 필터링

### 5. MCP 서버 관리
- MCP 서버 등록 및 관리
- 서버 상태 모니터링
- 도구(Tools) 목록 조회
- 서버 활성화/비활성화

### 6. 통계 및 분석
- 챗 에이전트 사용량 통계
- 문서 사용량 분석
- MCP 서버 호출량 통계
- 실시간 대시보드

### 7. 임베드 테스트
- 외부 사이트에서 챗봇 미리보기
- 실시간 iframe 테스트
- 반응형 디자인 확인
- iframe 코드 자동 생성 및 복사

## 기술 스택

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4 (Vite 플러그인 방식)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: React Hooks

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
```bash
cp env.example .env
```

`.env` 파일에서 API 서버 URL을 설정하세요:
```
VITE_API_BASE_URL=http://localhost:8080
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 빌드
```bash
npm run build
```

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   └── Layout.tsx      # 메인 레이아웃
├── pages/              # 페이지 컴포넌트
│   ├── Dashboard.tsx   # 대시보드
│   ├── ChatAgents.tsx  # 챗 에이전트 관리
│   ├── Documents.tsx   # 문서 관리
│   ├── Models.tsx      # 모델 관리
│   ├── Users.tsx       # 사용자 관리
│   ├── MCPServers.tsx  # MCP 서버 관리
│   ├── Statistics.tsx  # 통계
│   ├── ChatInterface.tsx # 채팅 인터페이스
│   ├── ChatEmbed.tsx   # 임베드용 챗봇
│   ├── ServiceSelection.tsx # 서비스 선택
│   └── EmbedTest.tsx   # 임베드 테스트
├── services/           # API 서비스
│   └── api.ts         # API 클라이언트
├── types/             # TypeScript 타입 정의
│   └── index.ts       # 공통 타입
├── App.tsx            # 메인 앱 컴포넌트
├── main.tsx           # 앱 진입점
└── index.css          # 글로벌 스타일
```

## API 연동

이 프로젝트는 백엔드 API와 연동되도록 설계되었습니다. 주요 API 엔드포인트:

- **챗 에이전트**: `/be/v1/chatagents/*`
- **문서 관리**: `/be/v1/docs/*`
- **모델 관리**: `/be/v1/models/*`
- **사용자 관리**: `/be/v1/members/*`
- **MCP 서버**: `/be/v1/mcps/*`
- **통계**: `/be/v1/statistics/*`

## 로그인

기본 테스트 계정:
- 사용자명: `admin`
- 비밀번호: `admin`

## 주요 컴포넌트

### Layout
- 사이드바 네비게이션
- 반응형 디자인
- 로그아웃 기능

### Dashboard
- 시스템 현황 대시보드
- 실시간 통계 카드
- 최근 활동 목록
- 시스템 상태 모니터링

### ChatAgents
- 챗 에이전트 목록
- 에이전트 생성/수정/삭제
- 상태 토글 기능
- 채팅 인터페이스 연결

### ChatInterface
- 실시간 채팅 UI
- 메시지 전송/수신
- 로딩 상태 표시
- 연결 상태 모니터링

### EmbedTest
- 외부 사이트에서 챗봇 미리보기
- 서비스별 챗봇 테스트
- iframe 코드 자동 생성
- 반응형 디자인 테스트
- 원클릭 코드 복사 기능

## 스타일링

Tailwind CSS v4를 Vite 플러그인 방식으로 사용하여 일관된 디자인 시스템을 구축했습니다:

- **설정 간소화**: `tailwind.config.js` 파일 없이 사용
- **컬러 팔레트**: Primary, Gray 계열
- **컴포넌트**: 버튼, 카드, 입력 필드 등
- **반응형**: 모바일, 태블릿, 데스크톱 지원
- **다크모드**: 준비됨 (추후 구현 가능)

## 임베드 기능 사용법

### 1. 임베드 테스트 페이지 접속
- 관리자 대시보드 → "임베드 테스트" 메뉴 클릭
- 또는 직접 `/admin/embed-test` 경로로 접속

### 2. 서비스 선택 및 테스트
- 테스트하고 싶은 챗봇 서비스 선택
- 실시간 미리보기에서 챗봇 동작 확인
- 반응형 테스트로 다양한 화면 크기 확인

### 3. iframe 코드 생성 및 복사
- 자동 생성된 iframe 코드 확인
- "복사" 버튼으로 클립보드에 복사
- 외부 웹사이트에 붙여넣기

### 4. 외부 사이트에 임베드
```html
<iframe 
    src="http://localhost:5173/embed/chat/service1" 
    width="100%" 
    height="600px" 
    frameborder="0"
    title="챗봇"
></iframe>
```

## 개발 가이드

### 새로운 페이지 추가
1. `src/pages/` 디렉토리에 새 페이지 컴포넌트 생성
2. `src/App.tsx`에 라우트 추가
3. `src/components/Layout.tsx`에 네비게이션 메뉴 추가

### API 서비스 추가
1. `src/services/api.ts`에 새 API 함수 추가
2. 필요한 타입을 `src/types/index.ts`에 정의
3. 컴포넌트에서 API 호출

### 스타일 커스터마이징
1. `tailwind.config.js`에서 테마 수정
2. `src/index.css`에서 글로벌 스타일 추가
3. 컴포넌트별 Tailwind 클래스 사용

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
