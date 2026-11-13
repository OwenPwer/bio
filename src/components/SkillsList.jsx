import { SiTailwindcss, SiVite } from 'react-icons/si';
import { FaHtml5, FaCss3Alt, FaJs, FaReact } from 'react-icons/fa';

const SKILLS = [
  { name: 'HTML5', Icon: FaHtml5, color: 'text-orange-500' },
  { name: 'CSS3', Icon: FaCss3Alt, color: 'text-blue-500' },
  { name: 'JavaScript', Icon: FaJs, color: 'text-yellow-400' },
  { name: 'React', Icon: FaReact, color: 'text-cyan-400' },
  { name: 'Tailwind', Icon: SiTailwindcss, color: 'text-cyan-500' },
  { name: 'Vite', Icon: SiVite, color: 'text-purple-500' },
];

export function SkillsList({ isLandscape }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 text-center landscape:text-left font-semibold">
        Technologies I use
      </p>
      <div className={`grid grid-cols-2 gap-2 w-full ${isLandscape ? 'max-w-[400px]' : ''}`}>
        {SKILLS.map(({ name, Icon, color }) => (
          <div
            key={name}
            className="group/skill flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/30 hover:bg-white/[0.04] transition-colors duration-300"
          >
            <Icon
              className={`w-4 h-4 shrink-0 ${color} transition-transform duration-300 group-hover/skill:scale-110`}
            />
            <span className="text-xs font-medium text-zinc-300 group-hover/skill:text-white transition-colors">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}