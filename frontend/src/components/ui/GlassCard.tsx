import { motion, type HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';
import { useThemeStore } from '../../stores/themeStore';

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'highlight' | 'interactive';
}

export function GlassCard({ children, className, variant = 'default', ...props }: GlassCardProps) {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    return (
        <motion.div
            className={clsx(
                "glass-card rounded-2xl p-6",
                variant === 'highlight' && (
                    isDark
                        ? "bg-purple-900/20 border-purple-500/30 shadow-lg shadow-purple-500/10"
                        : "bg-purple-50 border-purple-200 shadow-lg shadow-purple-500/10"
                ),
                variant === 'interactive' && (
                    isDark
                        ? "cursor-pointer hover:bg-white/10 hover:border-purple-500/30 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                        : "cursor-pointer hover:bg-white hover:border-purple-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                ),
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
