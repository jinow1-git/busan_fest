"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./FestivalSingleMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full rounded-2xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center justify-center text-slate-400">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-neon-blue border-t-transparent"></div>
      <p className="mt-2 text-xs font-semibold">지도를 불러오고 있습니다...</p>
    </div>
  ),
});

interface FestivalSingleMapWrapperProps {
  lat: number;
  lng: number;
  title: string;
  place: string;
}

export default function FestivalSingleMapWrapper(props: FestivalSingleMapWrapperProps) {
  return <Map {...props} />;
}
