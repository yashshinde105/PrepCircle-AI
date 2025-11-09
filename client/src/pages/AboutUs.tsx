import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Brain, Target, Zap, Trophy, Users, Sparkles, ArrowRight } from 'lucide-react';
import { GlowingEffect } from '../components/ui/glowing-effect';

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Brain className="h-12 w-12 text-purple-400" />
              <Sparkles className="h-8 w-8 text-blue-400 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
              About AI Debator
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Revolutionizing debate practice with cutting-edge AI technology. 
              Prepare for interviews, sharpen your arguments, and master the art of persuasion.
            </p>
          </div>

          {/* Mission Section */}
          <div className="glass-effect rounded-2xl p-8 md:p-12 mb-12 border border-purple-500/20">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center">
              <Target className="h-8 w-8 mr-3 text-purple-400" />
              Our Mission
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              We believe that effective communication and critical thinking are essential skills 
              for success in today's world. AI Debator was created to help job seekers, students, 
              and professionals practice group discussions and debates in a safe, AI-powered environment. 
              Our platform provides real-time feedback, intelligent challenges, and comprehensive 
              performance analytics to help you improve faster.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <FeatureCard
              icon={<Brain className="h-10 w-10" />}
              title="AI-Powered Intelligence"
              description="Practice with an intelligent AI moderator powered by Google Gemini that adapts to your arguments and challenges your thinking."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10" />}
              title="Real-Time Feedback"
              description="Get instant scoring on relevance, strength, and engagement. Know exactly where you stand after each round."
            />
            <FeatureCard
              icon={<Trophy className="h-10 w-10" />}
              title="Performance Tracking"
              description="Track your progress over time with detailed analytics, leaderboards, and round-by-round breakdowns."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10" />}
              title="Interview Preparation"
              description="Specifically designed for GD (Group Discussion) rounds in job interviews with realistic scenarios."
            />
            <FeatureCard
              icon={<Sparkles className="h-10 w-10" />}
              title="Voice Integration"
              description="Speak naturally using voice recognition and hear AI responses with text-to-speech technology."
            />
            <FeatureCard
              icon={<Target className="h-10 w-10" />}
              title="Diverse Topics"
              description="Practice with topics across Technology, Society, Ethics, Business, and more at varying difficulty levels."
            />
          </div>

          {/* How It Works */}
          <div className="glass-effect rounded-2xl p-8 md:p-12 mb-12 border border-blue-500/20">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              How It Works
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Step number="1" title="Choose Topic" description="Select from our curated list of debate topics" />
              <Step number="2" title="Pick Your Stance" description="Decide whether you're arguing for or against" />
              <Step number="3" title="Start Debating" description="Speak your arguments using voice or text" />
              <Step number="4" title="Get Feedback" description="Receive scores and insights to improve" />
            </div>
          </div>

          {/* Technology Stack */}
          <div className="glass-effect rounded-2xl p-8 md:p-12 mb-12 border border-purple-500/20">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Built with Modern Technology
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <TechBadge>React 18</TechBadge>
              <TechBadge>TypeScript</TechBadge>
              <TechBadge>Google Gemini AI</TechBadge>
              <TechBadge>Node.js</TechBadge>
              <TechBadge>Socket.io</TechBadge>
              <TechBadge>Web Speech API</TechBadge>
              <TechBadge>Tailwind CSS</TechBadge>
              <TechBadge>Vite</TechBadge>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 
                       text-white font-semibold rounded-xl hover:from-purple-500 hover:to-blue-500 
                       transform hover:scale-105 transition-all duration-200 shadow-lg shadow-purple-500/50"
            >
              <span>Start Practicing Now</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-gray-400 mt-4">No sign-up required • Completely free</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="relative rounded-2xl border border-white/5 p-2 bg-white/[0.02]">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
      />
      <div className="bg-[#1a1a2e]/50 backdrop-blur-sm rounded-xl p-6 transition-all duration-200 group hover:transform hover:scale-105">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 
                        flex items-center justify-center mb-4 text-purple-400 group-hover:text-purple-300 
                        transition-colors shadow-lg shadow-purple-500/20">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
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
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 
                      flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
        {number}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
};

const TechBadge = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 
                     border border-purple-500/30 text-purple-300 font-medium text-sm">
      {children}
    </span>
  );
};

export default AboutUs;
