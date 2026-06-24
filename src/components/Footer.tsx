import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-brand-dark transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-brand-neon-blue to-brand-neon-teal bg-clip-text text-transparent">
              축제해 부산
            </span>
            <span className="text-xs text-slate-400">© 2026. All rights reserved.</span>
          </div>
          
          <div className="text-center text-xs text-slate-500 dark:text-slate-400">
            본 사이트는 부산광역시 오픈 API 데이터를 가공하여 활용하고 있습니다.
          </div>
          
          <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
            <Link href="https://apis.data.go.kr" target="_blank" rel="noopener noreferrer" className="hover:text-brand-neon-blue transition-colors">
              공공데이터포털
            </Link>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <Link href="/PRD.md" target="_blank" className="hover:text-brand-neon-blue transition-colors">
              요구사항(PRD)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
