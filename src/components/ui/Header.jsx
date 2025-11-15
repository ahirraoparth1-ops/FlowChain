import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../hooks/useAuth.jsx';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

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
    },
    ...(isAuthenticated ? [{
      path: '/profile',
      label: 'Profile',
      icon: 'User',
      description: 'Manage your profile settings'
    }] : [])
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
        <div className="flex h-20 items-center px-4 lg:px-6">
          {/* Logo and Titles */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Icon name="TrendingUp" size={24} color="white" />
              </div>
              <span className="font-bold text-2xl text-foreground">
                FlowChain
              </span>
            </div>
            <span className="text-sm text-muted-foreground ml-12 -mt-1">
              AI powered supply chain
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
            {isAuthenticated && (
              <>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Icon name="Bell" size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Icon name="Settings" size={18} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10"
                  onClick={() => handleNavigation('/profile')}
                >
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <Icon name="User" size={18} />
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={logout}
                  className="ml-2"
                >
                  Logout
                </Button>
              </>
            )}
            {!isAuthenticated && (
              <Button 
                variant="default" 
                size="sm"
                onClick={() => window.location.href = '/api/login'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Login with Google
              </Button>
            )}
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
                  {isAuthenticated && (
                    <>
                      <Button variant="ghost" className="justify-start">
                        <Icon name="Bell" size={18} className="mr-3" />
                        Notifications
                      </Button>
                      <Button variant="ghost" className="justify-start">
                        <Icon name="Settings" size={18} className="mr-3" />
                        Settings
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="justify-start"
                        onClick={() => handleNavigation('/profile')}
                      >
                        <Icon name="User" size={18} className="mr-3" />
                        Profile
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="justify-start text-red-600"
                        onClick={logout}
                      >
                        <Icon name="LogOut" size={18} className="mr-3" />
                        Logout
                      </Button>
                    </>
                  )}
                  {!isAuthenticated && (
                    <Button 
                      variant="default" 
                      className="justify-center bg-blue-600 hover:bg-blue-700"
                      onClick={() => window.location.href = '/api/login'}
                    >
                      <Icon name="LogIn" size={18} className="mr-3" />
                      Login with Google
                    </Button>
                  )}
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