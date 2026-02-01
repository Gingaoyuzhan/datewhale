import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authApi } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { GlassInput } from '../components/ui/GlassInput';
import { GlassButton } from '../components/ui/GlassButton';
import { User, Mail, Lock, Sparkles, ArrowRight, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';

// Particle component for "Soul Dust"
const SoulParticles = ({ isDark }: { isDark: boolean }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={clsx(
            "absolute rounded-full blur-[1px]",
            isDark ? "bg-white/20" : "bg-purple-500/20"
          )}
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: Math.random() * 0.5 + 0.2,
            opacity: Math.random() * 0.3 + 0.1
          }}
          animate={{
            y: [null, Math.random() * -100 + "%"],
            opacity: [null, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            width: Math.random() * 4 + 1 + "px",
            height: Math.random() * 4 + 1 + "px",
          }}
        />
      ))}
    </div>
  );
};

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    nickname: '',
  });

  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await authApi.login({
          username: formData.username,
          password: formData.password,
        });
        if (response.code === 200 && response.data) {
          setAuth(response.data.user, response.data.token);
          navigate('/');
        } else {
          setError(response.message || 'Login failed');
        }
      } else {
        const response = await authApi.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          nickname: formData.nickname,
        });
        if (response.code === 200 && response.data) {
          setAuth(response.data.user, response.data.token);
          navigate('/');
        } else {
          setError(response.message || 'Registration failed');
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={clsx(
      "min-h-screen flex items-center justify-center px-4 relative overflow-hidden font-sans",
      "bg-[var(--bg-primary)]"
    )}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={clsx(
          "absolute top-6 right-6 p-3 rounded-xl transition-all duration-300 z-50",
          isDark
            ? "bg-white/10 text-white hover:bg-white/20"
            : "bg-black/5 text-gray-700 hover:bg-black/10"
        )}
        title={isDark ? "切换到浅色模式" : "切换到深色模式"}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className={clsx(
            "absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full blur-[150px]",
            isDark ? "bg-[#4A00E0]/10" : "bg-purple-300/30"
          )}
        />
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className={clsx(
            "absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full blur-[150px]",
            isDark ? "bg-[#8E2DE2]/10" : "bg-indigo-300/30"
          )}
        />
        <SoulParticles isDark={isDark} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-flex mb-6 relative"
          >
            {/* Glowing Orb Logo */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#4A00E0] to-[#8E2DE2] flex items-center justify-center shadow-[0_0_50px_rgba(142,45,226,0.4)] relative">
              <div className="absolute inset-0 rounded-full bg-white/10 blur-xl animate-pulse-glow" />
              <Sparkles className="w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            </div>
          </motion.div>

          <h1 className={clsx(
            "text-5xl font-serif tracking-tight mb-3 drop-shadow-sm",
            isDark
              ? "text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70"
              : "text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600"
          )}>
            SoulSync
          </h1>
          <p className="text-[var(--text-muted)] font-light tracking-widest uppercase text-xs">
            Where your soul finds its place
          </p>
        </div>

        {/* Form */}
        <div className="backdrop-blur-[2px]">
          {/* Toggle */}
          <div className="flex justify-center gap-8 mb-10 text-sm">
            <button
              onClick={() => setIsLogin(true)}
              className={clsx(
                "pb-1 transition-all duration-500",
                isLogin
                  ? "text-[var(--text-primary)] border-b border-[var(--accent-primary)] shadow-[0_4px_10px_-4px_var(--accent-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={clsx(
                "pb-1 transition-all duration-500",
                !isLogin
                  ? "text-[var(--text-primary)] border-b border-[var(--accent-primary)] shadow-[0_4px_10px_-4px_var(--accent-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              Join Us
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                "mb-6 text-center text-xs tracking-wide py-2 rounded-lg border",
                isDark
                  ? "text-red-300 bg-red-900/10 border-red-500/20"
                  : "text-red-600 bg-red-50 border-red-200"
              )}
            >
              {error}
            </motion.div>
          )}

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <GlassInput
                icon={<User className="w-4 h-4 text-[var(--accent-primary)]/50" />}
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className={clsx(
                  "!rounded-xl !h-12 !backdrop-blur-sm transition-all duration-500",
                  isDark
                    ? "!bg-white/5 !border-white/5 focus:!border-purple-500/50 !text-slate-200 placeholder:!text-slate-600 hover:!bg-white/10"
                    : "!bg-black/5 !border-black/5 focus:!border-purple-500/50 !text-gray-800 placeholder:!text-gray-400 hover:!bg-black/10"
                )}
              />

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <GlassInput
                    icon={<Mail className="w-4 h-4 text-[var(--accent-primary)]/50" />}
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className={clsx(
                      "!rounded-xl !h-12 !backdrop-blur-sm transition-all duration-500",
                      isDark
                        ? "!bg-white/5 !border-white/5 focus:!border-purple-500/50 !text-slate-200 placeholder:!text-slate-600 hover:!bg-white/10"
                        : "!bg-black/5 !border-black/5 focus:!border-purple-500/50 !text-gray-800 placeholder:!text-gray-400 hover:!bg-black/10"
                    )}
                  />
                  <GlassInput
                    icon={<Sparkles className="w-4 h-4 text-[var(--accent-primary)]/50" />}
                    placeholder="Nickname (Optional)"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    className={clsx(
                      "!rounded-xl !h-12 !backdrop-blur-sm transition-all duration-500",
                      isDark
                        ? "!bg-white/5 !border-white/5 focus:!border-purple-500/50 !text-slate-200 placeholder:!text-slate-600 hover:!bg-white/10"
                        : "!bg-black/5 !border-black/5 focus:!border-purple-500/50 !text-gray-800 placeholder:!text-gray-400 hover:!bg-black/10"
                    )}
                  />
                </motion.div>
              )}

              <GlassInput
                icon={<Lock className="w-4 h-4 text-[var(--accent-primary)]/50" />}
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                className={clsx(
                  "!rounded-xl !h-12 !backdrop-blur-sm transition-all duration-500",
                  isDark
                    ? "!bg-white/5 !border-white/5 focus:!border-purple-500/50 !text-slate-200 placeholder:!text-slate-600 hover:!bg-white/10"
                    : "!bg-black/5 !border-black/5 focus:!border-purple-500/50 !text-gray-800 placeholder:!text-gray-400 hover:!bg-black/10"
                )}
              />
            </div>

            <GlassButton
              type="submit"
              variant="primary"
              className="w-full h-12 mt-8 text-sm tracking-widest uppercase bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] hover:opacity-90 shadow-[0_0_20px_rgba(142,45,226,0.3)] border-none"
              isLoading={loading}
              icon={!loading && <ArrowRight className="w-4 h-4" />}
            >
              {isLogin ? 'Enter' : 'Ascend'}
            </GlassButton>
          </form>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-[var(--text-dim)] text-[10px] mt-12 tracking-widest uppercase"
        >
          Begin your inner exploration
        </motion.p>
      </motion.div>
    </div>
  );
}
