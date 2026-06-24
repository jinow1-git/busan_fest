"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Search, MapPin, Sparkles, Heart } from "lucide-react";
import { Festival } from "@/types";
import Header from "./Header";
import Footer from "./Footer";
import FilterBar from "./FilterBar";
import FestivalCard from "./FestivalCard";

// Leaflet 지도는 클라이언트 사이드에서만 로드하도록 dynamic import 처리 (SSR 회피)
const FestivalMap = dynamic(() => import("./FestivalMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[650px] w-full rounded-2xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center justify-center text-slate-400">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-neon-blue border-t-transparent"></div>
      <p className="mt-4 text-sm font-semibold">지도를 로딩하고 있습니다...</p>
    </div>
  ),
});

interface FestivalDashboardProps {
  festivals: Festival[];
}

export default function FestivalDashboard({ festivals }: FestivalDashboardProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  
  // 필터 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [barrierFreeOnly, setBarrierFreeOnly] = useState(false);

  // 로컬 스토리지에서 북마크 불러오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("busan-festival-bookmarks");
      if (stored) {
        try {
          setBookmarks(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse bookmarks", e);
        }
      }
    }
  }, []);

  // 북마크 토글 함수
  const handleToggleBookmark = (id: number) => {
    const nextBookmarks = bookmarks.includes(id)
      ? bookmarks.filter((bId) => bId !== id)
      : [...bookmarks, id];
    
    setBookmarks(nextBookmarks);
    localStorage.setItem("busan-festival-bookmarks", JSON.stringify(nextBookmarks));
  };

  // 고유 지역구 목록 추출
  const districts = Array.from(
    new Set(festivals.map((f) => f.GUGUN_NM).filter(Boolean))
  ).sort();

  // 필터링 적용된 축제 목록
  const filteredFestivals = festivals.filter((fest) => {
    // 검색어 필터
    const matchesSearch =
      searchQuery === "" ||
      fest.MAIN_TITLE.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fest.TITLE && fest.TITLE.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (fest.ITEMCNTNTS && fest.ITEMCNTNTS.toLowerCase().includes(searchQuery.toLowerCase()));

    // 지역구 필터
    const matchesDistrict = selectedDistrict === "" || fest.GUGUN_NM === selectedDistrict;

    // 월별 일정 필터
    let matchesMonth = true;
    if (selectedMonth !== null) {
      const dateStr = (fest.USAGE_DAY_WEEK_AND_TIME || "") + " " + (fest.USAGE_DAY || "");
      const monthStr = `${selectedMonth}`;
      const monthStrZero = selectedMonth < 10 ? `0${selectedMonth}` : `${selectedMonth}`;
      
      // 날짜 필드 내에 '. 5.' 또는 '5월' 또는 '.05.' 등의 패턴 매칭
      const regex = new RegExp(`(\\.\\s*${monthStr}\\s*\\.)|(\\.\\s*${monthStrZero}\\s*\\.)|(${monthStr}월)|(${monthStrZero}월)`, "i");
      matchesMonth = regex.test(dateStr);
    }

    // 무장애 필터
    const matchesBarrierFree = !barrierFreeOnly || !!fest.MIDDLE_SIZE_RM1;

    return matchesSearch && matchesDistrict && matchesMonth && matchesBarrierFree;
  });

  // 북마크한 축제 목록
  const bookmarkedFestivals = festivals.filter((f) => bookmarks.includes(f.UC_SEQ));

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookmarkCount={bookmarks.length}
      />

      {/* Hero Banner Section */}
      <section className="relative w-full bg-slate-900 overflow-hidden py-20 px-4 text-center md:py-28 dark:bg-slate-950">
        {/* Abstract Background Lights */}
        <div className="absolute top-[-20%] left-[-10%] h-[350px] w-[350px] rounded-full bg-brand-neon-blue/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[350px] w-[350px] rounded-full bg-brand-neon-teal/20 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl space-y-5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 px-4 py-1.5 text-xs font-semibold text-brand-neon-teal border border-slate-700/50 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>부산광역시 공식 축제 정보 포털</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            가장 어여쁜 바다와, <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-brand-neon-blue via-cyan-400 to-brand-neon-teal bg-clip-text text-transparent">
              다채로운 축제의 부산
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
            일년 내내 축제로 빛나는 도시, 부산. 불꽃축제부터 태종대 수국, 해변의 댄스파티까지 <br className="hidden md:inline" />
            다채롭고 생생한 모든 축제 소식을 지도로 쉽고 완벽하게 확인해보세요.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {activeTab === "all" && (
          <>
            {/* Filters */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              barrierFreeOnly={barrierFreeOnly}
              setBarrierFreeOnly={setBarrierFreeOnly}
              districts={districts}
            />

            {/* Grid Title / Count */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                축제 검색 결과
                <span className="ml-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                  총 {filteredFestivals.length}건
                </span>
              </h2>
            </div>

            {/* Grid List */}
            {filteredFestivals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                <span className="text-4xl">🔍</span>
                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">검색된 축제가 없습니다.</h3>
                <p className="mt-1 text-sm text-slate-500">필터나 검색 키워드를 조정해보세요.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredFestivals.map((festival) => (
                  <FestivalCard
                    key={festival.UC_SEQ}
                    festival={festival}
                    isBookmarked={bookmarks.includes(festival.UC_SEQ)}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "map" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  축제 지도 탐색
                </h2>
                <p className="text-sm text-slate-500">지도를 드래그하고 핀을 클릭해 행사장 상세 위치를 탐색하세요.</p>
              </div>
            </div>
            
            {/* Filter indicators inside map view */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              barrierFreeOnly={barrierFreeOnly}
              setBarrierFreeOnly={setBarrierFreeOnly}
              districts={districts}
            />

            <FestivalMap festivals={filteredFestivals} />
          </div>
        )}

        {activeTab === "bookmarks" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <Heart className="h-5 w-5 fill-brand-neon-coral text-brand-neon-coral" />
                <span>내가 저장한 축제</span>
                <span className="text-xs font-semibold text-slate-400">
                  총 {bookmarkedFestivals.length}건
                </span>
              </h2>
              <p className="text-sm text-slate-500 mt-1">저장한 관심 축제들은 브라우저에 보존되어 언제든 다시 확인할 수 있습니다.</p>
            </div>

            {bookmarkedFestivals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                <span className="text-4xl">🤍</span>
                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">저장한 축제가 없습니다.</h3>
                <p className="mt-1 text-sm text-slate-500">축제 카드의 하트 아이콘을 눌러 축제를 저장해보세요!</p>
                <button
                  onClick={() => setActiveTab("all")}
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand-neon-blue px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-neon-blue/20 hover:opacity-90"
                >
                  축제 구경하러 가기
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {bookmarkedFestivals.map((festival) => (
                  <FestivalCard
                    key={festival.UC_SEQ}
                    festival={festival}
                    isBookmarked={true}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
