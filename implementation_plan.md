# 부산 축제 정보 플랫폼 "축제해 부산" (Fest Busan) 개발 계획

작성된 제품 요구사항 정의서(PRD)를 바탕으로, Next.js(App Router) 및 Tailwind CSS를 사용하여 Vercel 배포에 최적화된 부산 축제 정보 웹사이트를 구축하는 프로젝트 계획입니다.

## User Review Required

> [!IMPORTANT]
> **지도 구현 관련 의사결정**:
> 별도의 API 키 발급 절차 없이 즉시 동작하고 경량화된 오픈소스 지도 라이브러리인 **Leaflet.js**를 사용하여 지도 기능을 구현할 예정입니다. 만약 네이버 지도나 카카오 지도를 꼭 원하시는 경우, 개발자 센터 키 발급이 필요하므로 이를 고려하여 Leaflet을 기본으로 제안합니다.

> [!NOTE]
> **디자인 및 색상 테마**:
> 부산의 바다와 야경을 연상시키는 **Deep Ocean Blue (깊은 청색)**와 **Neon Teal/Cyan (네온 청록색)**을 주조색으로 설정하고, 트렌디한 **글래스모피즘(Glassmorphism)** 효과 및 다크 모드를 지원하여 시각적으로 매우 매력적이고 세련된 사용자 경험을 선사합니다.

## Open Questions

*   **API 호출 방식**: 
    매 요청마다 공공데이터포털 API를 실시간 호출(SSR)할지, 혹은 일정 주기(예: 하루 1회)로 데이터를 빌드 시점에 가져와 정적 페이지로 빌드하고 주기적으로 갱신(ISR - Incremental Static Regeneration)할지 결정이 필요합니다. 공공 API의 장애율과 속도를 고려할 때 **ISR(재검증 시간: 24시간)** 방식이 안정성과 로딩 속도면에서 가장 우수하므로 이를 추천합니다.

## Proposed Changes

### 1. 프로젝트 초기화 및 환경 구성

#### [NEW] [package.json](file:///c:/Users/user/Desktop/busan_fest/package.json)
*   Next.js 최신 버전 설치 및 Tailwind CSS 연동.
*   의존성 추가: `lucide-react` (아이콘용), `react-leaflet`, `leaflet` (지도용).

---

### 2. 코어 아키텍처 및 API 레이어

#### [NEW] [api.ts](file:///c:/Users/user/Desktop/busan_fest/src/lib/api.ts)
*   공공데이터포털 API 호출 함수 작성.
*   API 응답 데이터 정제 (불필요한 텍스트 제거, 누락된 값 기본값 처리 등).

#### [NEW] [types.ts](file:///c:/Users/user/Desktop/busan_fest/src/types/index.ts)
*   축제 데이터 타입 정의 (`Festival` 인터페이스).

---

### 3. 레이아웃 및 디자인 시스템

#### [NEW] [layout.tsx](file:///c:/Users/user/Desktop/busan_fest/src/app/layout.tsx)
*   Google Fonts (Outfit 및 Noto Sans KR) 연동.
*   SEO 친화적인 Meta 태그, OpenGraph 태그 기본 적용.
*   전체 레이아웃 (반응형 내비게이션 바, 푸터) 구현.

#### [NEW] [globals.css](file:///c:/Users/user/Desktop/busan_fest/src/app/globals.css)
*   글래스모피즘 스타일 클래스, 스크롤바 커스텀 및 테마 컬러 변수 정의.

---

### 4. 주요 컴포넌트 개발

#### [NEW] [FestivalCard.tsx](file:///c:/Users/user/Desktop/busan_fest/src/components/FestivalCard.tsx)
*   축제 정보를 그리드 형태로 노출하는 카드 컴포넌트.
*   이미지 최적화 (`next/image`), 호버 스케일 업 애니메이션, 찜하기(북마크) 상태 연동.

#### [NEW] [FilterBar.tsx](file:///c:/Users/user/Desktop/busan_fest/src/components/FilterBar.tsx)
*   구군별 필터, 월별 필터, 키워드 검색바를 포함한 필터 제어 영역.

#### [NEW] [FestivalMap.tsx](file:///c:/Users/user/Desktop/busan_fest/src/components/FestivalMap.tsx)
*   Leaflet 지도 위에 축제들의 위도/경도를 마커로 매핑하고 클러스터링 기능 및 마커 클릭 시 간이 카드 표출.

---

### 5. 페이지 조립

#### [NEW] [page.tsx](file:///c:/Users/user/Desktop/busan_fest/src/app/page.tsx)
*   메인 뷰 (대시보드): 히어로 배너, 검색/필터 바, 축제 카드 그리드 배치.
*   클라이언트/서버 컴포넌트 분리를 통해 초기 로딩 성능 최적화.

#### [NEW] [[id]/page.tsx](file:///c:/Users/user/Desktop/busan_fest/src/app/festival/[id]/page.tsx)
*   축제 상세 페이지: 설명글, 교통 정보, 길찾기 링크, 지도 연동, 무장애 편의시설 목록 시각화.

---

## Verification Plan

### Automated Tests
*   `npm run build`를 통한 빌드 무오류 검증.
*   `npm run lint`를 활용한 정적 분석 검증.

### Manual Verification
*   **반응형 레이아웃 확인**: 모바일(아이폰/갤럭시), 태블릿, 데스크톱 해상도 대응 여부 확인.
*   **기능 동작 확인**:
    1. 검색창에 키워드(예: '불꽃') 입력 시 실시간 필터링 여부.
    2. 구군 필터(예: '해운대구') 클릭 시 관련 축제만 노출되는지 확인.
    3. 축제 카드 내 하트 클릭 후 '저장된 축제' 필터 작동 및 새로고침 후 유지 여부 (LocalStorage).
    4. 지도 상에 마커가 정상적으로 렌더링되고 마커 클릭 시 해당 축제 상세 정보로 진입하는지 확인.
