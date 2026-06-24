"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Calendar, ArrowRight, Accessibility } from "lucide-react";
import { Festival } from "@/types";

interface FestivalCardProps {
  festival: Festival;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
}

export default function FestivalCard({ festival, isBookmarked, onToggleBookmark }: FestivalCardProps) {
  const [imageError, setImageError] = useState(false);

  // 구군명 포맷팅
  const district = festival.GUGUN_NM || "부산";
  
  // 날짜 정보 포맷팅
  const dateStr = festival.USAGE_DAY_WEEK_AND_TIME || festival.USAGE_DAY || "일정 정보 없음";

  return (
    <article className="group relative flex flex-col h-full overflow-hidden rounded-2xl glass-card">
      {/* Image Section */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900/10 dark:bg-slate-950/20">
        {/* Heart bookmark button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleBookmark(festival.UC_SEQ);
          }}
          className="absolute top-3 right-3 z-10 flex h-9.5 w-9.5 items-center justify-center rounded-xl glass-panel shadow-sm text-slate-400 dark:text-slate-500 hover:scale-105 active:scale-95 transition-all"
          aria-label="관심 축제 추가"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isBookmarked
                ? "fill-brand-neon-coral text-brand-neon-coral animate-ping-once"
                : "hover:text-brand-neon-coral dark:hover:text-brand-neon-coral"
            }`}
          />
        </button>

        {/* District Tag */}
        <span className="absolute bottom-3 left-3 z-10 rounded-lg bg-brand-dark/80 px-2.5 py-1 text-[11px] font-bold text-brand-neon-blue backdrop-blur-md">
          {district}
        </span>

        {/* Accessibility tag (if support exists) */}
        {festival.MIDDLE_SIZE_RM1 && (
          <span className="absolute bottom-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-lg bg-brand-neon-teal/90 text-slate-950 shadow-sm backdrop-blur-md" title="무장애 편의시설 지원">
            <Accessibility className="h-4 w-4" />
          </span>
        )}

        {/* Festival Main Image */}
        {!imageError && festival.MAIN_IMG_NORMAL ? (
          <img
            src={festival.MAIN_IMG_NORMAL}
            alt={festival.MAIN_TITLE}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* High-quality CSS Gradient fallback in case image fails */
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-4 text-center">
            <span className="text-3xl mb-2">✨</span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Festival Busan</span>
            <span className="mt-1 text-sm font-bold text-slate-100 line-clamp-1">{festival.MAIN_TITLE}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-brand-neon-blue dark:text-brand-neon-teal">
          <Calendar className="h-3 w-3" />
          <span>{dateStr}</span>
        </div>

        <h3 className="mt-2.5 text-lg font-bold leading-6 text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-neon-blue dark:group-hover:text-brand-neon-teal transition-colors">
          {festival.MAIN_TITLE}
        </h3>

        {festival.TITLE && (
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
            "{festival.TITLE}"
          </p>
        )}

        <p className="mt-3.5 text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed flex-1">
          {festival.ITEMCNTNTS || "상세 설명 정보가 존재하지 않습니다."}
        </p>

        {/* Link Button */}
        <div className="mt-5 pt-4 border-t border-slate-200/50 dark:border-slate-800/40">
          <Link
            href={`/festival/${festival.UC_SEQ}`}
            className="inline-flex w-full items-center justify-between rounded-xl bg-slate-900 px-4 py-2.5 text-center text-xs font-bold text-white hover:bg-brand-deep dark:bg-brand-deep/80 dark:hover:bg-slate-800 transition-all group/btn"
          >
            <span>상세 정보 보기</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
