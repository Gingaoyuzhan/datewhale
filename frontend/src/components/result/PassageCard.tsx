import { motion } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import type { MatchResult } from '../../types';
import clsx from 'clsx';
import { useThemeStore } from '../../stores/themeStore';

interface PassageCardProps {
  match: MatchResult;
  isActive?: boolean;
  onClick?: () => void;
}

export function PassageCard({ match, isActive = false, onClick }: PassageCardProps) {
  const { passage, matchScore, matchReason, rank } = match;
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.15 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="relative group"
    >
      <GlassCard
        className={clsx(
          "p-8 cursor-pointer transition-all duration-300 border-l-4",
          isDark
            ? isActive
              ? "bg-purple-900/30 border-l-purple-500 shadow-xl shadow-purple-500/10"
              : "bg-slate-900/50 border-l-transparent hover:bg-slate-800/50 hover:border-l-slate-500"
            : isActive
              ? "bg-purple-50 border-l-purple-500 shadow-xl shadow-purple-500/10"
              : "bg-white border-l-transparent hover:bg-gray-50 hover:border-l-gray-400"
        )}
      >
        {/* Match Badge */}
        <div className={clsx(
          "absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-sm border",
          isDark
            ? "bg-purple-900/50 border-purple-500/50 text-purple-300"
            : "bg-purple-100 border-purple-200 text-purple-700"
        )}>
          <Sparkles className="w-3 h-3" />
          {Math.round(matchScore * 100)}% 匹配
        </div>

        {/* Rank Watermark */}
        <div className={clsx(
          "absolute -bottom-4 -right-4 text-[8rem] font-bold pointer-events-none select-none leading-none",
          isDark ? "text-slate-800" : "text-gray-200"
        )}>
          {rank}
        </div>

        <Quote className={clsx(
          "w-8 h-8 mb-4",
          isDark ? "text-slate-600" : "text-gray-300"
        )} />

        <blockquote className={clsx(
          "text-lg md:text-xl mb-6 leading-relaxed font-serif italic relative z-10",
          isDark ? "text-slate-200" : "text-gray-800"
        )}>
          "{passage.content}"
        </blockquote>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-serif text-lg shadow-lg border border-white/10">
            {passage.author?.name?.charAt(0) || '?'}
          </div>
          <div>
            <p className={clsx(
              "font-bold text-lg",
              isDark ? "text-white" : "text-gray-900"
            )}>
              {passage.author?.name || '佚名'}
            </p>
            <p className={clsx(
              "text-sm",
              isDark ? "text-slate-400" : "text-gray-500"
            )}>
              《{passage.work?.title || '未知作品'}》
            </p>
          </div>
        </div>

        {/* Match Reason */}
        <div className={clsx(
          "mt-6 pt-4 border-t",
          isDark ? "border-slate-700" : "border-gray-200"
        )}>
          <p className={clsx(
            "text-sm flex items-start gap-2",
            isDark ? "text-slate-400" : "text-gray-600"
          )}>
            <span className="text-purple-500 mt-0.5">✦</span>
            {matchReason}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}
