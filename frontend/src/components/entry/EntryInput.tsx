import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../stores/themeStore';
import clsx from 'clsx';


interface EntryInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
}

export function EntryInput({
  value,
  onChange,
  placeholder = '在这里写下你的想法...',
  minLength = 10,
  maxLength = 5000,
}: EntryInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // Auto-resize
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(200, textarea.scrollHeight)}px`;
    }
  }, [value]);

  const charCount = value.length;

  return (
    <div className="relative">
      <motion.div
        animate={{
          boxShadow: isFocused
            ? '0 0 0 2px rgba(139, 92, 246, 0.2)'
            : '0 0 0 0px rgba(0,0,0,0)',
        }}
        className={clsx(
          "rounded-xl overflow-hidden border",
          isDark
            ? "bg-slate-900/50 border-slate-700"
            : "bg-white border-gray-300"
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={clsx(
            "w-full bg-transparent p-4 outline-none resize-none min-h-[200px] text-base leading-relaxed",
            isDark
              ? "text-white placeholder-slate-500"
              : "text-gray-900 placeholder-gray-400"
          )}
          maxLength={maxLength}
        />
      </motion.div>

      {/* Char Count */}
      <div className="flex items-center justify-between mt-2 px-1">
        <span className="text-xs font-medium">
          {charCount < minLength && (
            <span className="text-amber-500">
              还需要 {minLength - charCount} 个字符
            </span>
          )}
        </span>
        <span
          className={clsx(
            "text-xs font-medium",
            charCount > maxLength * 0.9
              ? 'text-amber-500'
              : isDark ? 'text-slate-500' : 'text-gray-500'
          )}
        >
          {charCount} / {maxLength}
        </span>
      </div>
    </div>
  );
}
