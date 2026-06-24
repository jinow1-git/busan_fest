"use client";

import { Search, MapPin, Calendar, Heart, Accessibility } from "lucide-react";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (val: string) => void;
  selectedMonth: number | null;
  setSelectedMonth: (val: number | null) => void;
  barrierFreeOnly: boolean;
  setBarrierFreeOnly: (val: boolean) => void;
  districts: string[];
}

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedDistrict,
  setSelectedDistrict,
  selectedMonth,
  setSelectedMonth,
  barrierFreeOnly,
  setBarrierFreeOnly,
  districts,
}: FilterBarProps) {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="w-full space-y-4 rounded-2xl glass-panel p-5 shadow-sm transition-all duration-300">
      {/* Search and Barrier-Free Toggle */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="축제 이름 또는 내용을 검색해보세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white/70 py-3 pr-4 pl-11 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-brand-neon-blue dark:border-slate-800 dark:bg-slate-950/40 dark:placeholder:text-slate-600 dark:focus:border-brand-neon-teal transition-all"
          />
        </div>

        {/* Barrier-Free accessibility filter */}
        <button
          onClick={() => setBarrierFreeOnly(!barrierFreeOnly)}
          className={`flex items-center justify-center gap-2 rounded-xl border py-3 px-4 text-sm font-medium transition-all ${
            barrierFreeOnly
              ? "border-brand-neon-teal/50 bg-brand-neon-teal/10 text-brand-neon-teal shadow-sm shadow-brand-neon-teal/10"
              : "border-slate-200 bg-white/50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-white"
          }`}
        >
          <Accessibility className="h-4.5 w-4.5" />
          <span>휠체어/무장애 편의 지원</span>
        </button>
      </div>

      {/* District (Gugun) Selector */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-brand-neon-blue" />
          <span>지역구 필터</span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedDistrict("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedDistrict === ""
                ? "bg-brand-neon-blue text-white shadow-sm shadow-brand-neon-blue/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            전체 부산
          </button>
          {districts.map((district) => (
            <button
              key={district}
              onClick={() => setSelectedDistrict(district)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDistrict === district
                  ? "bg-brand-neon-blue text-white shadow-sm shadow-brand-neon-blue/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {district}
            </button>
          ))}
        </div>
      </div>

      {/* Month Selector */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <Calendar className="h-3.5 w-3.5 text-brand-neon-teal" />
          <span>월별 일정 필터</span>
        </div>
        <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12 md:flex md:flex-wrap">
          <button
            onClick={() => setSelectedMonth(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-center transition-all md:flex-1 md:min-w-[70px] ${
              selectedMonth === null
                ? "bg-brand-neon-teal text-slate-950 shadow-sm shadow-brand-neon-teal/20 font-bold"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            연중 전체
          </button>
          {months.map((month) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-center transition-all md:flex-1 md:min-w-[50px] ${
                selectedMonth === month
                  ? "bg-brand-neon-teal text-slate-950 shadow-sm shadow-brand-neon-teal/20 font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {month}월
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
