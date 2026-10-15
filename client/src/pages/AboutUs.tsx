import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Brain, Target, Zap, Trophy, Users, Sparkles, ArrowRight } from 'lucide-react';
import { Feature08 } from '../components/ui/feature-08';

const AboutUs = () => {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#0c1118] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-48 left-1/2 h-[34rem] w-[48rem] -translate-x-1/2 rounded-full bg-[#8ee5d0]/[0.055] blur-[120px]" />
        <div className="absolute right-[-14rem] top-[42rem] h-[30rem] w-[30rem] rounded-full bg-[#c3e879]/[0.045] blur-[110px]" />
      </div>
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mx-auto mb-16 max-w-4xl text-center sm:mb-20">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.035] py-1.5 pl-1.5 pr-4">
              <img src="/logo.png" alt="" className="h-8 w-8 rounded-full" />
              <span className="text-xs font-medium text-[#c3cec7]">Made for practice, built around people</span>
            </div>
            <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[.2em] text-[#8ee5d0] sm:text-xs">About PrepCircle</p>
            <h1 className="mb-5 text-4xl font-semibold leading-[1.04] tracking-[-.055em] text-[#f3f5ef] sm:text-6xl lg:text-7xl">
              Better conversations <span className="text-[#c3e879]">start with practice.</span>
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-[#a5b0bd] sm:text-lg sm:leading-8">
              PrepCircle gives you a low-pressure place to organize your thoughts, hear another point of view, and get more comfortable speaking in a group.
            </p>
          </div>

          {/* Mission Section */}
          <div className="relative mb-16 overflow-hidden border border-white/[0.085] bg-[#0f1516]/90 p-6 shadow-[0_24px_70px_rgba(0,0,0,.2)] sm:mb-20 sm:p-9 lg:p-11">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(142,229,208,.09),transparent_44%)]" />
            <div className="relative grid gap-8 md:grid-cols-[.8fr_1.2fr] md:gap-12">
              <div>
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#8ee5d0]/20 bg-[#8ee5d0]/[0.07] text-[#8ee5d0]">
                  <Target className="h-5 w-5" />
                </div>
                <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[.18em] text-[#8ee5d0]">Why we built it</p>
                <h2 className="text-2xl font-semibold tracking-tight text-[#f3f5ef] sm:text-3xl">A place to find your voice.</h2>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-sm leading-7 text-[#a5b0bd] sm:text-base sm:leading-8">
                  Clear communication and critical thinking grow with practice. PrepCircle gives job seekers, students, and professionals a low-pressure place to work through ideas, hear different viewpoints, and get useful feedback before the next real group discussion.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['Think clearly', 'Listen actively', 'Contribute with confidence'].map((value) => (
                    <span key={value} className="rounded-full border border-white/[0.09] bg-white/[0.035] px-3 py-1.5 text-xs text-[#c3cec7]">{value}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Feature08
            className="mb-12"
            eyebrow="What you can practice"
            title="A better way to prepare for the room."
            description="PrepCircle gives you a realistic place to practice the skills that help you participate with clarity and confidence."
            features={[
              { icon: Brain, title: 'Two distinct perspectives', description: 'Bob and Jannet bring different ideas and follow-up questions into the discussion.', glow: 'rgba(111,172,223,.14)' },
              { icon: Users, title: 'Realistic interview GDs', description: 'Practice taking turns, responding to others, and adding useful points to a group.', glow: 'rgba(195,232,121,.13)' },
              { icon: Sparkles, title: 'Voice or text', description: 'Speak naturally with voice input or type your response whenever you prefer.', glow: 'rgba(142,229,208,.14)' },
              { icon: Target, title: 'Actionable feedback', description: 'Understand the strengths of your contributions and what to improve next.', glow: 'rgba(177,148,230,.14)' },
              { icon: Trophy, title: 'Progress over time', description: 'Review completed sessions, scores, and feedback to see how your skills develop.', glow: 'rgba(225,188,112,.13)' },
              { icon: Zap, title: 'A wide range of topics', description: 'Choose from discussions about technology, society, careers, education, and more.', glow: 'rgba(142,229,208,.14)' },
            ]}
          />

          {/* How It Works */}
          <section className="mb-16 sm:mb-20">
            <header className="mx-auto mb-9 max-w-2xl text-center sm:mb-12">
              <span className="mb-4 inline-flex rounded-full border border-[#8ee5d0]/20 bg-[#8ee5d0]/[0.05] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[.16em] text-[#8ee5d0]">A simple flow</span>
              <h2 className="text-3xl font-semibold tracking-[-.04em] text-[#f3f5ef] sm:text-4xl">How it works</h2>
              <p className="mt-3 text-sm leading-6 text-[#9ba69f] sm:text-base">From picking a prompt to understanding what to try next.</p>
            </header>
            <div className="grid grid-cols-1 border-l border-t border-white/[0.085] sm:grid-cols-2 lg:grid-cols-4">
              <Step number="1" title="Choose Topic" description="Select from our curated list of GD topics" />
              <Step number="2" title="Enter Your Name" description="Let us know who you are" />
              <Step number="3" title="Start Discussing" description="Speak your points using voice or text" />
              <Step number="4" title="Get Feedback" description="Receive scores and insights to improve" />
            </div>
          </section>

          {/* CTA Section */}
          <div className="relative mb-10 overflow-hidden border border-white/[0.09] bg-[#0f1516] px-6 py-10 text-center sm:px-10 sm:py-14">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(195,232,121,.12),transparent_58%)]" />
            <div className="relative mx-auto max-w-2xl">
              <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[.18em] text-[#8ee5d0]">Your next discussion starts here</p>
              <h2 className="text-3xl font-semibold tracking-[-.04em] text-[#f3f5ef] sm:text-4xl">Ready to join the conversation?</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#9ba69f] sm:text-base">Choose a topic, gather your thoughts, and practice at your own pace.</p>
              <Link
                to="/"
                className="group mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#c3e879] px-6 py-3 font-semibold text-[#17200d] shadow-[0_10px_30px_rgba(195,232,121,.1)] transition hover:bg-[#d1ef93] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c3e879]"
              >
                <span>Start a practice session</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <p className="mt-4 text-xs text-[#758179]">No sign-up required · Free to use</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StepProps {
  number: string;
  title: string;
  description: string;
}

const Step = ({ number, title, description }: StepProps) => {
  return (
    <div className="relative flex min-h-[190px] flex-col border-b border-r border-white/[0.085] bg-[#0f1516] p-5 sm:p-6">
      <span className="mb-8 flex h-9 w-9 items-center justify-center rounded-lg border border-[#8ee5d0]/20 bg-[#8ee5d0]/[0.06] font-mono text-xs font-semibold text-[#8ee5d0]">
        {number.padStart(2, '0')}
      </span>
      <h3 className="text-base font-semibold text-[#f0f3ee]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#9aa69f]">{description}</p>
    </div>
  );
};

export default AboutUs;
