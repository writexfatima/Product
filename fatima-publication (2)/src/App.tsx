import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/views/HomeView';
import AboutView from './components/views/AboutView';
import BookstoreView from './components/views/BookstoreView';
import JoinView from './components/views/JoinView';
import SubmitManuscriptView from './components/views/SubmitManuscriptView';
import PublishView from './components/views/PublishView';
import AdminView from './components/views/AdminView';
import GalleryView from './components/views/GalleryView';
import { StorageService, setSimulationMode, getSimulationMode } from './db/firebase';
import { Book } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => getSimulationMode());
  const [user, setUser] = useState<{ email: string; displayName: string } | null>(() => {
    return getSimulationMode() ? { email: 'mohd.fahad98871@gmail.com', displayName: 'Mohd Fahad (Admin)' } : null;
  });
  const [memberCount, setMemberCount] = useState<number>(0);
  const [settings, setSettings] = useState<any>(null);

  // Bookstore details focus
  const [selectedDetailBook, setSelectedDetailBook] = useState<Book | null>(null);

  // Address variables for matching footer
  const contactAddress = settings?.contactAddress || "Fatima House, 12/A Literary Lane, Writers Block, New Delhi, India";
  const contactEmail = settings?.contactEmail || "contact@fatimapublication.com";
  const contactPhone = settings?.contactPhone || "+91 98871 XXXXX";

  const loadSettings = async () => {
    try {
      const appSet = await StorageService.getSettings();
      setSettings(appSet);
    } catch (e) {
      console.error(e);
    }
  };

  const loadMemberCount = async () => {
    try {
      const list = await StorageService.getMembers();
      setMemberCount(list.length);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSettings();
    loadMemberCount();
  }, []);

  const handleLogin = () => {
    // Emulates direct login session credentials
    setUser({
      email: 'mohd.fahad98871@gmail.com',
      displayName: 'Mohd Fahad (Admin)'
    });
    // Turn admin sandbox mode on directly upon login to facilitate testing as requested
    setIsAdminMode(true);
    setSimulationMode(true);
    setCurrentPage('admin');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdminMode(false);
    setSimulationMode(false);
    setCurrentPage('home');
  };

  const onMemberRegistered = () => {
    loadMemberCount();
  };

  // Route detail focus from Home featured book cards
  const handleViewBookDetails = (book: Book) => {
    setSelectedDetailBook(book);
    setCurrentPage('bookstore');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isAdminMode={isAdminMode}
        setIsAdminMode={(mode) => {
          setIsAdminMode(mode);
          setSimulationMode(mode);
          if (mode) {
            setUser({
              email: 'mohd.fahad98871@gmail.com',
              displayName: 'Mohd Fahad (Admin)'
            });
          } else {
            setUser(null);
          }
        }}
        memberCount={memberCount}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        siteName={settings?.siteName}
        siteIconUrl={settings?.siteIconUrl}
        visibleNavPages={settings?.visibleNavPages}
        settings={settings}
      />

      <div className="flex-grow">
        {currentPage === 'home' && (
          <HomeView
            setCurrentPage={setCurrentPage}
            onViewBookDetails={handleViewBookDetails}
            settings={settings}
          />
        )}
        {currentPage === 'about' && (
          <AboutView />
        )}
        {currentPage === 'bookstore' && (
          <BookstoreView
            selectedDetailBook={selectedDetailBook}
            setSelectedDetailBook={setSelectedDetailBook}
          />
        )}
        {currentPage === 'join' && (
          <JoinView
            memberCount={memberCount}
            onMemberRegistered={onMemberRegistered}
          />
        )}
        {currentPage === 'manuscript' && (
          <SubmitManuscriptView />
        )}
        {currentPage === 'publish' && (
          <PublishView />
        )}
        {currentPage === 'gallery' && (
          <GalleryView />
        )}
        {currentPage === 'admin' && (
          <AdminView onSettingsUpdated={loadSettings} />
        )}
      </div>

      <Footer
        setCurrentPage={setCurrentPage}
        contactAddress={contactAddress}
        contactEmail={contactEmail}
        contactPhone={contactPhone}
        siteName={settings?.siteName}
        siteIconUrl={settings?.siteIconUrl}
      />
    </div>
  );
}
