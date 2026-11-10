import { ArrowRight } from 'lucide-react';
import { GithubIcon, InstagramIcon } from './Icons';

const LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/', Icon: InstagramIcon },
  { label: 'GitHub', href: 'https://github.com/', Icon: GithubIcon },
];

export function LinksList() {
  return (
    <div className="flex flex-col gap-3">
      {LINKS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-zinc-300 hover:text-amber-400 hover:border-amber-500/25 hover:bg-amber-500/[0.04] transition-colors duration-300"
        >
          <span className="flex items-center gap-3">
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
          </span>
          <ArrowRight
            className="w-4 h-4 opacity-40 transition-[transform,opacity] duration-300 group-hover/link:translate-x-0.5 group-hover/link:opacity-100"
            aria-hidden="true"
          />
        </a>
      ))}
    </div>
  );
}