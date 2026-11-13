import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DISCORD_USER_ID } from './config.js';
import { useLanyard } from './hooks/useLanyard';
import { Avatar } from './components/Avatar';
import { Tabs } from './components/Tabs';
import { LinksList } from './components/LinksList';
import { SkillsList } from './components/SkillsList';
import { ConstellationCanvas } from './components/ConstellationCanvas';

const TABS = [
  { id: 'links', label: 'Links' },
  { id: 'skills', label: 'Tech Stack' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('links');
  const [isLandscape, setIsLandscape] = useState(false);
  const { presence, error } = useLanyard(DISCORD_USER_ID);

  const status = presence?.discord_status ?? 'offline';
  const showIdWarning = !DISCORD_USER_ID;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(orientation: landscape) and (max-height: 600px)');
    setIsLandscape(mediaQuery.matches);
    const handleChange = (e) => setIsLandscape(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className={`relative min-h-[100dvh] w-full text-white flex items-center justify-center p-4 sm:p-6 ${isLandscape ? 'py-4' : ''} bg-[#020203] overflow-x-hidden [perspective:1200px]`}>
      <ConstellationCanvas />

      <motion.div
        key={isLandscape ? 'landscape' : 'portrait'}
        className={`relative z-10 w-full ${isLandscape ? 'max-w-[760px]' : 'max-w-[400px]'}`}
        initial={isLandscape ? { opacity: 0, rotateZ: -1, scale: 0.97 } : { opacity: 0, rotateY: -15, scale: 0.97 }}
        animate={{ opacity: 1, rotateY: 0, rotateZ: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 26, mass: 1.2 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className={`relative bg-zinc-950/85 border border-amber-500/[0.08] rounded-[24px] sm:rounded-[28px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.85)] group flex overflow-hidden transition-[border-color,box-shadow] duration-500 hover:border-amber-500/[0.15] ${isLandscape ? 'p-6 text-left flex-row items-stretch gap-8' : 'p-6 pt-10 sm:p-8 sm:pt-12 text-center flex-col gap-6 sm:gap-8'}`}>

          {showIdWarning && (
            <div
              role="alert"
              className="absolute top-0 left-0 right-0 bg-amber-500/15 border-b border-amber-500/25 text-amber-300 text-[10px] sm:text-[11px] py-1.5 px-3 text-center z-20 font-medium tracking-wide"
            >
              Set <code className="font-mono">VITE_DISCORD_USER_ID</code> in{' '}
              <code className="font-mono">.env</code> to show Discord status
            </div>
          )}

          <motion.div
            layout="position"
            className={`flex flex-col items-center shrink-0 border-white/[0.04] ${isLandscape ? 'justify-center w-[240px] border-b-0 border-r pb-0 pr-8' : 'w-full border-b pb-4'}`}
            transition={{ type: 'spring', stiffness: 200, damping: 28 }}
          >
            <Avatar status={status} isLandscape={isLandscape} hasError={error} />

            <motion.h1
              layout
              className={`font-semibold text-white mb-1 relative inline-block tracking-tight text-center transition-colors duration-300 ${isLandscape ? 'text-xl' : 'text-xl sm:text-2xl'}`}
            >
              Owen Yaku Pers
              <span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-amber-500 transition-[width] duration-300 -translate-x-1/2 group-hover:w-3/5 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            </motion.h1>

            <motion.p
              layout
              className={`text-zinc-400/80 mb-4 font-medium tracking-wide text-center ${isLandscape ? 'text-xs' : 'text-xs sm:text-sm'}`}
            >
              Frontend Developer
            </motion.p>

            <motion.div
              layout
              className={`w-full bg-white/[0.01] border-l-2 border-amber-500/80 p-3.5 sm:p-4 rounded-r-xl text-left ${isLandscape ? 'hidden' : 'block'}`}
            >
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
            <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

            <div className="flex-grow min-h-[128px]">
              <AnimatePresence mode="wait" initial={false}>
                {activeTab === 'links' ? (
                  <motion.div
                    key="links"
                    role="tabpanel"
                    id="panel-links"
                    aria-labelledby="tab-links"
                    tabIndex={0}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-lg"
                  >
                    <LinksList />
                  </motion.div>
                ) : (
                  <motion.div
                    key="skills"
                    role="tabpanel"
                    id="panel-skills"
                    aria-labelledby="tab-skills"
                    tabIndex={0}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="flex flex-col justify-center h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-lg"
                  >
                    <SkillsList isLandscape={isLandscape} />
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