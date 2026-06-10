import React, { useState } from 'react';
import { BookOpen, Menu, X, Shield, User, LogOut, Check } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  memberCount: number;
  user: { email: string; displayName: string; photoURL?: string } | null;
  onLogin: () => void;
  onLogout: () => void;
  siteName?: string;
  siteIconUrl?: string;
  visibleNavPages?: string[];
  settings?: any;
}

export default function Header({
  currentPage,
  setCurrentPage,
  isAdminMode,
  setIsAdminMode,
  memberCount,
  user,
  onLogin,
  onLogout,
  siteName,
  siteIconUrl,
  visibleNavPages,
  settings
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: settings?.navLabelHome || 'Home' },
    { id: 'bookstore', label: settings?.navLabelBookstore || 'Bookstore' },
    { id: 'about', label: settings?.navLabelAbout || 'About' },
    { id: 'gallery', label: settings?.navLabelGallery || 'Gallery' },
    { id: 'join', label: settings?.navLabelJoin || 'Join' },
    { id: 'publish', label: settings?.navLabelPublish || 'Publish' },
    { id: 'manuscript', label: settings?.navLabelManuscript || 'Submit' }
  ];

  const visibleNavs = navItems.filter(item => 
    !visibleNavPages || visibleNavPages.includes(item.id)
  );

  return (
    <header id="app-header" className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setCurrentPage('home')}>
            {siteIconUrl ? (
              <img src={siteIconUrl} alt="Logo" referrerPolicy="no-referrer" className="w-8 h-8 object-contain shrink-0 rounded-lg" />
            ) : (
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center shrink-0">
                <div className="w-4 h-4 border-2 border-white rounded-xs rotate-45"></div>
              </div>
            )}
            <div className="flex flex-col text-left">
              <span className="text-md sm:text-lg font-bold tracking-tight text-gray-900 uppercase">
                {siteName || 'FATIMA PUBLICATION'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-1.5 items-center shrink-0 flex-nowrap">
            {visibleNavs.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsOpen(false);
                }}
                className={`px-2 lg:px-3 py-1.5 rounded-lg text-xs font-semibold font-sans tracking-wide transition-all h-8 flex items-center border shrink-0 ${
                  currentPage === item.id
                    ? 'text-teal-750 bg-teal-50/80 border-teal-100 font-bold shadow-xs'
                    : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50 border-transparent'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-1.5 lg:space-x-2.5 shrink-0 flex-nowrap">
            {/* Community Counter Pill */}
            <div className="bg-gray-50/85 px-2.5 py-1.5 rounded-lg border border-gray-100 text-[11px] lg:text-xs font-mono text-gray-700 flex items-center space-x-1.5 h-8 shrink-0">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{memberCount + 148} Members</span>
            </div>

            {/* Quick Admin Simulation Bypass */}
            <button
              id="admin-bypass-toggle"
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                if (!isAdminMode) setCurrentPage('admin');
                else setCurrentPage('home');
              }}
              className={`text-[11px] lg:text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all flex items-center space-x-1.5 cursor-pointer h-8 shrink-0 ${
                isAdminMode
                  ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-inner'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
              }`}
              title="Toggle Sandbox Admin Mode"
            >
              <Shield className={`h-3.5 w-3.5 ${isAdminMode ? 'text-amber-500 animate-spin' : 'text-gray-400'}`} />
              <span>{isAdminMode ? 'Sandbox ON' : 'Test Admin'}</span>
            </button>

            {/* User Session Profile controls */}
            {user ? (
              <div className="flex items-center space-x-2 shrink-0 flex-nowrap">
                <span className="text-[11px] lg:text-xs font-medium text-gray-700 truncate max-w-[100px] lg:max-w-none" title={user.email}>
                  {user.displayName}
                </span>
                <button
                  onClick={onLogout}
                  className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-50 transition shrink-0"
                  title="Logout"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="text-[11px] lg:text-xs bg-gray-900 text-white font-medium hover:bg-gray-800 px-2.5 py-1.5 rounded-lg flex items-center space-x-1 transition h-8 shrink-0"
              >
                <User className="h-3.5 w-3.5" />
                <span>Google Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                if (!isAdminMode) setCurrentPage('admin');
                else setCurrentPage('home');
              }}
              className={`p-1.5 rounded-lg border text-xs flex items-center space-x-1 ${
                isAdminMode ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span className="text-[10px] font-mono">{isAdminMode ? 'Sandbox' : 'Admin'}</span>
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 z-40 transition-all duration-200">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {visibleNavs.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-teal-600 bg-teal-50'
                    : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-4 pb-2 border-t border-gray-100 mt-2">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                <span className="text-xs text-gray-500 font-mono">{siteName || 'Fatima'} Community Stats</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded-full font-bold">
                  {memberCount + 148} Users
                </span>
              </div>
              
              <div className="mt-2 space-y-2 px-1">
                {user ? (
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="text-sm font-medium text-gray-700">{user.displayName}</span>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsOpen(false);
                      }}
                      className="text-xs text-red-600 flex items-center space-x-1"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onLogin();
                      setIsOpen(false);
                    }}
                    className="w-full text-center py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                  >
                    Google Authorisation Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
