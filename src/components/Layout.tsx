import React, { ReactNode } from 'react';
import { Home, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-primary-600" />
              <h1 className="ml-2 text-xl font-bold text-neutral-900">
                Mortgage<span className="text-primary-600">Vision</span>
              </h1>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-neutral-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                Calculator
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                Rates
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                Learning Center
              </a>
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
                <a 
                  href="#" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-900 bg-neutral-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Calculator
                </a>
                <a 
                  href="#" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Rates
                </a>
                <a 
                  href="#" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Learning Center
                </a>
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
                MortgageVision
              </span>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-center md:text-right text-sm text-neutral-500">
                &copy; {new Date().getFullYear()} MortgageVision. All rights reserved.
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