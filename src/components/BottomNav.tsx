import React from 'react';
import { Target, Timer, BarChart3, Search, Settings } from 'lucide-react';

export type NavTab = 'practice' | 'exam' | 'analytics' | 'explorer' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  unattemptedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
}) => {
  const tabs = [
    {
      id: 'practice' as NavTab,
      label: 'Practice',
      icon: Target,
      badge: null,
    },
    {
      id: 'exam' as NavTab,
      label: 'Exam',
      icon: Timer,
      badge: 'Timed',
    },
    {
      id: 'analytics' as NavTab,
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'explorer' as NavTab,
      label: 'Bank (2.1k)',
      icon: Search,
      badge: null,
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950/90 backdrop-blur-lg border-t border-indigo-950/70 pb-safe shadow-2xl shadow-indigo-950/50">
      <div className="max-w-md mx-auto grid grid-cols-5 px-1 py-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 select-none active:scale-95 ${
                isActive
                  ? 'text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              {/* Active pill glow background */}
              {isActive && (
                <span className="absolute inset-x-1.5 top-0.5 bottom-1 bg-gradient-to-b from-indigo-600/30 to-violet-600/10 rounded-xl border border-indigo-500/30 -z-10 shadow-sm shadow-indigo-500/20" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-indigo-400' : 'text-slate-400'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[8px] font-black rounded-full leading-tight">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] mt-0.5 tracking-tight transition-colors ${
                  isActive
                    ? 'text-indigo-200 font-bold'
                    : 'text-slate-400 font-normal'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
