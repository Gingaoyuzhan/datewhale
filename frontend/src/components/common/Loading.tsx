import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import clsx from 'clsx';

export function Loading() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className={clsx(
      "fixed inset-0 backdrop-blur-md flex items-center justify-center z-50",
      isDark ? "bg-slate-900/80" : "bg-white/80"
    )}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin relative z-10" />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={clsx(
            "font-medium text-lg animate-pulse",
            isDark ? "text-slate-400" : "text-gray-600"
          )}
        >
          正在连接宇宙...
        </motion.p>
      </motion.div>
    </div>
  );
}

export function LoadingInline() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
    </div>
  );
}
