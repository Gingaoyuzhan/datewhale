import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

interface GlassButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: ReactNode;
    children?: ReactNode;
}

export function GlassButton({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    icon,
    disabled,
    ...props
}: GlassButtonProps) {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    const variants = {
        primary: "glass-button bg-gradient-to-r from-[var(--accent-primary)] to-indigo-600 hover:from-[var(--accent-secondary)] hover:to-indigo-500 border-[var(--border-accent)] text-white shadow-lg shadow-purple-500/20",
        secondary: isDark
            ? "bg-white/10 hover:bg-white/20 border-white/10 text-white backdrop-blur-md shadow-sm"
            : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900 backdrop-blur-md shadow-sm",
        ghost: isDark
            ? "bg-transparent hover:bg-white/10 text-slate-400 hover:text-white border-transparent"
            : "bg-transparent hover:bg-black/5 text-gray-600 hover:text-gray-900 border-transparent",
        danger: isDark
            ? "bg-red-900/20 hover:bg-red-900/30 border-red-500/30 text-red-400 hover:text-red-300"
            : "bg-red-50 hover:bg-red-100 border-red-200 text-red-600 hover:text-red-700",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
        md: "px-5 py-2.5 text-sm rounded-xl gap-2",
        lg: "px-8 py-3.5 text-base rounded-2xl gap-3",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={clsx(
                "inline-flex items-center justify-center font-medium transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/50 disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {!isLoading && icon && <span className="opacity-90">{icon}</span>}
            <span>{children}</span>
        </motion.button>
    );
}
