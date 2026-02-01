import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { statsApi } from '../services/api';
import { Loading } from '../components/common/Loading';
import { GlassCard } from '../components/ui/GlassCard';
import { useThemeStore } from '../stores/themeStore';
import { WEATHER_MAP } from '../types';
import type { EmotionCurveData, TimelineItem } from '../types';
import { Calendar, Activity, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export function TimelinePage() {
  const [curveData, setCurveData] = useState<EmotionCurveData[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useThemeStore();

  const isDark = theme === 'dark';

  useEffect(() => {
    Promise.all([
      statsApi.getEmotionCurve(30),
      statsApi.getTimeline(1, 50),
    ])
      .then(([curveRes, timelineRes]) => {
        if (curveRes.code === 200 && curveRes.data) {
          setCurveData(curveRes.data);
        }
        if (timelineRes.code === 200 && timelineRes.data) {
          setTimeline(timelineRes.data.timeline);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ECharts Theme-aware Configuration
  const chartOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? 'rgba(30, 27, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      textStyle: { color: isDark ? '#f8fafc' : '#171717' },
      className: 'backdrop-blur-md',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
      borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
    },
    xAxis: {
      type: 'category',
      data: curveData.map((d) => d.date.slice(5)),
      axisLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' } },
      axisLabel: { color: isDark ? '#94a3b8' : '#737373', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1,
      axisLine: { show: false },
      axisLabel: { color: isDark ? '#94a3b8' : '#737373', fontSize: 11 },
      splitLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } },
    },
    series: [
      {
        name: '强度',
        type: 'line',
        smooth: true,
        data: curveData.map((d) => d.intensity),
        lineStyle: { color: '#8b5cf6', width: 3, shadowColor: 'rgba(139, 92, 246, 0.3)', shadowBlur: 10 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(139, 92, 246, 0.2)' },
              { offset: 1, color: 'rgba(139, 92, 246, 0)' },
            ],
          },
        },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color: isDark ? '#1e1b2e' : '#ffffff', borderColor: '#8b5cf6', borderWidth: 2 },
      },
    ],
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">时间线</h1>
          <p className="text-[var(--text-muted)]">你的情感旅程。</p>
        </div>
        <div className="hidden md:block">
          <div className={clsx(
            "p-3 rounded-full border",
            isDark
              ? "bg-purple-900/20 border-purple-500/20"
              : "bg-purple-100 border-purple-200"
          )}>
            <Calendar className="w-6 h-6 text-[var(--accent-primary)]" />
          </div>
        </div>
      </motion.div>

      {/* Chart Section */}
      {curveData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-[var(--accent-primary)]" />
              <h2 className="text-lg font-medium text-[var(--text-primary)]">30天情绪曲线</h2>
            </div>
            <ReactECharts option={chartOption} style={{ height: 300 }} />
          </GlassCard>
        </motion.div>
      )}

      {/* Timeline List */}
      <div className="space-y-6 relative">
        {/* Vertical Line */}
        <div className={clsx(
          "absolute left-8 top-4 bottom-4 w-px bg-gradient-to-b from-transparent to-transparent",
          isDark ? "via-white/20" : "via-black/10"
        )} />

        {timeline.length > 0 ? (
          timeline.map((item, index) => {
            const weather = WEATHER_MAP[item.weather] || WEATHER_MAP['多云'];
            const date = new Date(item.date);
            const dateStr = date.toLocaleDateString('zh-CN', {
              month: 'short',
              day: 'numeric',
            });

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-20 group"
              >
                {/* Dot */}
                <div className={clsx(
                  "absolute left-[29px] top-6 w-3 h-3 rounded-full border-2 z-10 group-hover:scale-125 transition-transform",
                  isDark
                    ? "bg-[#1e1b2e] border-purple-500"
                    : "bg-white border-purple-500"
                )} />

                {/* Time Label */}
                <div className="absolute left-0 top-5 text-xs text-[var(--text-muted)] font-medium w-6 text-center">
                  {dateStr.split(' ')[0]} <br /> {dateStr.split(' ')[1]}
                </div>

                <Link to={`/result/${item.id}`} className="block">
                  <GlassCard
                    variant="interactive"
                    className={clsx(
                      "p-4 transition-all duration-300",
                      isDark
                        ? "group-hover:border-purple-500/30"
                        : "group-hover:border-purple-300"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={clsx(
                          "text-xl p-1.5 rounded-lg",
                          isDark ? "bg-white/5" : "bg-black/5"
                        )}>
                          {weather.icon}
                        </div>
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">{item.emotion}</p>
                          <p className="text-xs text-[var(--text-muted)]">{weather.name}</p>
                        </div>
                      </div>
                      <ChevronRight className={clsx(
                        "w-5 h-5 group-hover:translate-x-1 transition-all",
                        isDark
                          ? "text-slate-600 group-hover:text-purple-400"
                          : "text-gray-300 group-hover:text-purple-500"
                      )} />
                    </div>

                    <p className="text-[var(--text-secondary)] text-sm line-clamp-2 leading-relaxed">
                      {item.preview}
                    </p>

                    {item.keywords.length > 0 && (
                      <div className={clsx(
                        "flex flex-wrap gap-2 mt-4 pt-3 border-t",
                        isDark ? "border-white/5" : "border-black/5"
                      )}>
                        {item.keywords.slice(0, 3).map((keyword) => (
                          <span key={keyword} className="text-xs text-[var(--text-muted)]">
                            #{keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-20 pl-20">
            <p className="text-[var(--text-muted)]">时间似乎在这里静止了。</p>
          </div>
        )}
      </div>
    </div>
  );
}
