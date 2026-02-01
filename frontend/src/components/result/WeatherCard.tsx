import { motion } from 'framer-motion';
import { Cloud, CloudRain, CloudSun, Moon, Sun, Wind } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { useThemeStore } from '../../stores/themeStore';
import clsx from 'clsx';

interface WeatherCardProps {
  weatherType: string;
  emotion: string;
  intensity: number;
}

export function WeatherCard({ weatherType, emotion, intensity }: WeatherCardProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // Map weather types to Lucide icons
  const getWeatherIcon = (type: string) => {
    switch (type) {
      case '晴朗': return <Sun className="w-12 h-12 text-amber-500" />;
      case '多云': return <CloudSun className="w-12 h-12 text-blue-500" />;
      case '阴天': return <Cloud className="w-12 h-12 text-gray-500" />;
      case '小雨': return <CloudRain className="w-12 h-12 text-indigo-500" />;
      case '大风': return <Wind className="w-12 h-12 text-teal-500" />;
      default: return <Moon className="w-12 h-12 text-purple-500" />;
    }
  };

  return (
    <GlassCard className={clsx(
      "flex flex-col items-center gap-6 py-8 relative overflow-hidden",
      isDark ? "bg-slate-900/50" : "bg-white"
    )}>
      {/* Ambient Glow */}
      <div className={clsx(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-3xl rounded-full",
        isDark ? "bg-purple-500/10" : "bg-primary-500/5"
      )} />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', bounce: 0.4 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className={clsx(
            "p-4 rounded-full border shadow-lg",
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-gray-100 border-gray-200"
          )}
        >
          {getWeatherIcon(weatherType)}
        </motion.div>

        <div className="text-center">
          <p className={clsx(
            "text-2xl font-bold mb-2 tracking-wide",
            isDark ? "text-white" : "text-gray-900"
          )}>
            心情：{emotion}
          </p>
          <p className={clsx(
            "text-sm uppercase tracking-widest font-medium",
            isDark ? "text-slate-400" : "text-gray-500"
          )}>
            强度：{Math.round(intensity * 100)}%
          </p>
        </div>

        {/* Progress Bar */}
        <div className={clsx(
          "w-64 h-3 rounded-full overflow-hidden border",
          isDark
            ? "bg-slate-800 border-slate-700"
            : "bg-gray-200 border-gray-300"
        )}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${intensity * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
          />
        </div>
      </motion.div>
    </GlassCard>
  );
}
