import avatarImg from '../assets/mimi.jpg';
import { StatusBadge } from './StatusBadge';

export function Avatar({ status }) {
  return (
    <div className="relative w-[88px] h-[88px] sm:w-[104px] sm:h-[104px] mx-auto mb-5 sm:mb-6">
      <div className="w-full h-full rounded-full bg-zinc-900 border border-white/[0.08] transition-[border-color,box-shadow] duration-500 group-hover:shadow-[0_0_30px_6px_rgba(245,158,11,0.25)] group-hover:border-amber-500/60 overflow-hidden">
        <img
          src={avatarImg}
          alt="Owen Yaku Pers"
          className="w-full h-full object-cover select-none"
          draggable="false"
        />
      </div>
      <StatusBadge status={status} />
    </div>
  );
}