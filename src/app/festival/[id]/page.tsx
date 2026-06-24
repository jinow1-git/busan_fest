import { getFestivals } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Phone, CreditCard, Globe, Compass, Accessibility, Bus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FestivalSingleMap from "@/components/FestivalSingleMapWrapper";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 상세 페이지별 동적 SEO 메타데이터 설정
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const festivals = await getFestivals();
  const festival = festivals.find((f) => String(f.UC_SEQ) === id);

  if (!festival) {
    return {
      title: "축제를 찾을 수 없습니다",
    };
  }

  return {
    title: `${festival.MAIN_TITLE} - 축제해 부산`,
    description: festival.TITLE || `${festival.MAIN_TITLE} 축제에 대한 개최일정, 장소, 교통 정보, 편의시설 안내입니다.`,
    openGraph: {
      title: `${festival.MAIN_TITLE} - 축제해 부산`,
      description: festival.TITLE || `${festival.MAIN_TITLE} 축제에 대한 개최일정, 장소, 교통 정보, 편의시설 안내입니다.`,
      images: festival.MAIN_IMG_NORMAL ? [{ url: festival.MAIN_IMG_NORMAL }] : [],
    },
  };
}

// 정적 경로 미리 생성 (Static Generation - ISR)
export async function generateStaticParams() {
  const festivals = await getFestivals();
  return festivals.map((f) => ({
    id: String(f.UC_SEQ),
  }));
}

