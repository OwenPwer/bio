import { useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Полный WAI-ARIA Tabs pattern:
 * - role="tablist" / role="tab" с aria-controls + aria-selected
 * - roving tabindex: активный таб tabIndex=0, остальные -1
 * - Left/Right/Up/Down — переключение, Home/End — крайние
 * - автоматическая активация при перемещении фокуса
 *
 * tabs: [{ id: string, label: string }]
 */
export function Tabs({ tabs, activeTab, onChange }) {
  const buttonsRef = useRef([]);

  const focusTab = (index) => {
    const buttons = buttonsRef.current.filter(Boolean);
    if (!buttons.length) return;
    const next = (index + buttons.length) % buttons.length;
    buttons[next].focus();
    onChange(tabs[next].id);
  };

  const handleKeyDown = (e, index) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        focusTab(index + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        focusTab(index - 1);
        break;
      case 'Home':
        e.preventDefault();
        focusTab(0);
        break;
      case 'End':
        e.preventDefault();
        focusTab(tabs.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Profile sections"
      className="flex bg-white/[0.02] border border-white/[0.04] rounded-xl p-1 mb-6 gap-1"
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => { buttonsRef.current[index] = el; }}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`flex-1 relative py-2.5 text-xs font-semibold rounded-lg transition-colors duration-300 capitalize cursor-pointer tracking-wider focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 ${
              isActive ? 'text-amber-500' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBg"
                className="absolute inset-0 bg-amber-500/[0.06] border border-amber-500/15 rounded-lg"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}