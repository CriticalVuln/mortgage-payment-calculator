import React, { ReactNode } from 'react';
import { Home, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type AppView = 'calculator' | 'rates' | 'learning' | 'article';

interface LayoutProps {
  children: ReactNode;
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleNavClick = (view: AppView) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  const getNavItemClass = (view: AppView) => {
    const isActive = currentView === view || (currentView === 'article' && view === 'learning');
    return isActive 
      ? "text-neutral-900 hover:text-primary-600 px-3 py-2 text-sm font-medium bg-primary-50 rounded-md"
      : "text-neutral-500 hover:text-primary-600 px-3 py-2 text-sm font-medium";
  };

  const getMobileNavItemClass = (view: AppView) => {
    const isActive = currentView === view || (currentView === 'article' && view === 'learning');
    return isActive
      ? "block px-3 py-2 rounded-md text-base font-medium text-neutral-900 bg-neutral-50"
      : "block px-3 py-2 rounded-md text-base font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50";
  };
  
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-primary-600" />
              <h1 className="ml-2 text-xl font-bold text-neutral-900">
                My Mortgage <span className="text-primary-600">Calc</span>
              </h1>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => handleNavClick('calculator')}
                className={getNavItemClass('calculator')}
              >
                Calculator
              </button>
              <button
                onClick={() => handleNavClick('rates')}
                className={getNavItemClass('rates')}
              >
                Rates
              </button>
              <button
                onClick={() => handleNavClick('learning')}
                className={getNavItemClass('learning')}
              >
                Learning Center
              </button>
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                type="button"
                className="p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden bg-white shadow-lg"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <button
                  onClick={() => handleNavClick('calculator')}
                  className={getMobileNavItemClass('calculator')}
                >
                  Calculator
                </button>
                <button
                  onClick={() => handleNavClick('rates')}
                  className={getMobileNavItemClass('rates')}
                >
                  Rates
                </button>
                <button
                  onClick={() => handleNavClick('learning')}
                  className={getMobileNavItemClass('learning')}
                >
                  Learning Center
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <Home className="h-6 w-6 text-primary-600" />
              <span className="ml-2 text-base font-medium text-neutral-900">
                My Mortgage Calc
              </span>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-center md:text-right text-sm text-neutral-500">
                &copy; {new Date().getFullYear()} My Mortgage Calc. All rights reserved.
              </p>
              <p className="text-center md:text-right text-xs text-neutral-400 mt-1">
                This calculator provides estimates only. Consult with a mortgage professional for accurate rates.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;