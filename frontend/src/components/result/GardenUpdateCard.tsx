import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { ArrowRight, Sprout } from 'lucide-react';
import type { GardenUpdate } from '../../types';
import { useThemeStore } from '../../stores/themeStore';
import clsx from 'clsx';

// Plant Icons Map (simplified for now, can be expanded)
const PLANT_ICONS: Record<string, string> = {
  'Pine': '🌲',
  'Lotus': '🪷',
  'Bamboo': '🎍',
  'Rose': '🌹',
  'Oak': '🌳',
  'Sunflower': '🌻',
  'Cactus': '🌵',
  'Olive': '🫒',
  // Fallback map for Chinese names if API returns them
  '松树': '🌲',
  '莲花': '🪷',
  '竹子': '🎍',
  '玫瑰': '🌹',
  '橡树': '🌳',
  '向日葵': '🌻',
  '仙人掌': '🌵',
  '橄榄树': '🫒',
};

interface GardenUpdateCardProps {
  updates: GardenUpdate[];
}

export function GardenUpdateCard({ updates }: GardenUpdateCardProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  if (!updates.length) return null;

  return (
    <GlassCard className={clsx(
      "bg-gradient-to-br",
      isDark
        ? "from-emerald-900/30 to-green-900/30 border-emerald-500/30"
        : "from-green-50 to-emerald-50 border-emerald-200"
    )}>
      <div className={clsx(
        "flex items-center gap-3 mb-6",
        isDark ? "text-emerald-400" : "text-emerald-600"
      )}>
        <Sprout className="w-6 h-6" />
        <h3 className={clsx(
          "text-lg font-bold tracking-wide uppercase",
          isDark ? "text-emerald-300" : "text-emerald-700"
        )}>
          Garden Updates
        </h3>
      </div>

      <div className="space-y-3">
        {updates.map((update, index) => {
          // Determine icon
          const icon = PLANT_ICONS[update.plantType] || '🌿';

          return (
            <motion.div
              key={update.authorId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={clsx(
                "flex items-center gap-4 p-4 rounded-xl border transition-colors",
                isDark
                  ? "bg-slate-900/50 border-slate-700 hover:border-emerald-500/50"
                  : "bg-white border-gray-200 hover:border-emerald-300"
              )}
            >
              <div className={clsx(
                "w-12 h-12 rounded-full flex items-center justify-center text-2xl border shadow-sm",
                isDark
                  ? "bg-emerald-900/50 border-emerald-500/50"
                  : "bg-emerald-100 border-emerald-200"
              )}>
                {icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={clsx(
                    "font-bold truncate",
                    isDark ? "text-white" : "text-gray-900"
                  )}>{update.authorName}</span>
                  <span className={clsx(
                    "text-xs px-2 py-0.5 rounded-full border",
                    isDark
                      ? "text-emerald-300 bg-emerald-900/50 border-emerald-500/50"
                      : "text-emerald-600 bg-emerald-100 border-emerald-200"
                  )}>
                    {update.plantType}
                  </span>
                </div>
                <div className={clsx(
                  "flex items-center gap-2 text-sm",
                  isDark ? "text-slate-400" : "text-gray-500"
                )}>
                  {update.isNewPlant ? (
                    <span className="text-amber-500 flex items-center gap-1">
                      <SparklesIcon className="w-3 h-3" /> New Discovery!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Stage {update.previousStage} <ArrowRight className="w-3 h-3" /> Stage {update.currentStage}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75V4.5zM6 8.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V8.25zM11.25 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75V15zM2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  )
}
