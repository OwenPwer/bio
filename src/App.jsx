import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SiDiscord, SiGithub, SiTailwindcss, SiVite } from 'react-icons/si';
import { FaHtml5, FaCss3Alt, FaJs, FaReact } from 'react-icons/fa';
import avatarImg from './assets/mimi.jpg';

const DISCORD_USER_ID = '971809780475756584';

/* ------------------------------------------------------------------ */
/*  Константы                                                         */
/* ------------------------------------------------------------------ */
const STATUS_CONFIG = {
  online: { color: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]', text: 'ONLINE' },
  idle:   { color: 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]',   text: 'IDLE' },
  dnd:    { color: 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]',     text: 'DND' },
  offline:{ color: 'bg-zinc-500',                                            text: 'OFFLINE' },
};

const LINKS = [
  { label: 'o.pers', href: 'https://discord.com/users/971809780475756584', Icon: SiDiscord },
  { label: 'OwenPwer', href: 'https://github.com/OwenPwer', Icon: SiGithub },
];

const SKILLS = [
  { name: 'HTML5', Icon: FaHtml5, color: 'text-orange-500' },
  { name: 'CSS3', Icon: FaCss3Alt, color: 'text-blue-500' },
  { name: 'JavaScript', Icon: FaJs, color: 'text-yellow-400' },
  { name: 'React', Icon: FaReact, color: 'text-cyan-400' },
  { name: 'Tailwind', Icon: SiTailwindcss, color: 'text-cyan-500' },
  { name: 'Vite', Icon: SiVite, color: 'text-purple-500' },
];

const TABS = [
  { id: 'links', label: 'Links' },
  { id: 'skills', label: 'Tech Stack' },
];

/* ------------------------------------------------------------------ */
/*  Хуки (Discord и Canvas)                                           */
/* ------------------------------------------------------------------ */
function useLanyard(userId) {
  const [presence, setPresence] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let heartbeatInterval = null;
    let cancelled = false;
    let socket = null;

    const timeoutId = setTimeout(() => {
      if (cancelled) return;
      socket = new WebSocket('wss://api.lanyard.rest/socket');

      socket.onmessage = (event) => {
        let msg;
        try {
          msg = JSON.parse(event.data);
        } catch (err) {
          console.warn('Lanyard: failed to parse message', err);
          return;
        }
        const { op, t, d } = msg;

        if (op === 1) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ op: 3 }));
            }
          }, d.heartbeat_interval);
          socket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
        }

        if (op === 0 && (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE')) {
          setPresence(d);
          setError(false);
        }
      };

      socket.onerror = (err) => {
        console.error('Lanyard WebSocket Error:', err);
        if (!cancelled) setError(true);
      };

      socket.onclose = () => {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      };
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      clearInterval(heartbeatInterval);
      if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
        socket.close();
      }
    };
  }, [userId]);

  return { presence, error };
}

