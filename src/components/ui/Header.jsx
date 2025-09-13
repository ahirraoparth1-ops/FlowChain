import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      path: '/landing-page',
      label: 'Home',
      icon: 'Home',
      description: 'Platform overview and introduction'
    },
    {
      path: '/data-upload',
      label: 'Upload',
      icon: 'Upload',
      description: 'Submit data files for processing'
    },
    {
      path: '/forecast-dashboard',
      label: 'Dashboard',
      icon: 'BarChart3',
      description: 'Analyze forecast visualizations'
    },
    {
      path: '/ai-insights',
      label: 'Insights',
      icon: 'Lightbulb',
      description: 'AI-generated recommendations'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location?.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  return (
    <>
      <header className={`sticky top-0 z-50 w-full bg-card border-b border-border nav-transition ${
        isScrolled ? 'shadow-sm' : ''
      }`}>
        <div className="flex h-16 items-center px-4 lg:px-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Icon name="TrendingUp" size={20} color="white" />
            </div>
            <span className="font-semibold text-lg text-foreground">
              AI Supply Chain
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 ml-8">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium nav-transition ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title={item?.description}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center ml-auto md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="h-10 w-10"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
            </Button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center ml-auto space-x-2">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Icon name="Bell" size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Icon name="Settings" size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Icon name="User" size={18} />
            </Button>
          </div>
        </div>
      </header>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-60 md:hidden">
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-16 bottom-0 w-80 bg-card border-r border-border shadow-lg animate-slide-in">
            <div className="flex flex-col p-4 space-y-2">
              {navigationItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left nav-transition ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <div className="flex flex-col">
                    <span className="font-medium">{item?.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {item?.description}
                    </span>
                  </div>
                </button>
              ))}
              
              <div className="border-t border-border pt-4 mt-4">
                <div className="flex flex-col space-y-2">
                  <Button variant="ghost" className="justify-start">
                    <Icon name="Bell" size={18} className="mr-3" />
                    Notifications
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <Icon name="Settings" size={18} className="mr-3" />
                    Settings
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <Icon name="User" size={18} className="mr-3" />
                    Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;