export default async function FestivalDetailPage({ params }: PageProps) {
  const { id } = await params;
  const festivals = await getFestivals();
  const festival = festivals.find((f) => String(f.UC_SEQ) === id);

  if (!festival) {
    notFound();
  }

  // 줄바꿈이 포함된 소개글을 문단별로 파싱
  const paragraphs = festival.ITEMCNTNTS
    ? festival.ITEMCNTNTS.split("\n").filter((p) => p.trim() !== "")
    : ["소개 내용이 존재하지 않습니다."];

  const dateStr = festival.USAGE_DAY_WEEK_AND_TIME || festival.USAGE_DAY || "일정 정보 없음";
  const costStr = festival.USAGE_AMOUNT || "무료";
  const homepageUrl = festival.HOMEPAGE_URL && festival.HOMEPAGE_URL.startsWith("http")
    ? festival.HOMEPAGE_URL
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header (북마크는 메인 대시보드 상태이므로 헤더의 북마크 뱃지는 0으로 디폴트 처리) */}
      <Header bookmarkCount={0} />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>메인 화면으로 돌아가기</span>
          </Link>
        </div>

        {/* Hero Area */}
        <section className="relative rounded-3xl overflow-hidden glass-panel p-6 md:p-10 shadow-sm">
          <div className="absolute top-0 right-0 h-[250px] w-[250px] rounded-full bg-brand-neon-blue/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-[250px] w-[250px] rounded-full bg-brand-neon-teal/10 blur-[100px] pointer-events-none" />

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            {/* Image (Left) */}
            <div className="w-full lg:w-2/5 aspect-video rounded-2xl overflow-hidden bg-slate-900/10 dark:bg-slate-950/20 relative shadow-md">
              {festival.MAIN_IMG_NORMAL ? (
                <img
                  src={festival.MAIN_IMG_NORMAL}
                  alt={festival.MAIN_TITLE}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-950 to-slate-900 p-6 text-center">
                  <span className="text-4xl mb-2">✨</span>
                  <span className="text-sm font-bold text-slate-200">{festival.MAIN_TITLE}</span>
                </div>
              )}
            </div>

            {/* Info Summary (Right) */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg bg-brand-neon-blue/15 px-3 py-1 text-xs font-bold text-brand-neon-blue">
                  {festival.GUGUN_NM || "부산광역시"}
                </span>
                {festival.MIDDLE_SIZE_RM1 && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-brand-neon-teal/20 px-3 py-1 text-xs font-bold text-slate-800 dark:text-brand-neon-teal">
                    <Accessibility className="h-3.5 w-3.5" />
                    <span>장애인 보조 편의 지원</span>
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                {festival.MAIN_TITLE}
              </h1>

              {festival.TITLE && (
                <p className="text-lg font-medium text-slate-500 dark:text-slate-400 italic">
                  "{festival.TITLE}"
                </p>
              )}

              {festival.SUBTITLE && (
                <p className="text-sm text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                  {festival.SUBTITLE}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Detailed Grid content */}
        <section className="grid gap-8 lg:grid-cols-3">
          
          {/* Main Description (Left - 2cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Story Card */}
            <div className="rounded-2xl bg-white dark:bg-brand-card p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/40">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800/50 pb-3 flex items-center gap-2">
                <Compass className="h-5 w-5 text-brand-neon-blue" />
                <span>축제 이야기</span>
              </h3>
              <div className="mt-4 space-y-4 text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                {paragraphs.map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
              </div>
            </div>

            {/* Accessibility features Card */}
            {festival.MIDDLE_SIZE_RM1 && (
              <div className="rounded-2xl bg-gradient-to-r from-brand-neon-teal/5 to-transparent p-6 shadow-sm border border-brand-neon-teal/15">
                <h3 className="text-lg font-bold text-slate-800 dark:text-brand-neon-teal flex items-center gap-2">
                  <Accessibility className="h-5 w-5" />
                  <span>장애인 및 노약자 접근 편의 정보</span>
                </h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 font-medium">
                  {festival.MIDDLE_SIZE_RM1}
                </p>
              </div>
            )}
          </div>

          {/* Quick Details & Location (Right - 1col) */}
          <div className="space-y-6">
            
            {/* Information sheet */}
            <div className="rounded-2xl bg-white dark:bg-brand-card p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/40 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800/50 pb-3">
                축제 상세 정보
              </h3>
              
              <div className="space-y-3.5 text-sm">
                <div className="flex gap-3">
                  <Calendar className="h-4.5 w-4.5 text-brand-neon-blue shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">개최 일정</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{dateStr}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CreditCard className="h-4.5 w-4.5 text-brand-neon-teal shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">이용 요금</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{costStr}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin className="h-4.5 w-4.5 text-brand-neon-blue shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">행사 장소</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {festival.MAIN_PLACE || festival.PLACE}
                      {festival.ADDR1 && <span className="block text-xs text-slate-400 font-normal mt-0.5">({festival.ADDR1})</span>}
                    </span>
                  </div>
                </div>

                {festival.CNTCT_TEL && (
                  <div className="flex gap-3">
                    <Phone className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">문의처</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{festival.CNTCT_TEL}</span>
                    </div>
                  </div>
                )}

                {homepageUrl && (
                  <div className="flex gap-3">
                    <Globe className="h-4.5 w-4.5 text-brand-neon-teal shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">공식 홈페이지</span>
                      <a
                        href={homepageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-brand-neon-blue dark:text-brand-neon-teal hover:underline break-all inline-flex items-center gap-1"
                      >
                        <span>웹사이트 바로가기</span>
                        <Globe className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Transport direction */}
            {festival.TRFC_INFO && (
              <div className="rounded-2xl bg-white dark:bg-brand-card p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/40">
                <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800/50 pb-3 flex items-center gap-2">
                  <Bus className="h-4.5 w-4.5 text-brand-neon-teal" />
                  <span>찾아오시는 길</span>
                </h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                  {festival.TRFC_INFO}
                </p>
              </div>
            )}

            {/* Map Card */}
            {festival.LAT && festival.LNG && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">행사장 위치 지도</span>
                <FestivalSingleMap
                  lat={festival.LAT}
                  lng={festival.LNG}
                  title={festival.MAIN_TITLE}
                  place={festival.PLACE || festival.MAIN_PLACE}
                />
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
