const SKILLS = ['HTML5', 'CSS3', 'JavaScript', 'React'];

export function SkillsList() {
  return (
    <div className="flex flex-wrap gap-2 justify-center content-start">
      {SKILLS.map((skill) => (
        <span
          key={skill}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-white/[0.02] border border-white/[0.06] hover:text-amber-400 hover:border-amber-500/25 transition-colors duration-300"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}