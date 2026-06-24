"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { MapPin } from "lucide-react";

const createCustomIcon = (isDark: boolean) => {
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center">
        <span class="absolute inline-flex h-8 w-8 animate-ping rounded-full ${
          isDark ? "bg-brand-neon-teal/40" : "bg-brand-neon-blue/40"
        } opacity-75"></span>
        <div class="relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${
          isDark ? "from-brand-neon-teal to-cyan-500" : "from-brand-neon-blue to-indigo-600"
        } shadow-lg border-2 border-white">
          <div class="h-2 w-2 rounded-full bg-white"></div>
        </div>
      </div>
    `,
    className: "custom-marker-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

interface FestivalSingleMapProps {
  lat: number;
  lng: number;
  title: string;
  place: string;
}

export default function FestivalSingleMap({ lat, lng, title, place }: FestivalSingleMapProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
      const observer = new MutationObserver(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => observer.disconnect();
    }
  }, []);

  const tileLayerUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  const customIcon = createCustomIcon(isDark);

  return (
    <div className="relative h-[300px] w-full rounded-2xl overflow-hidden border border-slate-200/50 shadow-inner bg-slate-100 dark:border-slate-800 dark:bg-slate-950/40">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileLayerUrl}
        />
        <Marker position={[lat, lng]} icon={customIcon}>
          <Popup>
            <div className="p-1.5 text-center text-slate-100">
              <span className="text-[10px] font-bold text-brand-neon-blue flex items-center justify-center gap-0.5">
                <MapPin className="h-3 w-3" /> {place}
              </span>
              <h5 className="font-extrabold text-xs text-white mt-1 leading-tight">{title}</h5>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
