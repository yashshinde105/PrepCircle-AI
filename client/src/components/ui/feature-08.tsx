import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Feature08Item {
  icon: LucideIcon;
  title: string;
  description: string;
  glow?: string;
}

interface Feature08Props extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title: string;
  description: string;
  features: Feature08Item[];
}

function CornerMark({ corner }: { corner: 'top' | 'bottom' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={cn(
        'pointer-events-none absolute z-10 h-3.5 w-3.5 text-[#718077] transition-colors group-hover:text-[#c3e879]',
        corner === 'top' ? '-left-[7px] -top-[7px]' : '-bottom-[7px] -right-[7px]',
      )}
    >
      <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function FeatureCard({ feature, index }: { feature: Feature08Item; index: number }) {
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
  };
  const Icon = feature.icon;

  return (
    <article
      onPointerMove={handlePointerMove}
      className="group relative flex min-h-[190px] flex-col justify-start gap-5 border-b border-r border-white/[0.085] bg-[#0f1516] px-5 pb-6 pt-6 shadow-[inset_0_1px_0_rgba(255,255,255,.025)] transition-colors duration-300 hover:bg-[#121a1a] sm:min-h-[205px] sm:px-6"
      style={{ '--feature-glow': feature.glow ?? 'rgba(195,232,121,.12)' } as React.CSSProperties}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 0%), var(--feature-glow), transparent 72%)' }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.16] to-transparent" />
      <CornerMark corner="top" />
      <CornerMark corner="bottom" />

      <div className="relative z-10 flex items-center gap-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.035] text-[#c3e879] transition-colors duration-300 group-hover:border-[#c3e879]/25 group-hover:bg-[#c3e879]/[0.08]">
          <Icon aria-hidden="true" className="h-[18px] w-[18px] stroke-[1.7]" />
        </span>
        <h3 className="text-base font-semibold leading-snug text-[#f0f3ee]">{feature.title}</h3>
        <span className="ml-auto hidden font-mono text-[10px] tracking-widest text-slate-600 sm:inline">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <p className="relative z-10 max-w-sm pl-[3.35rem] text-sm leading-6 text-[#9aa69f]">
        {feature.description}
      </p>
    </article>
  );
}

export function Feature08({
  eyebrow = 'Made for better discussions',
  title,
  description,
  features,
  className,
  ...props
}: Feature08Props) {
  return (
    <section className={cn('w-full', className)} {...props}>
      <header className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-4 text-center sm:mb-14">
        <span className="inline-flex items-center rounded-full border border-[#c3e879]/20 bg-[#c3e879]/[0.055] px-4 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[.15em] text-[#c3e879]">
          {eyebrow}
        </span>
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#f3f5ef] sm:text-4xl lg:text-5xl">{title}</h2>
        <p className="max-w-2xl text-sm leading-7 text-[#9ba69f] sm:text-base">{description}</p>
      </header>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 border-l border-t border-white/[0.085] md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard key={feature.title} feature={feature} index={index} />
        ))}
      </div>
    </section>
  );
}

export default Feature08;
