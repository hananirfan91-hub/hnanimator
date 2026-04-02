import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, EyeOff, Volume2, VolumeX, Share2, Twitter, MessageCircle, Link as LinkIcon, Check } from 'lucide-react';

export default function App() {
  const [name, setName] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [cleanMode, setCleanMode] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<{id: number, x: number, y: number, duration: number}[]>([]);
  
  // New features state
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  // Audio refs
  const hoverSound = useRef<HTMLAudioElement | null>(null);
  const typeSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    hoverSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    typeSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    if (hoverSound.current) hoverSound.current.volume = 0.4;
    if (typeSound.current) typeSound.current.volume = 0.2;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      duration: Math.random() * 5 + 5
    }));
    setParticles(newParticles);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.toUpperCase());
    if (soundEnabled && typeSound.current) {
      typeSound.current.currentTime = 0;
      typeSound.current.play().catch(() => {});
    }
  };

  const handleHoverEnter = () => {
    setIsHovered(true);
    if (soundEnabled && hoverSound.current && name.trim() !== '') {
      hoverSound.current.currentTime = 0;
      hoverSound.current.play().catch(() => {});
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out this aesthetic name animation! ✨`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFontSize = () => {
    const len = name.length;
    if (len < 5) return 'text-[25vw] md:text-[18vw]';
    if (len < 8) return 'text-[18vw] md:text-[14vw]';
    if (len < 12) return 'text-[12vw] md:text-[10vw]';
    if (len < 16) return 'text-[9vw] md:text-[7vw]';
    return 'text-[6vw] md:text-[4vw]';
  };

  return (
    <div 
      className="min-h-screen bg-[#030303] text-white flex flex-col relative overflow-hidden font-sans selection:bg-rose-500/30"
      onClick={() => {
        if (cleanMode) setCleanMode(false);
        if (showShare) setShowShare(false);
      }}
    >
      {/* Background ambient effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            x: (mousePos.x - window.innerWidth / 2) * 0.05,
            y: (mousePos.y - window.innerHeight / 2) * 0.05,
          }}
          className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-[#ff0050]/10 rounded-full blur-[120px] mix-blend-screen"
        />
        <motion.div 
          animate={{ 
            x: (mousePos.x - window.innerWidth / 2) * -0.05,
            y: (mousePos.y - window.innerHeight / 2) * -0.05,
          }}
          className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-[#00f2fe]/10 rounded-full blur-[120px] mix-blend-screen"
        />
        
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            initial={{ x: p.x, y: p.y }}
            animate={{
              y: [p.y, p.y - 500],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Top Bar (Name & Sound Toggle) */}
      <AnimatePresence>
        {!cleanMode && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-8 left-0 w-full px-8 z-50 flex justify-between items-center"
          >
            <span className="text-zinc-400 tracking-[0.4em] text-xs font-bold uppercase flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#ff0050] animate-pulse shadow-[0_0_10px_rgba(255,0,80,0.6)]"></span>
              Hanan Irfan
            </span>

            <button 
              onClick={(e) => { e.stopPropagation(); setSoundEnabled(!soundEnabled); }}
              className="text-zinc-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
              title={soundEnabled ? "Mute Sound" : "Enable Sound"}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Absolutely centered to avoid layout shifts */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-full max-w-[100vw] pointer-events-none">
        <div 
          className="pointer-events-auto cursor-crosshair py-24 px-10"
          onMouseEnter={handleHoverEnter}
          onMouseLeave={() => setIsHovered(false)}
        >
          {name.trim() === '' ? (
            <motion.div
              animate={{ 
                scale: [1, 1.15, 1], 
                opacity: [0.8, 1, 0.8],
                filter: [
                  'drop-shadow(0 0 20px rgba(255,0,80,0.4))', 
                  'drop-shadow(0 0 60px rgba(255,0,80,0.8))', 
                  'drop-shadow(0 0 20px rgba(255,0,80,0.4))'
                ]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.2, 
                ease: "easeInOut" 
              }}
            >
              <Heart className="w-32 h-32 md:w-48 md:h-48 text-[#ff0050] fill-[#ff0050]" />
            </motion.div>
          ) : (
            <motion.div 
              className="flex flex-nowrap justify-center items-center whitespace-nowrap"
              initial={{ opacity: 0, scale: 0.5, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            >
              {name.split('').map((char, i) => (
                <motion.span
                  key={i}
                  className={`font-display inline-block tracking-tight ${getFontSize()}`}
                  style={{ 
                    WebkitTextStroke: '1px rgba(255,255,255,0.1)',
                    lineHeight: '0.8'
                  }}
                  animate={isHovered ? {
                    y: [0, -25, 0],
                    scale: [1, 1.15, 1],
                    rotateZ: [0, 4, -4, 0],
                    color: ['#ffffff', '#ff0050', '#00f2fe', '#ffffff'],
                    textShadow: [
                      '0px 0px 0px rgba(255,255,255,0)',
                      '0px 0px 50px rgba(255,0,80,0.9)',
                      '0px 0px 50px rgba(0,242,254,0.9)',
                      '0px 0px 0px rgba(255,255,255,0)'
                    ]
                  } : {
                    y: 0,
                    scale: 1,
                    rotateZ: 0,
                    color: '#ffffff',
                    textShadow: '0px 0px 20px rgba(255,255,255,0.2)'
                  }}
                  transition={{
                    duration: 1.2,
                    ease: "easeInOut",
                    repeat: isHovered ? Infinity : 0,
                    delay: i * 0.05
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Input Area & Controls - Anchored to bottom to prevent overlapping */}
      <AnimatePresence>
        {!cleanMode && (
          <motion.div 
            className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 flex flex-col items-center gap-4 z-50"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative group w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ff0050] via-purple-500 to-[#00f2fe] rounded-full blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <input
                type="text"
                value={name}
                onChange={handleType}
                placeholder="ENTER NAME..."
                className="relative w-full bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-2.5 md:py-3 text-center text-base md:text-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all font-display tracking-widest uppercase shadow-2xl"
                autoComplete="off"
                spellCheck="false"
                maxLength={30}
              />
            </div>
            
            <div className="flex items-center gap-3 w-full justify-center relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCleanMode(true);
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold tracking-widest transition-all text-zinc-400 hover:text-white backdrop-blur-sm"
              >
                <EyeOff className="w-4 h-4" />
                STUDIO MODE
              </button>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowShare(!showShare);
                  }}
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all backdrop-blur-sm"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {/* Share Menu */}
                <AnimatePresence>
                  {showShare && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      className="absolute bottom-full mb-3 right-0 md:left-1/2 md:-translate-x-1/2 flex gap-2 p-2 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a 
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 hover:bg-white/10 rounded-xl transition-colors text-[#1DA1F2]"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                      <a 
                        href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 hover:bg-white/10 rounded-xl transition-colors text-[#25D366]"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </a>
                      <button 
                        onClick={handleCopy}
                        className="p-3 hover:bg-white/10 rounded-xl transition-colors text-white"
                      >
                        {copied ? <Check className="w-5 h-5 text-green-400" /> : <LinkIcon className="w-5 h-5" />}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint to exit clean mode */}
      <AnimatePresence>
        {cleanMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-[0.3em] font-medium pointer-events-none whitespace-nowrap"
          >
            TAP ANYWHERE TO SHOW UI
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
