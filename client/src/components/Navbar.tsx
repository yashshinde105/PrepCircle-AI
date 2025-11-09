import { Link, useLocation } from 'react-router-dom';
import { Brain, Home, Info, Trophy, Sparkles } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f23]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center transition-all">
                <Brain className="h-6 w-6 text-white" />
                <Sparkles className="h-4 w-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <span className="text-2xl font-bold gradient-text">
              AI Debator
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink 
              to="/" 
              icon={<Home className="h-4 w-4" />}
              active={isActive('/')}
            >
              Home
            </NavLink>
            
            <NavLink 
              to="/about" 
              icon={<Info className="h-4 w-4" />}
              active={isActive('/about')}
            >
              About Us
            </NavLink>
            
            <NavLink 
              to="/leaderboard" 
              icon={<Trophy className="h-4 w-4" />}
              active={isActive('/leaderboard')}
            >
              Leaderboard
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  active: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, icon, active, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        active
          ? 'bg-white/5 text-white border border-purple-400/30'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="font-medium">{children}</span>
    </Link>
  );
};

export default Navbar;
