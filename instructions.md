# 🚀 Project Specific Instructions: [GN2Studio]

## 1. Project Overview (목적 및 방향성)
GN2Studio는 소프트웨어 개발 및 MerryTokTok이라는 작가 커뮤니티  및 웹소설 연재 서비스를 운영하는 회사의 홈페이지야.

- **프로젝트 목적:** [회사의 포트폴리오 및 외주제작의뢰 접수, 사업제안 접수 등]
- **핵심 기능:** [포트폴리오 관리 및 제작의뢰 관리]
- **디자인 방향성:** - **Concept:** [미래지향적인 디자인]
  - **Main Color:** [신뢰감을 주는 파란색 계열)]
  - **Vibe:** [신뢰감이 느껴지는 정갈한 UI, 애니메이션이 풍부한 인터랙티브한 경험]

## 2. Authentication: OAuth 2.0 Strategy
이 프로젝트는 OAuth 2.0 방식을 사용하며, 모든 설정값은 `.env` 파일을 참조합니다.

### [.env Required Configuration]
AI는 코드를 작성할 때 아래 변수들이 정의되어 있다고 가정하고 `.env`를 통해 접근합니다.
- `VUE_APP_IDENTITY_BASE_URL`: Identity Server의 베이스 주소
- `VUE_APP_IDENTITY_CLIENTID`: 클라이언트 아이디
- `VUE_APP_IDENTITY_REDIRECT_URI`: 로그인 후 리다이렉트될 주소 (보통 /callback)
- `VUE_APP_IDENTITY_SCOPE`: 접근 권한 범위 (openid profile email 등)
- `VUE_APP_IDENTITY_TYPE`: 응답 타입 (code 등)
- `VUE_APP_IDENTITY_CLIENTSECRET`: 클라이언트 시크릿, 상황에 따라 필요할 수도 있음.
- `VUE_APP_IDENTITY_COOKIE`: 쿠키를 사용할 때, 쿠키 이름
- `VUE_APP_SITE_TITLE`: 프로젝트의 Title 태그에 넣을 내용
- `VUE_APP_SERVICE_URL`: 프로젝트의 기본 URL
- `VITE_API_BASE_URL`: 보호된 API 베이스 URL

### [Auth Implementation Logic]
- **AuthService.js:** OAuth 로그인/로그아웃 로직을 담당하는 클래스를 생성합니다.
- **Token Management:** 발급된 Access Token은 Pinia 스토어와 LocalStorage에 안전하게 보관하며, Axios Interceptor를 통해 모든 요청 Header에 `Authorization: Bearer {token}`을 자동으로 첨부합니다.
- **Login Flow:** 로그인 버튼 클릭 시 Identity Server로 리다이렉트시키고, 콜백 페이지에서 토큰을 수신하여 처리를 완료합니다.

## 3. API & Data Mocking (Project Specific)
글로벌 규칙에 따라, 실제 API 연결 전까지는 다음 구조의 Mock 서비스를 유지합니다.

- **Class Name:** `[FeatureName]Service.ts` (예: `InventoryService`, `UserService`)
- **Mocking Goal:** - Swagger 엔드포인트가 나오기 전까지는 `Promise`와 `setTimeout`을 이용해 실제 통신처럼 동작하게 함.
  - 응답 데이터 형식은 위에 정의한 **'프로젝트 목적'**에 맞는 비즈니스 데이터를 반환할 것.

## 4. Append Component Library & Style Guide
- **i18n:** 다국어 작업을 처리합니다.  기본적으로 한국어를 사용하고, 한국어/영어/일본어/중국어 등 4개국어를 정의합니다.

---
**Command:** 위 프로젝트 명세와 인증 방식을 완벽히 숙지하여 지금부터 작성하는 모든 기능은 이 프로젝트의 목적과 디자인 가이드라인을 엄격히 따릅니다.