import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { Compass, Book, Flower2, Clock, LogOut, User, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const { user, logout } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();
    const location = useLocation();

    const navItems = [
        { path: '/', label: '心灵日记', icon: Book },
        { path: '/garden', label: '灵魂花园', icon: Flower2 },
        { path: '/timeline', label: '时光轴', icon: Clock },
    ];

    const isDark = theme === 'dark';

    return (
        <div className={clsx(
            "flex h-screen w-full overflow-hidden relative font-sans perspective-[2000px]",
            "bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-[var(--accent-primary)]/30"
        )}>
            {/* Background Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className={clsx(
                    "absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] animate-pulse-glow",
                    isDark ? "bg-purple-900/20" : "bg-purple-200/40"
                )} />
                <div className={clsx(
                    "absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] animate-pulse-glow",
                    isDark ? "bg-blue-900/20" : "bg-blue-200/30"
                )} style={{ animationDelay: '2s' }} />
                <div className={clsx(
                    "absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay",
                    isDark ? "opacity-10" : "opacity-5"
                )} />
            </div>

            {/* Sidebar */}
            <aside
                className={clsx(
                    "w-20 lg:w-64 h-full glass-panel z-50 flex flex-col justify-between py-6 transition-all duration-300 backdrop-blur-xl",
                    "border-r border-[var(--border-primary)]",
                    isDark ? "bg-black/20" : "bg-white/60"
                )}
                style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}
            >
                <div>
                    {/* Logo */}
                    <div className="px-6 mb-10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
                            <Compass className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight hidden lg:block text-[var(--text-primary)]">
                            心灵奇记
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="px-3 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={clsx(
                                        "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                        isActive
                                            ? clsx(
                                                "shadow-sm border",
                                                isDark
                                                    ? "bg-white/10 text-white border-white/10"
                                                    : "bg-black/5 text-[var(--text-primary)] border-black/10"
                                            )
                                            : clsx(
                                                isDark
                                                    ? "text-slate-400 hover:text-white hover:bg-white/5"
                                                    : "text-gray-500 hover:text-[var(--text-primary)] hover:bg-black/5"
                                            )
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active"
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent-primary)] rounded-r-full"
                                        />
                                    )}
                                    <Icon className={clsx(
                                        "w-6 h-6 shrink-0",
                                        isActive
                                            ? "text-[var(--accent-primary)]"
                                            : "group-hover:text-[var(--accent-primary)] transition-colors"
                                    )} />
                                    <span className="font-medium hidden lg:block whitespace-nowrap">{item.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Section */}
                <div className="px-3 space-y-3">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={clsx(
                            "w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl transition-all duration-300",
                            isDark
                                ? "text-slate-400 hover:text-white hover:bg-white/5"
                                : "text-gray-500 hover:text-[var(--text-primary)] hover:bg-black/5"
                        )}
                        title={isDark ? "切换到浅色模式" : "切换到深色模式"}
                    >
                        {isDark ? (
                            <Sun className="w-6 h-6 shrink-0" />
                        ) : (
                            <Moon className="w-6 h-6 shrink-0" />
                        )}
                        <span className="font-medium hidden lg:block whitespace-nowrap">
                            {isDark ? '浅色模式' : '深色模式'}
                        </span>
                    </button>

                    {/* User Profile */}
                    <div className={clsx(
                        "p-4 rounded-xl border flex items-center gap-3 hidden lg:flex",
                        isDark
                            ? "bg-white/5 border-white/5"
                            : "bg-black/5 border-black/5"
                    )}>
                        <div className={clsx(
                            "w-10 h-10 rounded-full flex items-center justify-center border shrink-0",
                            isDark
                                ? "bg-gradient-to-br from-slate-700 to-slate-900 border-white/10 text-slate-300"
                                : "bg-gradient-to-br from-gray-100 to-gray-200 border-black/10 text-gray-600"
                        )}>
                            <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                                {user?.nickname || user?.username || '旅行者'}
                            </p>
                            <p className="text-xs text-[var(--text-muted)] truncate">心灵探索者</p>
                        </div>
                        <button
                            onClick={logout}
                            className={clsx(
                                "p-2 rounded-lg transition-colors",
                                isDark
                                    ? "hover:bg-white/10 text-slate-400 hover:text-red-400"
                                    : "hover:bg-black/10 text-gray-400 hover:text-red-500"
                            )}
                            title="退出登录"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mobile Logout */}
                    <button
                        onClick={logout}
                        className={clsx(
                            "lg:hidden w-full flex justify-center p-3 rounded-xl transition-colors",
                            isDark
                                ? "text-slate-400 hover:text-red-400 hover:bg-white/5"
                                : "text-gray-400 hover:text-red-500 hover:bg-black/5"
                        )}
                    >
                        <LogOut className="w-6 h-6" />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className="flex-1 relative z-10 overflow-y-auto overflow-x-hidden p-6 lg:p-10"
                style={{ transformStyle: "preserve-3d" }}
            >
                <div className="max-w-7xl mx-auto h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
