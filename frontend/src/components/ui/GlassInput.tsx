import { type InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import { useThemeStore } from '../../stores/themeStore';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    label?: string;
    error?: string;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
    ({ className, icon, label, error, ...props }, ref) => {
        const { theme } = useThemeStore();
        const isDark = theme === 'dark';

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-sm font-medium text-[var(--text-muted)] ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={clsx(
                            "w-full glass-input rounded-xl py-2.5 transition-all duration-300",
                            isDark
                                ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
                                : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50",
                            icon ? "pl-10 pr-4" : "px-4",
                            error ? "border-red-400 focus:border-red-500" : "",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs text-red-500 ml-1 animate-fade-in">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

GlassInput.displayName = "GlassInput";
