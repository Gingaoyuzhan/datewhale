import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EMOTIONS } from '../../types';
import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

interface EmotionPickerProps {
  selected: string | null;
  onSelect: (emotion: string) => void;
}

// Map emotion names to specific gradient classes or styles
// We'll use inline styles for the custom properties defined in index.css
const getEmotionStyle = (emotionName: string, isSelected: boolean) => {
  const normalize = (str: string) => str.toLowerCase();
  const name = normalize(emotionName);

  if (!isSelected) return {};

  if (name.includes('happy') || name.includes('joy') || name.includes('excited')) return { background: 'var(--gradient-joy)', color: 'black' };
  if (name.includes('sad') || name.includes('dark')) return { background: 'var(--gradient-sadness)', color: 'white' };
  if (name.includes('angry') || name.includes('frust')) return { background: 'var(--gradient-anger)', color: 'white' };
  if (name.includes('calm') || name.includes('peace') || name.includes('relax')) return { background: 'var(--gradient-calm)', color: 'black' };
  if (name.includes('fear') || name.includes('anxious')) return { background: 'var(--gradient-fear)', color: 'white' };
  if (name.includes('love') || name.includes('grateful')) return { background: 'var(--gradient-love)', color: 'white' };

  return { background: 'var(--soul-primary)', color: 'white' }; // Default active
};

export function EmotionPicker({ selected, onSelect }: EmotionPickerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className={clsx(
          "text-sm font-medium tracking-wide uppercase text-[10px]",
          isDark ? "text-slate-400" : "text-gray-500"
        )}>Soul Resonance</span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={clsx(
            "text-xs flex items-center gap-1 transition-colors",
            isDark
              ? "text-slate-500 hover:text-slate-300"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {isExpanded ? 'Show Less' : 'More Emotions'}
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Main Emotions */}
        {EMOTIONS.slice(0, 6).map((emotion) => {
          const style = getEmotionStyle(emotion.name, selected === emotion.name);
          return (
            <motion.button
              key={emotion.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(emotion.name)}
              style={style}
              className={clsx(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border transition-all duration-300 backdrop-blur-md",
                selected === emotion.name
                  ? "border-transparent shadow-lg shadow-white/10 font-bold"
                  : isDark
                    ? "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/10"
                    : "bg-black/5 border-black/5 text-gray-600 hover:bg-black/10 hover:text-gray-900 hover:border-black/10"
              )}
            >
              <span className="text-base filter drop-shadow-md">{emotion.emoji}</span>
              {emotion.name}
            </motion.button>
          )
        })}

        {/* More Emotions */}
        <AnimatePresence>
          {isExpanded && (
            <>
              {EMOTIONS.slice(6).map((emotion, index) => {
                const style = getEmotionStyle(emotion.name, selected === emotion.name);
                return (
                  <motion.button
                    key={emotion.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect(emotion.name)}
                    style={style}
                    className={clsx(
                      "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border transition-all duration-300 backdrop-blur-md",
                      selected === emotion.name
                        ? "border-transparent shadow-lg shadow-white/10 font-bold"
                        : isDark
                          ? "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/10"
                          : "bg-black/5 border-black/5 text-gray-600 hover:bg-black/10 hover:text-gray-900 hover:border-black/10"
                    )}
                  >
                    <span className="text-base filter drop-shadow-md">{emotion.emoji}</span>
                    {emotion.name}
                  </motion.button>
                )
              })}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
