import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanyard } from './hooks/useLanyard';
import { ConstellationCanvas } from './components/ConstellationCanvas';
import { Avatar } from './components/Avatar';
import { Tabs } from './components/Tabs';
import { LinksList } from './components/LinksList';
import { SkillsList } from './components/SkillsList';

const DISCORD_USER_ID = '971809780475756584';

const TABS = [
  { id: 'links', label: 'Links' },
  { id: 'skills', label: 'Tech Stack' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('links');
  const { presence } = useLanyard(DISCORD_USER_ID);
  const status = presence?.discord_status ?? 'offline';

  return (
    <div className="relative min-h-[100dvh] w-full text-white flex items-center justify-center py-6 sm:py-8 bg-[#020203] overflow-x-hidden">
      <ConstellationCanvas />

      <div className="relative z-10 w-full max-w-[420px] px-4">
        <div className="relative bg-zinc-950/85 border border-amber-500/[0.08] rounded-[24px] sm:rounded-[28px] p-6 pt-10 sm:p-8 sm:pt-12 text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.85)] group transition-[border-color,box-shadow] duration-500 hover:border-amber-500/[0.15]">
          <Avatar status={status} />
          <h1 className="text-xl sm:text-2xl font-semibold text-white mb-1.5 relative inline-block tracking-tight transition-colors duration-300">
            Owen Yaku Pers
            <span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-amber-500 transition-[width] duration-300 -translate-x-1/2 group-hover:w-3/5 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          </h1>

          <p className="text-zinc-400/80 text-xs sm:text-sm mb-5 sm:mb-6 font-medium tracking-wide">
            Frontend Developer / Creator
          </p>

          <div className="relative bg-white/[0.01] border-l-2 border-amber-500/80 p-3.5 sm:p-4 mb-5 sm:mb-6 rounded-r-xl text-left">
            <p className="text-zinc-300 text-xs sm:text-sm italic leading-relaxed font-normal">
              &quot;Next time you make a decision please speak with me. I am here as well.&quot;
            </p>
          </div>

          <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

          <div className="min-h-[128px]">
            <AnimatePresence mode="wait" initial={false}>
              {activeTab === 'links' ? (
                <motion.div
                  key="links"
                  role="tabpanel"
                  id="panel-links"
                  aria-labelledby="tab-links"
                  tabIndex={0}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
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
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-lg"
                >
                  <SkillsList />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <footer className="mt-6 sm:mt-7 pt-4 sm:pt-5 border-t border-white/[0.05] flex items-center justify-between text-[9px] sm:text-[10px] uppercase tracking-widest text-zinc-600">
            <span>© 2026 Owen Yaku Pers</span>
            <span aria-hidden="true" className="text-amber-500/70">✦</span>
          </footer>
        </div>
      </div>
    </div>
  );
}