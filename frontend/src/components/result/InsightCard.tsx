import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Lightbulb, Hash, Palette } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import clsx from 'clsx';

interface InsightCardProps {
  insight: string;
  keywords: string[];
  imagery: string[];
}

export function InsightCard({ insight, keywords, imagery }: InsightCardProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <GlassCard className={clsx(
      "bg-gradient-to-br",
      isDark
        ? "from-indigo-900/30 to-purple-900/30 border-indigo-500/30"
        : "from-indigo-50 to-purple-50 border-indigo-200"
    )}>
      <div className={clsx(
        "flex items-center gap-3 mb-4",
        isDark ? "text-indigo-400" : "text-indigo-600"
      )}>
        <Lightbulb className="w-6 h-6" />
        <h3 className={clsx(
          "text-lg font-bold tracking-wide uppercase",
          isDark ? "text-indigo-300" : "text-indigo-700"
        )}>
          心理洞察
        </h3>
      </div>

      <p className={clsx(
        "leading-relaxed mb-8 text-lg font-light",
        isDark ? "text-slate-300" : "text-gray-700"
      )}>
        {insight || (
          <span className={clsx(
            "italic",
            isDark ? "text-slate-500" : "text-gray-400"
          )}>
            正在积攒记忆以分析...随着你记录更多日记，我会逐渐了解你的内心世界。
          </span>
        )}
      </p>

      <div className="space-y-6">
        {keywords.length > 0 && (
          <div>
            <div className={clsx(
              "flex items-center gap-2 text-xs uppercase tracking-widest mb-3",
              isDark ? "text-slate-400" : "text-gray-500"
            )}>
              <Hash className="w-3 h-3" /> 关键词
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <motion.span
                  key={keyword}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className={clsx(
                    "px-3 py-1.5 text-sm font-medium rounded-full border shadow-sm",
                    isDark
                      ? "bg-indigo-900/50 border-indigo-500/50 text-indigo-300"
                      : "bg-indigo-100 border-indigo-300 text-indigo-700"
                  )}
                >
                  #{keyword}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {imagery.length > 0 && (
          <div>
            <div className={clsx(
              "flex items-center gap-2 text-xs uppercase tracking-widest mb-3",
              isDark ? "text-slate-400" : "text-gray-500"
            )}>
              <Palette className="w-3 h-3" /> 意象
            </div>
            <div className="flex flex-wrap gap-2">
              {imagery.map((img, index) => (
                <motion.span
                  key={img}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className={clsx(
                    "px-3 py-1 text-sm rounded-lg border transition-colors",
                    isDark
                      ? "bg-teal-900/50 border-teal-500/50 text-teal-300 hover:bg-teal-900/70"
                      : "bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100"
                  )}
                >
                  {img}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
