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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled 
          ? 'bg-[#0c1010]/95 backdrop-blur-xl border-b border-white/[0.08]'
          : 'bg-[#0c1010]/70 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[72px]">
            {/* Logo & Brand */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <img 
                src="/logo.png" 
                alt="PrepCircle AI Logo" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl"
              />
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-semibold text-[#f0f3ed] tracking-tight">
                  PrepCircle AI
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium tracking-[.12em] uppercase hidden sm:block">
                  Practice with purpose
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center gap-1">
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
                className="ml-3 flex items-center gap-2 rounded-lg bg-[#c3e879] px-4 py-2.5 text-sm font-semibold text-[#17200d] transition-colors hover:bg-[#d1ef93]"
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
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
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
        <div id="mobile-navigation" className={`md:hidden absolute top-full left-0 right-0 bg-[#101514] border-b border-white/[0.08]
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
                className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#c3e879] py-3 text-sm font-semibold text-[#17200d] transition-colors hover:bg-[#d1ef93]"
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
      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
        active
          ? 'bg-white/[0.055] text-[#f0f3ed] border border-white/[0.08]'
          : 'text-[#9ba69e] hover:text-white hover:bg-white/[0.04] border border-transparent'
      }`}
    >
      <span className={active ? 'text-[#c3e879]' : ''}>{icon}</span>
      <span className="font-medium text-sm">{children}</span>
    </Link>
  );
};

const MobileNavLink = ({ to, icon, active, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg transition-colors duration-200 ${
        active
          ? 'bg-[#c3e879]/10 text-white border border-[#c3e879]/20'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <span className={active ? 'text-[#c3e879]' : ''}>{icon}</span>
      <span className="font-medium text-sm sm:text-base">{children}</span>
    </Link>
  );
};

export default Navbar;
