import { FaHtml5, FaCss3Alt, FaJs, FaReact } from 'react-icons/fa';

const SKILLS = [
  { name: 'HTML5', Icon: FaHtml5, color: 'text-orange-500' },
  { name: 'CSS3', Icon: FaCss3Alt, color: 'text-blue-500' },
  { name: 'JavaScript', Icon: FaJs, color: 'text-yellow-400' },
  { name: 'React', Icon: FaReact, color: 'text-cyan-400' },
];

export function SkillsList() {
  return (
    <div className="flex flex-wrap gap-2 justify-center content-start">
      {SKILLS.map(({ name, Icon, color }) => (
        <span
          key={name}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-white/[0.02] border border-white/[0.06] hover:text-amber-400 hover:border-amber-500/25 transition-colors duration-300"
        >
          <Icon className={`w-3.5 h-3.5 ${color}`} />
          {name}
        </span>
      ))}
    </div>
  );
}