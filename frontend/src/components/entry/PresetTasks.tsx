import { motion } from 'framer-motion';
import { Sparkles, Moon, Coffee } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { useThemeStore } from '../../stores/themeStore';
import clsx from 'clsx';

interface PresetTask {
  title: string;
  content: string;
  emotion: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PRESET_TASKS: PresetTask[] = [
  {
    title: 'Graduation',
    content: 'Standing at the school gate today, looking back at everything familiar, my heart is filled with mixed emotions...',
    emotion: 'Touched',
    icon: Sparkles
  },
  {
    title: 'Late Night',
    content: 'Another sleepless night, the city lights outside the window are bright, but I feel unprecedented loneliness...',
    emotion: 'Lonely',
    icon: Moon
  },
  {
    title: 'Rainy Cafe',
    content: 'Outside the window, a light rain is falling. I sit in the corner of the cafe, watching the raindrops slide down the glass...',
    emotion: 'Calm',
    icon: Coffee
  },
];

interface PresetTasksProps {
  onSelect: (content: string, emotion: string) => void;
}

export function PresetTasks({ onSelect }: PresetTasksProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-4">
      <p className={clsx(
        "text-sm font-medium",
        isDark ? "text-slate-400" : "text-gray-500"
      )}>
        Need inspiration? Try these moments:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PRESET_TASKS.map((task, index) => {
          const Icon = task.icon;
          return (
            <motion.div
              key={task.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(task.content, task.emotion)}
              className="cursor-pointer"
            >
              <GlassCard className={clsx(
                "h-full p-4 transition-colors group",
                isDark
                  ? "hover:bg-slate-800/50 border-slate-700 bg-slate-900/50"
                  : "hover:bg-white border-gray-200 bg-white/80"
              )}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={clsx(
                    "p-1.5 rounded-lg transition-colors",
                    isDark
                      ? "bg-purple-900/50 text-purple-400 group-hover:text-purple-300"
                      : "bg-purple-100 text-purple-600 group-hover:text-purple-700"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={clsx(
                    "font-medium",
                    isDark ? "text-white" : "text-gray-900"
                  )}>
                    {task.title}
                  </span>
                </div>
                <p className={clsx(
                  "text-xs line-clamp-3 leading-relaxed",
                  isDark ? "text-slate-400" : "text-gray-500"
                )}>
                  {task.content}
                </p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
