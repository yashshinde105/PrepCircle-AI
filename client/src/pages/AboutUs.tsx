import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Brain, Target, Zap, Trophy, Users, Sparkles, ArrowRight } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <img src="/logo.png" alt="PrepCircle AI" className="h-16 w-16 rounded-2xl" />
            </div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-[#c3e879]">Made for practice, built around people</p>
            <h1 className="text-4xl md:text-6xl font-semibold text-white mb-5 tracking-tight">
              Better conversations start with practice.
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              PrepCircle gives you a low-pressure place to organize your thoughts, hear another point of view, and get more comfortable speaking in a group.
            </p>
          </div>

          {/* Mission Section */}
          <div className="glass-effect rounded-xl p-7 md:p-10 mb-10">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center">
              <Target className="h-8 w-8 mr-3 text-purple-400" />
              Our Mission
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              We believe that effective communication and critical thinking are essential skills 
              for success in today's world. PrepCircle AI was created to help job seekers, students, 
              and professionals practice group discussions in a safe, AI-powered environment. 
              Our platform provides real-time feedback, intelligent challenges, and comprehensive 
              performance analytics to help you improve faster.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <FeatureCard
              icon={<Brain className="h-10 w-10" />}
              title="Two AI perspectives"
              description="Practice with Bob and Jannet, who bring different perspectives to your discussion."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10" />}
              title="Real-Time Feedback"
              description="Get instant scoring on relevance, strength, and engagement after each contribution."
            />
            <FeatureCard
              icon={<Trophy className="h-10 w-10" />}
              title="Progress you can review"
              description="Track your progress over time with detailed analytics, leaderboards, and contribution-by-contribution feedback."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10" />}
              title="Interview Preparation"
              description="Designed for job interview group discussions with realistic scenarios."
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
          <div className="glass-effect rounded-xl p-7 md:p-10 mb-10">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              How It Works
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Step number="1" title="Choose Topic" description="Select from our curated list of GD topics" />
              <Step number="2" title="Enter Your Name" description="Let us know who you are" />
              <Step number="3" title="Start Discussing" description="Speak your points using voice or text" />
              <Step number="4" title="Get Feedback" description="Receive scores and insights to improve" />
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg bg-[#c3e879] px-6 py-3.5 font-semibold text-[#17200d] transition-colors hover:bg-[#d1ef93]"
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
    <div className="rounded-xl border border-white/[0.08] bg-[#131918] p-6 transition-colors hover:bg-[#171f1b]">
        <div className="w-12 h-12 rounded-lg bg-[#c3e879]/10 flex items-center justify-center mb-4 text-[#c3e879]">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
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

export default AboutUs;
