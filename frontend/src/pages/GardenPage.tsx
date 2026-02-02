import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gardenApi, entryApi } from '../services/api';
import { Loading } from '../components/common/Loading';
import { useThemeStore } from '../stores/themeStore';
import type { GardenPlant } from '../types';
import { Package, HelpCircle } from 'lucide-react';
import clsx from 'clsx';

// All available literary companions with their portrait images
const ALL_COMPANIONS = [
  { name: '李白', tag: '浪漫', image: '/authors/li_bai.png' },
  { name: '苏轼', tag: '豁达', image: '/authors/su_shi.png' },
  { name: '李清照', tag: '婉约', image: '/authors/li_qingzhao.png' },
  { name: '鲁迅', tag: '深刻', image: '/authors/lu_xun.png' },
  { name: '林徽因', tag: '灵动', image: '/authors/lin_huiyin.png' },
  { name: '莎士比亚', tag: '戏剧', image: '/authors/shakespeare.png' },
  { name: '泰戈尔', tag: '灵性', image: '/authors/tagore.png' },
  { name: '海明威', tag: '硬朗', image: '/authors/hemingway.png' },
  { name: '川端康成', tag: '细腻', image: '/authors/kawabata.png' },
  { name: '加缪', tag: '荒诞', image: '/authors/camus.png' },
  { name: '待解锁', tag: '', image: '' },
  { name: '待解锁', tag: '', image: '' },
];

export function GardenPage() {
  const [plants, setPlants] = useState<GardenPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const [entryCount, setEntryCount] = useState(0);
  const { theme } = useThemeStore();

  const isDark = theme === 'dark';

  useEffect(() => {
    Promise.all([
      gardenApi.getPlants(),
      entryApi.getList(1, 1)
    ]).then(([plantsRes, entriesRes]) => {
      if (plantsRes.code === 200 && plantsRes.data) {
        setPlants(plantsRes.data);
      }
      if (entriesRes.code === 200 && entriesRes.data?.pagination) {
        setEntryCount(entriesRes.data.pagination.total);
      }
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const unlockedNames = new Set(plants.map(p => p.authorName));
  const unlockedCount = plants.length;

  return (
    <div className="max-w-lg mx-auto min-h-screen flex flex-col pb-24 relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-8 px-2"
      >
        <h1 className="text-3xl font-serif text-[var(--text-primary)] mb-2 tracking-tight">
          我的文学同伴
        </h1>
        <p className="text-[var(--text-muted)] text-sm">
          已解锁 <span className="text-[var(--accent-primary)] font-bold">{unlockedCount}</span>/{ALL_COMPANIONS.length}
        </p>
      </motion.div>

      {/* Companions Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4 px-2 flex-1"
      >
        {ALL_COMPANIONS.map((companion, index) => {
          const isLocked = companion.name === '待解锁' || !unlockedNames.has(companion.name);

          if (isLocked) {
            return <LockedCard key={`slot-${index}`} delay={index * 0.03} isDark={isDark} />;
          }

          return (
            <CompanionCard
              key={companion.name}
              name={companion.name}
              tag={companion.tag}
              image={companion.image}
              delay={index * 0.03}
              isDark={isDark}
            />
          );
        })}
      </motion.div>

      {/* Memory Box Footer - 半透明毛玻璃效果 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-lg z-40"
      >
        <button className={clsx(
          "w-full flex items-center justify-between px-6 py-4 rounded-2xl shadow-lg backdrop-blur-xl border",
          isDark
            ? "bg-purple-900/60 border-purple-500/30 text-white"
            : "bg-purple-100/80 border-purple-300 text-purple-900"
        )}>
          <div className="flex items-center gap-3">
            <Package className={clsx(
              "w-6 h-6",
              isDark ? "text-amber-300" : "text-amber-600"
            )} />
            <span className="font-bold text-lg">记忆盒</span>
          </div>
          <span className={isDark ? "text-white/80" : "text-purple-700"}>{entryCount}封信</span>
        </button>
      </motion.div>
    </div>
  );
}

// --- Sub-Components ---

interface CompanionCardProps {
  name: string;
  tag: string;
  image: string;
  delay: number;
  isDark: boolean;
}

function CompanionCard({ name, tag, image, delay, isDark }: CompanionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={clsx(
        "backdrop-blur-sm border rounded-2xl p-5 flex flex-col items-center text-center transition-colors cursor-pointer group",
        isDark
          ? "bg-white/5 border-white/10 hover:bg-white/10"
          : "bg-black/5 border-black/10 hover:bg-black/10"
      )}
    >
      {/* Portrait Image */}
      <div className={clsx(
        "w-20 h-20 rounded-full mb-4 overflow-hidden shadow-lg ring-2 transition-all",
        isDark
          ? "ring-white/10 group-hover:ring-purple-500/50"
          : "ring-black/10 group-hover:ring-purple-500/50"
      )}>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="text-[var(--text-primary)] font-bold text-lg mb-1">{name}</h3>
      <p className="text-[var(--text-muted)] text-sm">{tag}</p>
    </motion.div>
  );
}

function LockedCard({ delay, isDark }: { delay: number; isDark: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={clsx(
        "backdrop-blur-sm border border-dashed rounded-2xl p-5 flex flex-col items-center text-center opacity-50",
        isDark
          ? "bg-white/[0.02] border-white/5"
          : "bg-black/[0.02] border-black/10"
      )}
    >
      {/* Locked Avatar */}
      <div className={clsx(
        "w-20 h-20 rounded-full mb-4 flex items-center justify-center border border-dashed",
        isDark
          ? "bg-slate-800/50 border-slate-600"
          : "bg-gray-200/50 border-gray-400"
      )}>
        <HelpCircle className={clsx(
          "w-8 h-8",
          isDark ? "text-slate-600" : "text-gray-400"
        )} />
      </div>

      <p className="text-[var(--text-muted)] text-sm">待解锁</p>
    </motion.div>
  );
}
