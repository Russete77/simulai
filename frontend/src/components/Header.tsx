import React, { useState } from 'react';
import { Menu, X, Brain, Scale, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './Auth/AuthModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { user, signOut } = useAuth();

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              SIMULAI OAB
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
              Funcionalidades
            </a>
            <a href="#ai-features" className="text-gray-700 hover:text-blue-600 transition-colors">
              IA Integrada
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              Preços
            </a>
            <a href="#community" className="text-gray-700 hover:text-blue-600 transition-colors">
              Comunidade
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-red-600 transition-colors flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Sair
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleAuthClick('login')}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Entrar
                </button>
                <button
                  onClick={() => handleAuthClick('signup')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Começar Grátis
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <nav className="py-4 space-y-2">
              <a href="#features" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                Funcionalidades
              </a>
              <a href="#ai-features" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                IA Integrada
              </a>
              <a href="#pricing" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                Preços
              </a>
              <a href="#community" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                Comunidade
              </a>
              {user ? (
                <div className="px-4 py-2 space-y-2">
                  <div className="flex items-center space-x-2 py-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left text-red-600 hover:text-red-700 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </button>
                </div>
              ) : (
                <div className="px-4 py-2 space-y-2">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="w-full text-left text-gray-700 hover:text-blue-600"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                  >
                    Começar Grátis
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Header;