function useConstellation(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { x: null, y: null };

    let particles = [];
    let animationFrameId = null;
    let resizeRafId = null;
    let isAnimating = false;
    let width = 0;
    let height = 0;
    let currentDpr = window.devicePixelRatio || 1;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.alpha = Math.random() * 0.25 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
      }
      draw() {
        ctx.fillStyle = `rgba(245, 158, 11, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      const isMobile = width < 768;
      const divisor = isMobile ? 25000 : 18000;
      const maxParticles = isMobile ? 60 : 120;
      const count = Math.min(maxParticles, Math.floor((width * height) / divisor));
      particles = Array.from({ length: count }, () => new Particle());
    }

    function drawLines() {
      const maxDist = 115;
      const maxDistSq = maxDist * maxDist;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            ctx.strokeStyle = `rgba(245, 158, 11, ${(1 - dist / maxDist) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
        if (mouse.x !== null && mouse.y !== null) {
          const mDx = particles[i].x - mouse.x;
          const mDy = particles[i].y - mouse.y;
          const mDistSq = mDx * mDx + mDy * mDy;
          const mMaxDist = 160;
          if (mDistSq < mMaxDist * mMaxDist) {
            const mDist = Math.sqrt(mDistSq);
            ctx.strokeStyle = `rgba(245, 158, 11, ${(1 - mDist / mMaxDist) * 0.12})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    }

    function drawScene(shouldUpdate) {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        if (shouldUpdate) particles[i].update();
        particles[i].draw();
      }
      drawLines();
    }

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      currentDpr = window.devicePixelRatio || 1;
      canvas.width = width * currentDpr;
      canvas.height = height * currentDpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(currentDpr, 0, 0, currentDpr, 0, 0);
      initParticles();
      if (!isAnimating) drawScene(false);
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      drawScene(true);
    }

    function startAnimation() {
      if (reducedMotion || isAnimating) return;
      isAnimating = true;
      animationFrameId = requestAnimationFrame(animate);
    }

    function stopAnimation() {
      isAnimating = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }

    const handleMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };
    const handleLeave = () => { mouse.x = null; mouse.y = null; };
    const handleResize = () => {
      if (resizeRafId !== null) return;
      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = null;
        resizeCanvas();
      });
    };
    const handleVisibility = () => {
      if (document.hidden) stopAnimation();
      else if (reducedMotion) drawScene(false);
      else startAnimation();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleLeave);
    window.addEventListener('mouseout', (e) => { if (!e.relatedTarget) handleLeave(); });
    window.addEventListener('blur', handleLeave);
    document.addEventListener('visibilitychange', handleVisibility);

    resizeCanvas();
    if (!document.hidden) startAnimation();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleLeave);
      window.removeEventListener('blur', handleLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
      stopAnimation();
    };
  }, [canvasRef]);
}

/* ------------------------------------------------------------------ */
/*  Компоненты                                                        */
/* ------------------------------------------------------------------ */
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.offline;
  return (
    <div
      role="status"
      aria-atomic="true"
      className="absolute bottom-0.5 right-0.5 bg-zinc-950 border border-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg"
    >
      <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${cfg.color}`} />
      <span className="text-[8px] font-bold text-zinc-400 tracking-wider">
        <span className="sr-only">Discord status: </span>{cfg.text}
      </span>
    </div>
  );
}

function Avatar({ status, isLandscape }) {
  return (
    <motion.div
      layout
      className={`relative shrink-0 mx-auto transition-all duration-500 ${isLandscape ? 'w-[84px] h-[84px] mb-3' : 'w-[88px] h-[88px] sm:w-[104px] sm:h-[104px] mb-5 sm:mb-6'}`}
    >
      <div className="w-full h-full rounded-full bg-zinc-900 border border-white/[0.08] transition-[border-color,box-shadow] duration-500 group-hover:shadow-[0_0_30px_6px_rgba(245,158,11,0.25)] group-hover:border-amber-500/60 overflow-hidden">
        <img src={avatarImg} alt="Owen Yaku Pers" className="w-full h-full object-cover select-none" draggable="false" />
      </div>
      <StatusBadge status={status} />
    </motion.div>
  );
}

function Tabs({ activeTab, onChange }) {
  const buttonsRef = useRef([]);

  const focusTab = (index) => {
    const buttons = buttonsRef.current.filter(Boolean);
    if (!buttons.length) return;
    const next = (index + buttons.length) % buttons.length;
    buttons[next].focus();
    onChange(TABS[next].id);
  };

  const handleKeyDown = (e, index) => {
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': e.preventDefault(); focusTab(index + 1); break;
      case 'ArrowLeft': case 'ArrowUp': e.preventDefault(); focusTab(index - 1); break;
      case 'Home': e.preventDefault(); focusTab(0); break;
      case 'End': e.preventDefault(); focusTab(TABS.length - 1); break;
      default: break;
    }
  };

  return (
    <div role="tablist" aria-label="Profile sections" className="flex bg-white/[0.02] border border-white/[0.04] rounded-xl p-1 gap-1">
      {TABS.map((tab, index) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => { buttonsRef.current[index] = el; }}
            type="button" role="tab" id={`tab-${tab.id}`} aria-selected={isActive}
            aria-controls={`panel-${tab.id}`} tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)} onKeyDown={(e) => handleKeyDown(e, index)}
            className={`flex-1 relative py-2 text-xs font-semibold rounded-lg transition-colors duration-300 capitalize cursor-pointer tracking-wider focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 ${isActive ? 'text-amber-500' : 'text-zinc-400 hover:text-white'}`}
          >
            {isActive && (
              <motion.div layoutId="activeTabBg" className="absolute inset-0 bg-amber-500/[0.06] border border-amber-500/15 rounded-lg" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Главный компонент                                                 */
/* ------------------------------------------------------------------ */
export default function App() {
  const [activeTab, setActiveTab] = useState('links');
  const [isLandscape, setIsLandscape] = useState(false);
  const { presence } = useLanyard(DISCORD_USER_ID);
  const canvasRef = useRef(null);
  
  useConstellation(canvasRef);
  const status = presence?.discord_status ?? 'offline';

  useEffect(() => {
    const mediaQuery = window.matchMedia('(orientation: landscape) and (max-height: 600px)');
    setIsLandscape(mediaQuery.matches);
    const handleOrientationChange = (e) => setIsLandscape(e.matches);
    mediaQuery.addEventListener('change', handleOrientationChange);
    return () => mediaQuery.removeEventListener('change', handleOrientationChange);
  }, []);

  return (
    <div className={`relative min-h-[100dvh] w-full text-white flex items-center justify-center p-4 sm:p-6 ${isLandscape ? 'py-4' : ''} bg-[#020203] overflow-x-hidden [perspective:1200px]`}>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />

      <motion.div
        key={isLandscape ? 'landscape' : 'portrait'}
        className={`relative z-10 w-full ${isLandscape ? 'max-w-[760px]' : 'max-w-[400px]'}`}
        initial={isLandscape ? { opacity: 0, rotateZ: -1, scale: 0.97 } : { opacity: 0, rotateY: -15, scale: 0.97 }}
        animate={{ opacity: 1, rotateY: 0, rotateZ: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 26, mass: 1.2 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className={`relative bg-zinc-950/85 border border-amber-500/[0.08] rounded-[24px] sm:rounded-[28px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.85)] group flex overflow-hidden transition-[border-color,box-shadow] duration-500 hover:border-amber-500/[0.15] ${isLandscape ? 'p-6 text-left flex-row items-stretch gap-8' : 'p-6 pt-10 sm:p-8 sm:pt-12 text-center flex-col gap-6 sm:gap-8'}`}>
          
          <motion.div
            layout="position"
            className={`flex flex-col items-center shrink-0 border-white/[0.04] ${isLandscape ? 'justify-center w-[240px] border-b-0 border-r pb-0 pr-8' : 'w-full border-b pb-4'}`}
            transition={{ type: 'spring', stiffness: 200, damping: 28 }}
          >
            <Avatar status={status} isLandscape={isLandscape} />

            <motion.h1 layout className={`font-semibold text-white mb-1 relative inline-block tracking-tight text-center transition-colors duration-300 ${isLandscape ? 'text-xl' : 'text-xl sm:text-2xl'}`}>
              Owen Yaku Pers
              <span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-amber-500 transition-[width] duration-300 -translate-x-1/2 group-hover:w-3/5 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            </motion.h1>

            <motion.p layout className={`text-zinc-400/80 mb-4 font-medium tracking-wide text-center ${isLandscape ? 'text-xs' : 'text-xs sm:text-sm'}`}>
              Frontend Developer
            </motion.p>

            <motion.div layout className={`w-full bg-white/[0.01] border-l-2 border-amber-500/80 p-3.5 sm:p-4 rounded-r-xl text-left ${isLandscape ? 'hidden' : 'block'}`}>
              <p className="text-zinc-300 text-xs sm:text-sm italic leading-relaxed font-normal">
                You cannot deceive others if you do not believe your own lie.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            layout="position"
            className="flex-grow flex flex-col gap-3 sm:gap-4 min-w-0"
            transition={{ type: 'spring', stiffness: 200, damping: 28 }}
          >
            <Tabs activeTab={activeTab} onChange={setActiveTab} />

            <div className="flex-grow min-h-[128px]">
              <AnimatePresence mode="wait" initial={false}>
                {activeTab === 'links' ? (
                  <motion.div
                    key="links" role="tabpanel" id="panel-links" aria-labelledby="tab-links" tabIndex={0}
                    initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="flex flex-col gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-lg"
                  >
                    {LINKS.map(({ label, href, Icon }) => (
                      <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="group/link flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-zinc-300 hover:text-amber-400 hover:border-amber-500/25 hover:bg-amber-500/[0.04] transition-colors duration-300">
                        <span className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{label}</span>
                        </span>
                        <ArrowRight className="w-4 h-4 opacity-40 transition-[transform,opacity] duration-300 group-hover/link:translate-x-0.5 group-hover/link:opacity-100" aria-hidden="true" />
                      </a>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
  key="skills" role="tabpanel" id="panel-skills" aria-labelledby="tab-skills" tabIndex={0}
  initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.2, ease: 'easeOut' }}
  className="flex flex-col justify-center h-full gap-2 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-lg"
>
  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 text-center landscape:text-left font-semibold">
    Technologies I use
  </p>
  <div className={`grid grid-cols-2 gap-2 w-full ${isLandscape ? 'max-w-[400px]' : ''}`}>
    {SKILLS.map(({ name, Icon, color }) => (
      <div 
        key={name} 
        className="group/skill flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/30 hover:bg-white/[0.04] transition-colors duration-300"
      >
        <Icon className={`w-4 h-4 shrink-0 ${color} transition-transform duration-300 group-hover/skill:scale-110`} />
        <span className="text-xs font-medium text-zinc-300 group-hover/skill:text-white transition-colors">
          {name}
        </span>
      </div>
    ))}
  </div>
</motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-3 sm:pt-5 border-t border-white/[0.05] flex items-center justify-between text-[9px] sm:text-[10px] uppercase tracking-widest text-zinc-600">
              <span>© 2026 Owen Yaku Pers</span>
              <span aria-hidden="true" className="text-amber-500/70">✦</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}