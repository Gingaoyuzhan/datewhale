import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WeatherCard } from '../components/result/WeatherCard';
import { PassageCard } from '../components/result/PassageCard';
import { InsightCard } from '../components/result/InsightCard';
import { GardenUpdateCard } from '../components/result/GardenUpdateCard';
import { Loading } from '../components/common/Loading';
import { GlassButton } from '../components/ui/GlassButton';
import { useEntryStore } from '../stores/entryStore';
import { useThemeStore } from '../stores/themeStore';
import { entryApi } from '../services/api';
import type { CreateEntryResponse } from '../types';
import { ArrowLeft, BookOpen, Flower2 } from 'lucide-react';
import clsx from 'clsx';

export function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentResult, setCurrentResult } = useEntryStore();
  const { theme } = useThemeStore();
  const [loading, setLoading] = useState(false);
  const [activeMatch, setActiveMatch] = useState(0);

  const isDark = theme === 'dark';

  useEffect(() => {
    if (!currentResult && id) {
      setLoading(true);
      entryApi.getById(Number(id))
        .then((response) => {
          if (response.code === 200 && response.data) {
            const result: CreateEntryResponse = {
              entry: response.data,
              analysis: {
                emotions: [],
                keywords: response.data.keywords || [],
                imagery: response.data.imagery || [],
                scenes: response.data.scenes || [],
                psychologicalInsight: response.data.psychologicalInsight || '',
              },
              matches: response.data.matches || [],
              gardenUpdates: [],
            };
            setCurrentResult(result);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, currentResult, setCurrentResult]);

  if (loading) return <Loading />;

  if (!currentResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 text-center">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">未找到日记</h2>
        <p className="text-[var(--text-muted)]">你寻找的日记似乎已经消失在虚空中。</p>
        <Link to="/">
          <GlassButton variant="secondary">返回首页</GlassButton>
        </Link>
      </div>
    );
  }

  const { entry, analysis, matches, gardenUpdates } = currentResult;

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-12">
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <button
          onClick={() => {
            setCurrentResult(null);
            navigate('/');
          }}
          className={clsx(
            "flex items-center gap-2 transition-colors group",
            isDark
              ? "text-slate-400 hover:text-white"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          返回旅程
        </button>
      </motion.div>

      {/* Header Section */}
      <section className="space-y-8">
        <WeatherCard
          weatherType={entry.weatherType}
          emotion={entry.emotionPrimary}
          intensity={entry.emotionIntensity}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center px-4"
        >
          <QuoteIcon className={clsx(
            "w-8 h-8 mx-auto mb-4",
            isDark ? "text-slate-600" : "text-gray-300"
          )} />
          <p className={clsx(
            "text-lg font-serif italic leading-relaxed",
            isDark ? "text-slate-300" : "text-gray-600"
          )}>
            "{entry.content}"
          </p>
        </motion.div>
      </section>

      {/* Matches Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2 text-[var(--accent-primary)]">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-bold tracking-widest uppercase">文学共鸣</span>
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            来自过去的回响
          </h2>
        </motion.div>

        <div className="space-y-6">
          {matches.length > 0 ? (
            matches.map((match, index) => (
              <PassageCard
                key={match.passage.id}
                match={match}
                isActive={activeMatch === index}
                onClick={() => setActiveMatch(index)}
              />
            ))
          ) : (
            <div className={clsx(
              "text-center py-12 rounded-2xl border",
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-gray-50 border-gray-200"
            )}>
              <p className="text-[var(--text-muted)]">暂未找到共鸣。</p>
            </div>
          )}
        </div>
      </section>

      {/* Insights Section - 始终显示，无内容时显示提示 */}
      <section>
        <InsightCard
          insight={analysis.psychologicalInsight || ''}
          keywords={analysis.keywords}
          imagery={analysis.imagery}
        />
      </section>

      {/* Garden Updates Section */}
      {gardenUpdates.length > 0 && (
        <section>
          <GardenUpdateCard updates={gardenUpdates} />
        </section>
      )}

      {/* Footer Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={clsx(
          "flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t",
          isDark ? "border-white/10" : "border-gray-200"
        )}
      >
        <GlassButton
          onClick={() => {
            setCurrentResult(null);
            navigate('/');
          }}
          size="lg"
        >
          再写一篇
        </GlassButton>

        <Link to="/garden">
          <GlassButton variant="secondary" size="lg" icon={<Flower2 className="w-4 h-4" />}>
            访问心灵花园
          </GlassButton>
        </Link>
      </motion.div>
    </div>
  );
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
    </svg>
  )
}
