import { Festival, FestivalResponse } from "@/types";

const API_URL = "https://apis.data.go.kr/6260000/FestivalService/getFestivalKr?serviceKey=64451020e60e677d653b084ccde4a1f84a1994ae49bbaf49fd508bda04a76054&pageNo=1&numOfRows=100&resultType=json";

export function cleanTitle(title: string): string {
  return title.replace(/\s*\(한.*일\)/g, "").trim();
}

export async function getFestivals(): Promise<Festival[]> {
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 86400 }, // 24시간 동안 캐싱 (ISR)
    });

    if (!res.ok) {
      throw new Error(`API fetch failed with status: ${res.status}`);
    }

    const data: FestivalResponse = await res.json();
    
    if (!data.getFestivalKr || !data.getFestivalKr.item) {
      console.error("Invalid API response structure:", data);
      return [];
    }

    // 데이터 정제
    return data.getFestivalKr.item.map((item) => ({
      ...item,
      MAIN_TITLE: cleanTitle(item.MAIN_TITLE),
      // 위도, 경도가 문자열로 반환되는 경우를 대비해 숫자로 파싱
      LAT: typeof item.LAT === "string" ? parseFloat(item.LAT) : item.LAT,
      LNG: typeof item.LNG === "string" ? parseFloat(item.LNG) : item.LNG,
    }));
  } catch (error) {
    console.error("Failed to fetch festivals:", error);
    return [];
  }
}
