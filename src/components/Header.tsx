"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sun, Moon, Menu, X, Heart, Map, Compass } from "lucide-react";

interface HeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  bookmarkCount?: number;
}

export default function Header({ activeTab, setActiveTab, bookmarkCount = 0 }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // 다크모드 초기값 확인
    if (typeof window !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window !== "undefined") {
      const isCurrentlyDark = document.documentElement.classList.contains("dark");
      if (isCurrentlyDark) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        setIsDark(false);
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        setIsDark(true);
      }
    }
  };

  const navItems = [
    { id: "all", name: "축제 탐색", icon: Compass },
    { id: "map", name: "지도 탐색", icon: Map },
    { id: "bookmarks", name: "저장한 축제", icon: Heart, count: bookmarkCount },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel shadow-sm transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-neon-blue to-brand-neon-teal text-white shadow-md transition-transform group-hover:scale-105">
                🌊
              </span>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                축제해 부산
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {setActiveTab && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-brand-neon-blue/10 to-brand-neon-teal/10 text-brand-neon-blue dark:text-brand-neon-teal font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                    {item.count !== undefined && item.count > 0 && (
                      <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-neon-coral text-white text-[10px] font-bold animate-pulse">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Actions (Theme toggle & Mobile Menu) */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg border border-slate-200 bg-white/50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-brand-deep/50 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {setActiveTab && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 rounded-lg border border-slate-200 bg-white/50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-brand-deep/50 transition-colors"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {setActiveTab && isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-brand-card/95 backdrop-blur-lg animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-brand-neon-blue/10 to-brand-neon-teal/10 text-brand-neon-blue dark:text-brand-neon-teal font-semibold"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-brand-neon-coral text-white text-[11px] font-bold">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
