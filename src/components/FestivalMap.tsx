"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { MapPin, Calendar, ExternalLink } from "lucide-react";
import { Festival } from "@/types";

// Leaflet 기본 아이콘 깨짐 현상 수정 (SVG로 커스텀 마커 제작)
const createCustomIcon = (isDark: boolean) => {
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center">
        <span class="absolute inline-flex h-6 w-6 animate-pulse rounded-full ${
          isDark ? "bg-brand-neon-teal/40" : "bg-brand-neon-blue/40"
        } opacity-75"></span>
        <div class="relative flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br ${
          isDark ? "from-brand-neon-teal to-cyan-500" : "from-brand-neon-blue to-indigo-600"
        } shadow-md border border-white">
          <div class="h-1.5 w-1.5 rounded-full bg-white"></div>
        </div>
      </div>
    `,
    className: "custom-marker-icon",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -10],
  });
};

// 지도 중심을 동적으로 변경해주는 컴포넌트
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
}

interface FestivalMapProps {
  festivals: Festival[];
}

export default function FestivalMap({ festivals }: FestivalMapProps) {
  const [isDark, setIsDark] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([35.179554, 129.075641]); // 부산시청 기준

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
      
      // 다크모드 변경 감지 옵저버
      const observer = new MutationObserver(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => observer.disconnect();
    }
  }, []);

  // 유효한 좌표를 가진 축제 필터링
  const validFestivals = festivals.filter(
    (f) => f.LAT && f.LNG && !isNaN(f.LAT) && !isNaN(f.LNG) && f.LAT > 34 && f.LAT < 36 && f.LNG > 128 && f.LNG < 130
  );

  useEffect(() => {
    // 첫 번째 축제가 있으면 그 곳으로 중심 변경
    if (validFestivals.length > 0) {
      setMapCenter([validFestivals[0].LAT, validFestivals[0].LNG]);
    }
  }, [festivals]);

  const tileLayerUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  const customIcon = createCustomIcon(isDark);

  return (
    <div className="relative h-[650px] w-full rounded-2xl overflow-hidden border border-slate-200/50 shadow-inner bg-slate-100 dark:border-slate-800 dark:bg-slate-950/40">
      {validFestivals.length === 0 ? (
        <div className="flex h-full w-full flex-col items-center justify-center text-slate-400 dark:text-slate-600">
          <MapPin className="h-12 w-12 mb-2 animate-bounce" />
          <span className="text-sm font-semibold">지도에 표시할 축제 데이터가 없습니다.</span>
        </div>
      ) : (
        <MapContainer
          center={mapCenter}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={tileLayerUrl}
          />
          <MapRecenter center={mapCenter} />
          {validFestivals.map((festival) => (
            <Marker
              key={festival.UC_SEQ}
              position={[festival.LAT, festival.LNG]}
              icon={customIcon}
            >
              <Popup>
                <div className="p-2 space-y-2 max-w-[240px] text-slate-100">
                  <div className="text-slate-400 text-[10px] font-bold tracking-wide uppercase flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-brand-neon-blue" />
                    <span>{festival.GUGUN_NM} · {festival.PLACE}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-white leading-tight">
                    {festival.MAIN_TITLE}
                  </h4>
                  {festival.USAGE_DAY_WEEK_AND_TIME && (
                    <div className="text-slate-300 text-[11px] flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-brand-neon-teal" />
                      <span>{festival.USAGE_DAY_WEEK_AND_TIME}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-700/50">
                    <Link
                      href={`/festival/${festival.UC_SEQ}`}
                      className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-brand-neon-blue to-brand-neon-teal py-1.5 px-3 text-center text-xs font-bold text-slate-950 hover:opacity-90 transition-opacity"
                    >
                      <span>상세 정보</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          </MapContainer>
        )}
    </div>
  );
}
