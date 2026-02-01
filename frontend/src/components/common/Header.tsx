import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import clsx from 'clsx';

export function Header() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const navItems = [
    { path: '/', label: '记录', icon: '笔' },
    { path: '/garden', label: '花园', icon: '园' },
    { path: '/timeline', label: '时光', icon: '轴' },
  ];

  return (
    <header className="nav-header">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className={clsx(
            "w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:scale-105",
            isDark ? "bg-white" : "bg-ink-800"
          )}>
            <span className={clsx(
              "font-brush text-lg",
              isDark ? "text-slate-900" : "text-paper-warm"
            )}>记</span>
          </div>
          <h1 className={clsx(
            "font-elegant text-xl hidden sm:block",
            isDark ? "text-white" : "text-ink-800"
          )}>
            心灵奇记
          </h1>
        </Link>

        {/* Navigation */}
        {isAuthenticated && (
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-4 py-2 rounded-xl transition-all duration-300"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className={clsx(
                        "absolute inset-0 rounded-xl",
                        isDark ? "bg-white" : "bg-ink-800"
                      )}
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <span
                    className={clsx(
                      "relative z-10 flex items-center gap-2 text-sm font-medium tracking-wide",
                      isActive
                        ? isDark ? "text-slate-900" : "text-paper-warm"
                        : isDark
                          ? "text-slate-400 hover:text-white"
                          : "text-ink-500 hover:text-ink-800"
                    )}
                  >
                    <span className="font-brush text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className={clsx(
                "text-sm font-literary hidden sm:block",
                isDark ? "text-slate-400" : "text-ink-500"
              )}>
                {user?.nickname || user?.username}
              </span>
              <button
                onClick={logout}
                className={clsx(
                  "text-sm transition-colors",
                  isDark
                    ? "text-slate-500 hover:text-red-400"
                    : "text-ink-400 hover:text-vermilion-500"
                )}
              >
                退出
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-primary text-sm py-2 px-5"
            >
              登录
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
