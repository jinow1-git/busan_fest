import { getFestivals } from "@/lib/api";
import FestivalDashboard from "@/components/FestivalDashboard";

// Next.js ISR (Incremental Static Regeneration) 설정 - 하루에 한번 백그라운드 데이터 갱신
export const revalidate = 86400; 

export default async function Home() {
  const festivals = await getFestivals();

  return <FestivalDashboard festivals={festivals} />;
}
