import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EmotionPicker } from '../components/entry/EmotionPicker';
import { PresetTasks } from '../components/entry/PresetTasks';
import { Loading } from '../components/common/Loading';
import { GlassButton } from '../components/ui/GlassButton';
import { entryApi } from '../services/api';
import { useEntryStore } from '../stores/entryStore';
import { useThemeStore } from '../stores/themeStore';
import { Send, Image as ImageIcon, X, Mic, ScanLine } from 'lucide-react';
import clsx from 'clsx';

interface Sticker {
  id: string;
  url: string;
  x: number;
  y: number;
  rotation: number;
}

export function HomePage() {
  const navigate = useNavigate();
  const { setCurrentResult, isLoading, setLoading } = useEntryStore();
  const { theme } = useThemeStore();

  const [content, setContent] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isRecording, setIsRecording] = useState(false);

  const isDark = theme === 'dark';

  // AI 动态引导词
  const guidingPrompts = [
    '今天在学校遇到了什么有意思的事吗？',
    '最近有什么让你开心或烦恼的事情吗？',
    '今天的心情怎么样？想聊聊吗？',
    '有没有什么想要记录下来的瞬间？',
    '今天学到了什么新东西吗？',
  ];
  const [currentPrompt] = useState(() =>
    guidingPrompts[Math.floor(Math.random() * guidingPrompts.length)]
  );

  const handleSubmit = async () => {
    if (content.length < 10) return;

    setLoading(true);
    try {
      const images = stickers.map(s => s.url);
      const mainImage = images.length > 0 ? images[0] : undefined;

      const response = await entryApi.create({
        content,
        imageUrl: mainImage,
        images: images.length > 0 ? images : undefined,
        emotionPrimary: selectedEmotion || undefined,
      });

      if (response.code === 200 && response.data) {
        setCurrentResult(response.data);
        navigate(`/result/${response.data.entry.id}`);
      }
    } catch (error: any) {
      console.error('Failed to create entry:', error);
      // 区分错误类型，给用户更明确的提示
      const errorMessage = error?.message || error?.error || '创建日记失败，请重试';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (presetContent: string, emotion: string) => {
    setContent(presetContent);
    setSelectedEmotion(emotion);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newSticker: Sticker = {
            id: Math.random().toString(36).substr(2, 9),
            url: event.target.result as string,
            x: Math.random() * 200 + 50,
            y: Math.random() * 200 + 100,
            rotation: Math.random() * 20 - 10,
          };
          setStickers(prev => [...prev, newSticker]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSticker = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStickers(prev => prev.filter(s => s.id !== id));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isOpen) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left - 75;
            const y = e.clientY - rect.top - 75;

            const newSticker: Sticker = {
              id: Math.random().toString(36).substr(2, 9),
              url: event.target.result as string,
              x: Math.max(0, x),
              y: Math.max(0, y),
              rotation: Math.random() * 20 - 10,
            };
            setStickers(prev => [...prev, newSticker]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };


  const today = new Date();
  const dateStr = today.toLocaleDateString('zh-CN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const hour = today.getHours();
  const greeting = hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好';

  return (
    <>
      {isLoading && <Loading />}

      <div className="max-w-5xl mx-auto space-y-8 pb-20 perspective-[2000px]">
        {/* Header - 随页面滚动，不再锁定 */}
        <motion.header
          initial={{ opacity: 0, y: -20, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left md:flex md:items-end md:justify-between z-40 transform-style-3d translate-z-10"
        >
          <div>
            <p className="text-[var(--accent-primary)] font-medium tracking-wide mb-1 uppercase text-xs font-mono">
              {dateStr}
            </p>
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">
              {greeting}
            </h1>
          </div>
        </motion.header>

        {/* 3D Book Container */}
        <div className="relative w-full h-[700px] flex justify-center items-center py-10">
          <motion.div
            className="relative w-full h-full max-w-4xl cursor-pointer md:cursor-default"
            initial={false}
            animate={isOpen ? "open" : "closed"}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* === INSIDE PAGE === */}
            <div
              className={clsx(
                "absolute inset-0 rounded-r-2xl rounded-l-md shadow-2xl overflow-hidden flex flex-col z-0",
                "bg-[var(--book-page)] border-r-[8px] border-[var(--book-binding)]"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {/* Paper Texture Grid */}
              <div className={clsx(
                "absolute inset-0 pointer-events-none z-0",
                isDark ? "opacity-20" : "opacity-10"
              )}
                style={{
                  backgroundImage: `
                    linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px),
                    linear-gradient(${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Binding Effect */}
              <div className={clsx(
                "absolute left-0 top-0 bottom-0 w-16 pointer-events-none z-10",
                isDark
                  ? "bg-gradient-to-r from-black/50 to-transparent"
                  : "bg-gradient-to-r from-black/10 to-transparent"
              )} />

              {/* Content Overlay */}
              <div
                className="relative z-10 p-12 h-full flex flex-col justify-between ml-8"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {/* Stickers */}
                {stickers.map((sticker) => (
                  <motion.div
                    key={sticker.id}
                    className={clsx(
                      "absolute max-w-[150px] shadow-lg border-2 rounded-lg overflow-hidden group",
                      isDark ? "border-white/10" : "border-black/10"
                    )}
                    style={{
                      left: sticker.x,
                      top: sticker.y,
                      rotate: sticker.rotation,
                      cursor: 'grab'
                    }}
                    drag
                    dragMomentum={false}
                    whileDrag={{ scale: 1.1, cursor: 'grabbing', zIndex: 100 }}
                  >
                    <img src={sticker.url} alt="Sticker" className="w-full h-auto pointer-events-none" />
                    <button
                      onClick={(e) => removeSticker(sticker.id, e)}
                      className={clsx(
                        "absolute top-1 right-1 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity",
                        isDark ? "bg-black/50 text-white" : "bg-white/80 text-gray-700"
                      )}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}

                {/* Header: Date & Mood */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className={clsx(
                      "text-4xl font-serif font-bold tracking-tight",
                      isDark ? "text-white/90" : "text-gray-800"
                    )}>
                      {today.toLocaleDateString('zh-CN', { weekday: 'long' })}
                    </span>
                    <span className={clsx(
                      "text-lg font-serif italic",
                      isDark ? "text-white/50" : "text-gray-500"
                    )}>
                      {today.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="scale-90 origin-top-right relative z-50">
                    <EmotionPicker
                      selected={selectedEmotion}
                      onSelect={setSelectedEmotion}
                    />
                  </div>
                </div>

                {/* Writing Area */}
                <div className="flex-1 relative z-20">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={currentPrompt}
                    className={clsx(
                      "w-full h-full bg-transparent border-none outline-none resize-none text-xl leading-[2rem] font-serif scrollbar-none",
                      isDark
                        ? "text-slate-200 placeholder:text-slate-600"
                        : "text-gray-700 placeholder:text-gray-400"
                    )}
                    style={{ lineHeight: '2rem' }}
                    spellCheck={false}
                    disabled={!isOpen}
                  />
                </div>

                {/* Footer & Actions */}
                  <div className="flex items-center justify-between mt-8 pt-4 border-t"
                    style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  >
                    <div className={clsx(
                      "text-xs font-mono flex gap-4 items-center",
                      isDark ? "text-slate-500" : "text-gray-500"
                    )}>
                      <span>{content.length} 字</span>
                      <div className="flex items-center gap-3 ml-4">
                        {/* 识别手写/文字按钮 */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 text-[var(--accent-primary)] hover:opacity-80 transition-colors"
                          title="识别手写/文字"
                        >
                          <ScanLine className="w-4 h-4" />
                          <span className="hidden sm:inline">识别手写</span>
                        </button>
                        {/* 语音输入按钮 */}
                        <button
                          onClick={() => setIsRecording(!isRecording)}
                          className={clsx(
                            "flex items-center gap-2 transition-colors",
                            isRecording
                              ? "text-red-500 animate-pulse"
                              : "text-[var(--accent-primary)] hover:opacity-80"
                          )}
                          title="语音输入"
                        >
                          <Mic className="w-4 h-4" />
                          <span className="hidden sm:inline">{isRecording ? '录音中...' : '语音输入'}</span>
                        </button>
                      </div>
                    </div>

                  <GlassButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubmit();
                    }}
                    disabled={content.length < 10 || isLoading}
                    size="lg"
                    className="bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white shadow-lg shadow-purple-900/40"
                    icon={<Send className="w-4 h-4" />}
                  >
                    {isLoading ? '传输中...' : '保存日志'}
                  </GlassButton>
                </div>
              </div>
            </div>

            {/* === FRONT COVER === */}
            <motion.div
              className={`absolute inset-0 origin-left z-30 cursor-pointer ${isOpen ? 'pointer-events-none' : ''}`}
              variants={{
                closed: { rotateY: 0 },
                open: { rotateY: -150 }
              }}
              transition={{ duration: 1.4, type: "spring", stiffness: 30, damping: 12 }}
              style={{ transformStyle: "preserve-3d" }}
              onClick={() => setIsOpen(!isOpen)}
            >
              {/* Front Face */}
              <div
                className={clsx(
                  "absolute inset-0 rounded-r-2xl rounded-l-md shadow-2xl overflow-hidden border",
                  "bg-[var(--book-cover)]",
                  isDark ? "border-white/5" : "border-black/10"
                )}
                style={{ backfaceVisibility: "hidden" }}
              >
                {/* Nebula Texture */}
                <div className={clsx(
                  "absolute inset-0 opacity-80",
                  isDark
                    ? "bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black"
                    : "bg-gradient-to-br from-purple-100/60 via-indigo-100/40 to-white"
                )} />
                <div className={clsx(
                  "absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] animate-spin-[120s]",
                  isDark ? "opacity-[0.03]" : "opacity-[0.02]"
                )} />

                {/* Glowing Orb */}
                <div className={clsx(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[60px] animate-pulse-glow",
                  isDark
                    ? "bg-gradient-to-tr from-purple-500/10 to-blue-600/10"
                    : "bg-gradient-to-tr from-purple-300/20 to-blue-400/20"
                )} />

                {/* Title Block */}
                <div className={clsx(
                  "absolute inset-0 flex flex-col items-center justify-center p-8 m-4 border rounded-xl backdrop-blur-sm",
                  isDark
                    ? "border-white/5 bg-black/20"
                    : "border-black/5 bg-white/40"
                )}>
                  <div className={clsx(
                    "w-20 h-20 mb-8 rounded-full border flex items-center justify-center",
                    isDark
                      ? "border-white/10 bg-gradient-to-b from-white/5 to-transparent"
                      : "border-black/10 bg-gradient-to-b from-black/5 to-transparent"
                  )}>
                    <span className="text-3xl">🌌</span>
                  </div>
                  <h2 className={clsx(
                    "text-6xl font-serif tracking-[-0.02em] text-center mb-6",
                    isDark
                      ? "text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400"
                      : "text-transparent bg-clip-text bg-gradient-to-b from-gray-800 to-gray-500"
                  )}>
                    心灵奇记
                  </h2>
                  <p className={clsx(
                    "text-xs tracking-[0.4em] uppercase font-mono",
                    isDark ? "text-purple-300/80" : "text-purple-600/80"
                  )}>
                    个人日志
                  </p>
                </div>
              </div>

              {/* Back Face */}
              <div
                className={clsx(
                  "absolute inset-0 rounded-l-2xl rounded-r-md border-l flex items-center justify-center transform rotate-y-180",
                  "bg-[var(--book-page)]",
                  isDark ? "border-black/20" : "border-black/10"
                )}
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="p-12 text-center opacity-40">
                  <p className={clsx(
                    "font-serif text-3xl mb-6 leading-relaxed",
                    isDark ? "text-white" : "text-gray-700"
                  )}>
                    "沉默是上帝的语言，其他一切都是拙劣的翻译。"
                  </p>
                  <div className={clsx(
                    "w-12 h-0.5 mx-auto",
                    isDark ? "bg-white/20" : "bg-black/20"
                  )} />
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>

        {/* Preset Tasks */}
        <motion.div
          className="flex justify-center relative z-0"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 50 }}
          transition={{ delay: 0.6 }}
        >
          {isOpen && <PresetTasks onSelect={handlePresetSelect} />}
        </motion.div>
      </div>
    </>
  );
}
