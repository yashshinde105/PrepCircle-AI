import * as React from 'react';
import { ArrowDown, ArrowRight, AudioLines, Clock3, MessageCircle, Mic, Sparkles, Users } from 'lucide-react';
import { SonarGrid } from './sonar-grid';

interface HeroSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: { regular: string; gradient: string };
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}

const HeroSection = React.forwardRef<HTMLHeaderElement, HeroSectionProps>(
  (
    {
      className = '',
      title = 'Group discussion interview practice',
      subtitle = { regular: 'Make your point. ', gradient: 'Own the discussion.' },
      description = 'Practice interview group discussions with two AI partners. Build your argument, respond to other viewpoints, and get feedback after each session.',
      ctaText = 'Start a practice session',
      ctaHref = '#practice',
      onCtaClick,
      ...props
    },
    ref,
  ) => (
    <header
      ref={ref}
      className={`relative isolate overflow-hidden border-b border-white/[0.07] ${className}`}
      {...props}
    >
      <SonarGrid
        color="#8ee5d0"
        spacing={30}
        dotRadius={1.2}
        baseOpacity={0.2}
        pingEvery={3.4}
        speed={220}
        ringWidth={76}
        amplitude={1.6}
        pingArea={[0.52, 0.08, 0.98, 0.9]}
        className="min-h-[680px] cursor-default bg-[radial-gradient(ellipse_at_78%_42%,rgba(59,130,246,.13),transparent_30%),radial-gradient(ellipse_at_72%_65%,rgba(189,231,102,.08),transparent_32%),linear-gradient(180deg,#0c1118_0%,#0a0e13_100%)]"
      >
      <div className="relative z-10 mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 px-5 pb-16 pt-28 sm:px-8 lg:min-h-[760px] lg:grid-cols-[1fr_1fr] lg:gap-8 lg:px-10 lg:pt-24">
        <div className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#8ee5d0]/20 bg-[#8ee5d0]/[0.07] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[.16em] text-[#a9ecdc]">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8ee5d0] opacity-40" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#8ee5d0]" /></span>
            {title}
          </div>
          <h1 className="max-w-3xl text-[2.8rem] font-semibold leading-[1.02] tracking-[-0.055em] text-[#f3f5ef] sm:text-6xl lg:text-[4.2rem]">
            {subtitle.regular}
            <span className="text-[#c3e879]">{subtitle.gradient}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#a5b0bd] sm:text-lg sm:leading-8">
            {description}
          </p>
          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            {onCtaClick ? (
              <button onClick={onCtaClick} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#c3e879] px-5 py-3 text-sm font-semibold text-[#17200d] shadow-[0_8px_24px_rgba(195,232,121,.12)] transition hover:bg-[#d1ef93] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c3e879]">
                {ctaText}<ArrowDown className="h-4 w-4" />
              </button>
            ) : (
              <a href={ctaHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#c3e879] px-5 py-3 text-sm font-semibold text-[#17200d] shadow-[0_8px_24px_rgba(195,232,121,.12)] transition hover:bg-[#d1ef93]">
                {ctaText}<ArrowRight className="h-4 w-4" />
              </a>
            )}
            <span className="text-sm text-[#8996a4]">Choose a 5, 10, or 15 minute practice</span>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#9aa8b6]">
            <span className="inline-flex items-center gap-2"><Mic className="h-4 w-4 text-[#8ee5d0]" />Speak or type</span>
            <span className="inline-flex items-center gap-2"><MessageCircle className="h-4 w-4 text-[#8ee5d0]" />Real back-and-forth</span>
            <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#8ee5d0]" />Feedback that helps</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[650px] lg:ml-auto">
          <div className="absolute inset-[7%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(80,170,190,.2),rgba(71,104,207,.1)_42%,transparent_72%)] blur-3xl" />
          <div className="absolute inset-[8%] rounded-[2.5rem] border border-[#8ee5d0]/10 bg-[linear-gradient(145deg,rgba(23,40,51,.5),rgba(11,17,25,.15)_55%,rgba(73,93,150,.12))] shadow-[inset_0_1px_0_rgba(255,255,255,.05)]" />
          <div className="absolute left-[12%] top-[10%] h-[70%] w-[70%] rounded-full border border-dashed border-[#8ee5d0]/[0.12]" />
          <div className="absolute right-[7%] top-[18%] h-[48%] w-[48%] rounded-full border border-white/[0.06]" />

          <div className="relative z-20 flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-7">
            <div className="rounded-2xl border border-white/10 bg-[#0b1219]/75 px-4 py-3 shadow-xl backdrop-blur-xl sm:px-5">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-[#8ee5d0] sm:text-[11px]">
                <Users className="h-3.5 w-3.5" /> Interview GD
              </div>
              <p className="mt-1.5 text-sm font-medium text-white sm:text-base">Topic: a changing world</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0b1219]/75 px-3.5 py-2 text-xs font-medium text-[#cbd5df] shadow-xl backdrop-blur-xl sm:px-4 sm:text-sm">
              <Clock3 className="h-4 w-4 text-[#8ee5d0]" /> 5, 10, or 15 min
            </div>
          </div>

          <img
            src="/hero-cutout.png"
            alt="A candidate practicing a group discussion with two AI participants"
            width="1800"
            height="890"
            fetchPriority="high"
            decoding="async"
            className="relative z-10 -mt-2 block h-auto w-full drop-shadow-[0_24px_34px_rgba(0,0,0,.3)] sm:-mt-5"
          />

          <div className="relative z-20 mx-4 -mt-5 mb-5 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0b1219]/85 p-3 shadow-2xl backdrop-blur-xl sm:mx-8 sm:-mt-8 sm:mb-8 sm:p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8ee5d0]/10 text-[#8ee5d0]"><AudioLines className="h-5 w-5" /></div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#8ee5d0]">Live discussion</p>
                <p className="mt-0.5 truncate text-sm font-medium text-white sm:text-base">Make a point. Build on theirs.</p>
              </div>
            </div>
            <div className="hidden shrink-0 items-center -space-x-2 sm:flex" aria-label="You, Bob, and Jannet">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#101820] bg-[#c3e879] text-[10px] font-bold text-[#17200d]">YOU</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#101820] bg-[#6e93c8] text-xs font-semibold text-white">B</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#101820] bg-[#a786ca] text-xs font-semibold text-white">J</span>
            </div>
          </div>
        </div>
      </div>
      </SonarGrid>
    </header>
  ),
);

HeroSection.displayName = 'HeroSection';

export { HeroSection };
