import { Link, useLocation } from 'react-router-dom';
import { Home, Info, Trophy, Sparkles, Menu, X, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[#0a0a1a]/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Logo & Brand */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <img 
                src="/logo.png" 
                alt="PrepCircle AI Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14"
              />
              <div className="flex flex-col">
                <span className="text-base sm:text-lg lg:text-2xl font-bold gradient-text tracking-tight">
                  PrepCircle AI
                </span>
                <span className="text-[8px] sm:text-[10px] lg:text-xs text-slate-500 font-medium tracking-wider uppercase hidden sm:block">
                  Master GD Interviews
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
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
              
              <NavLink 
                to="/history" 
                icon={<Clock className="h-4 w-4" />}
                active={isActive('/history')}
              >
                History
              </NavLink>

              {/* CTA Button */}
              <Link
                to="/"
                className="ml-2 lg:ml-4 flex items-center gap-2 px-3 lg:px-5 py-2 lg:py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 
                         hover:from-violet-500 hover:to-indigo-500 text-white text-xs lg:text-sm font-semibold rounded-lg lg:rounded-xl 
                         shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 
                         transform hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="h-3 w-3 lg:h-4 lg:w-4" />
                Start Practice
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-[#0a0a1a]/98 backdrop-blur-xl border-b border-white/5 
                        transition-all duration-300 ease-out ${
          isMobileMenuOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-1.5 sm:space-y-2">
            <MobileNavLink to="/" icon={<Home className="h-4 w-4 sm:h-5 sm:w-5" />} active={isActive('/')}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/about" icon={<Info className="h-4 w-4 sm:h-5 sm:w-5" />} active={isActive('/about')}>
              About Us
            </MobileNavLink>
            <MobileNavLink to="/leaderboard" icon={<Trophy className="h-4 w-4 sm:h-5 sm:w-5" />} active={isActive('/leaderboard')}>
              Leaderboard
            </MobileNavLink>
            <MobileNavLink to="/history" icon={<Clock className="h-4 w-4 sm:h-5 sm:w-5" />} active={isActive('/history')}>
              History
            </MobileNavLink>
            
            <div className="pt-3 sm:pt-4">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 bg-gradient-to-r from-violet-600 to-indigo-600 
                         text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg"
              >
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                Start Practice
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
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
      className={`flex items-center space-x-1.5 lg:space-x-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg lg:rounded-xl transition-all duration-300 ${
        active
          ? 'bg-white/10 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10'
          : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
      }`}
    >
      <span className={active ? 'text-purple-400' : ''}>{icon}</span>
      <span className="font-medium text-xs lg:text-sm">{children}</span>
    </Link>
  );
};

const MobileNavLink = ({ to, icon, active, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl transition-all duration-300 ${
        active
          ? 'bg-purple-500/20 text-white border border-purple-500/30'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <span className={active ? 'text-purple-400' : ''}>{icon}</span>
      <span className="font-medium text-sm sm:text-base">{children}</span>
    </Link>
  );
};

export default Navbar;
