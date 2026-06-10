import React, { useState, useEffect } from 'react';
import {
  Book,
  Quote,
  TeamMember,
  TimelineEvent,
  ContactMessage,
  Member,
  Manuscript,
  PublishingPackage,
  PackageInquiry,
  Testimonial,
  PublishingPartner,
  AppSettings,
  UserProfile,
  GalleryItem
} from '../../types';
import { StorageService } from '../../db/firebase';
import {
  ShieldAlert,
  Database,
  Users,
  FileText,
  Mail,
  TrendingUp,
  Sliders,
  Plus,
  Trash,
  CheckCircle,
  Clock,
  Download,
  Edit2,
  Settings,
  X,
  ExternalLink,
  Info,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';

interface AdminViewProps {
  onSettingsUpdated?: () => void;
}

export default function AdminView({ onSettingsUpdated }: AdminViewProps) {
  // Navigation tabs inside admin
  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'manuscripts' | 'leads' | 'members' | 'messages' | 'content' | 'users' | 'gallery' | 'site-settings'>('overview');
  const [activeContentSubTab, setActiveContentSubTab] = useState<'slider' | 'quotes' | 'team' | 'timeline' | 'packages' | 'testimonials' | 'partners' | 'certificate'>('slider');

  // Load state indices
  const [books, setBooks] = useState<Book[]>([]);
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [leads, setLeads] = useState<PackageInquiry[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [packages, setPackages] = useState<PublishingPackage[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [partners, setPartners] = useState<PublishingPartner[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // Search filter for list rows
  const [memberSearch, setMemberSearch] = useState('');

  // Active form structures
  const [editingBook, setEditingBook] = useState<Partial<Book> | null>(null);
  const [editingHeroSlide, setEditingHeroSlide] = useState<any | null>(null);
  const [editingQuote, setEditingQuote] = useState<Partial<Quote> | null>(null);
  const [editingTeam, setEditingTeam] = useState<Partial<TeamMember> | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<TimelineEvent> | null>(null);
  const [editingPackage, setEditingPackage] = useState<Partial<PublishingPackage> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<PublishingPartner | null>(null);
  const [editingProfile, setEditingProfile] = useState<Partial<UserProfile> | null>(null);
  const [editingGalleryItem, setEditingGalleryItem] = useState<Partial<GalleryItem> | null>(null);

  // Load all datastores on anchor load
  const reloadAll = async () => {
    try {
      setBooks(await StorageService.getBooks());
      setManuscripts(await StorageService.getManuscripts());
      setLeads(await StorageService.getPackageInquiries());
      setMembers(await StorageService.getMembers());
      setMessages(await StorageService.getContactMessages());
      setQuotes(await StorageService.getQuotes());
      setTeam(await StorageService.getTeamMembers());
      setTimeline(await StorageService.getTimelineEvents());
      setPackages(await StorageService.getPackages());
      setTestimonials(await StorageService.getTestimonials());
      setPartners(await StorageService.getPartners());
      setSettings(await StorageService.getSettings());
      setHeroSlides(await StorageService.getHeroSlides());
      setProfiles(await StorageService.getUsers());
      setGalleryItems(await StorageService.getGalleryItems());
    } catch (e) {
      console.error('Error synchronizing database sets:', e);
    }
  };

  useEffect(() => {
    reloadAll();
  }, []);

  // Exporters for CSV as demanded by specifications
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportMembersToCSV = () => {
    if (members.length === 0) {
      alert('Community list is blank.');
      return;
    }
    const headers = 'ID,Full Name,Email,Phone,City,Occupation,Interests,Register Date\n';
    const rows = members.map(m => (
      `"${m.id}","${m.name}","${m.email}","${m.phone}","${m.city || ''}","${m.occupation || ''}","${m.interests || ''}","${m.createdAt}"`
    )).join('\n');
    downloadCSV(headers + rows, 'Fatima_Publication_Members_Export.csv');
  };

  const exportLeadsToCSV = () => {
    if (leads.length === 0) {
      alert('Package Lead Inquiries pipeline is blank.');
      return;
    }
    const headers = 'ID,Name,Email,Phone,Book Title,Selected Package,Additional Notes,Status,CreatedAt\n';
    const rows = leads.map(l => (
      `"${l.id}","${l.name}","${l.email}","${l.phone}","${l.bookTitle || ''}","${l.selectedPackage}","${l.additionalRequirements || ''}","${l.status}","${l.createdAt}"`
    )).join('\n');
    downloadCSV(headers + rows, 'Fatima_Publication_Leads_Export.csv');
  };

  // --- ACTIONS HANDLERS ---
  const saveBookAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook?.title || !editingBook?.author || !editingBook?.genre || !editingBook?.language || !editingBook?.price) {
      alert('Please fill out all mandatory Book elements (Title, Author, Genre, Language, Price).');
      return;
    }
    const savedBook: Book = {
      id: editingBook.id || 'b-' + Math.random().toString(36).substring(2, 9),
      title: editingBook.title,
      author: editingBook.author,
      genre: editingBook.genre,
      language: editingBook.language,
      price: editingBook.price,
      description: editingBook.description || '',
      coverUrl: editingBook.coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
      isAvailable: editingBook.isAvailable !== false,
      isFeatured: !!editingBook.isFeatured,
      purchaseLinks: editingBook.purchaseLinks || { amazon: 'https://amazon.com', kindle: 'https://amazon.com' },
      buyNowLink: editingBook.buyNowLink || '',
      createdAt: editingBook.createdAt || new Date().toISOString()
    };
    await StorageService.saveBook(savedBook);
    setEditingBook(null);
    reloadAll();
  };

  const deleteBook = async (id: string) => {
    if (window.confirm('Delete this Bookstore entry?')) {
      await StorageService.deleteBook(id);
      reloadAll();
    }
  };

  const updateManuscript = async (id: string, state: Manuscript['status'], logs: string) => {
    await StorageService.updateManuscriptStatus(id, state, logs);
    reloadAll();
    alert('Manuscript pipeline status changed successfully.');
  };

  const updateInquiryStatusAction = async (id: string, status: PackageInquiry['status']) => {
    await StorageService.updateInquiryStatus(id, status);
    reloadAll();
    alert('Consultation lead status synced.');
  };

  const deleteMessage = async (id: string) => {
    if (window.confirm('Erase this message card?')) {
      await StorageService.deleteContactMessage(id);
      reloadAll();
    }
  };

  const toggleMessageResolved = async (id: string, resolved: boolean) => {
    await StorageService.updateContactMessageStatus(id, resolved);
    reloadAll();
  };

  // Content Sub-tab builders
  const saveQuoteAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuote?.text || !editingQuote?.author) return;
    await StorageService.saveQuote({
      id: editingQuote.id || 'q-' + Math.random().toString(36).substring(2, 9),
      text: editingQuote.text,
      author: editingQuote.author,
      createdAt: new Date().toISOString()
    });
    setEditingQuote(null);
    reloadAll();
  };

  const saveTeamAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam?.name || !editingTeam?.designation) return;
    await StorageService.saveTeamMember({
      id: editingTeam.id || 't-' + Math.random().toString(36).substring(2, 9),
      name: editingTeam.name,
      designation: editingTeam.designation,
      biography: editingTeam.biography || '',
      imageUrl: editingTeam.imageUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      createdAt: new Date().toISOString()
    });
    setEditingTeam(null);
    reloadAll();
  };

  const saveEventAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent?.year || !editingEvent?.title) return;
    await StorageService.saveTimelineEvent({
      id: editingEvent.id || 'e-' + Math.random().toString(36).substring(2, 9),
      year: editingEvent.year,
      title: editingEvent.title,
      description: editingEvent.description || '',
      createdAt: new Date().toISOString()
    });
    setEditingEvent(null);
    reloadAll();
  };

  const savePackageAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage?.name || !editingPackage?.price) return;
    await StorageService.savePackage({
      id: editingPackage.id || 'p-' + Math.random().toString(36).substring(2, 9),
      name: editingPackage.name,
      price: editingPackage.price,
      description: editingPackage.description || '',
      features: Array.isArray(editingPackage.features) ? editingPackage.features : [editingPackage.features || ''],
      createdAt: new Date().toISOString()
    });
    setEditingPackage(null);
    reloadAll();
  };

  const saveTestimonialAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial?.name || !editingTestimonial?.text) return;
    await StorageService.saveTestimonial({
      id: editingTestimonial.id || 't-' + Math.random().toString(36).substring(2, 9),
      name: editingTestimonial.name,
      relation: editingTestimonial.relation || '',
      text: editingTestimonial.text,
      rating: Number(editingTestimonial.rating || 5),
      createdAt: new Date().toISOString()
    });
    setEditingTestimonial(null);
    reloadAll();
  };

  const savePartnerAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartner) return;
    await StorageService.savePartner(selectedPartner);
    setSelectedPartner(null);
    reloadAll();
    alert('Affiliate platform URLs updated.');
  };

  // User profiles actions
  const saveProfileAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile?.displayName || !editingProfile?.email) return;
    const generatedId = editingProfile.id || 'u-' + Math.random().toString(36).substring(2, 9);
    await StorageService.saveUser({
      id: generatedId,
      displayName: editingProfile.displayName,
      email: editingProfile.email,
      role: editingProfile.role || 'public',
      createdAt: editingProfile.createdAt || new Date().toISOString()
    });
    setEditingProfile(null);
    reloadAll();
    alert('User profile saved successfully.');
  };

  const removeProfileAction = async (id: string) => {
    if (id === 'u-1') {
      alert('The primary dynamic administrator cannot be removed.');
      return;
    }
    if (window.confirm('Delete this user profile permanently?')) {
      await StorageService.deleteUser(id);
      reloadAll();
    }
  };

  // Gallery items actions
  const saveGalleryAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGalleryItem?.imageUrl || !editingGalleryItem?.title) return;
    const generatedId = editingGalleryItem.id || 'g-' + Math.random().toString(36).substring(2, 9);
    await StorageService.saveGalleryItem({
      id: generatedId,
      imageUrl: editingGalleryItem.imageUrl,
      title: editingGalleryItem.title,
      description: editingGalleryItem.description || '',
      createdAt: editingGalleryItem.createdAt || new Date().toISOString()
    });
    setEditingGalleryItem(null);
    reloadAll();
    alert('Gallery item saved successfully.');
  };

  const removeGalleryAction = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this showcase image from the gallery?')) {
      await StorageService.deleteGalleryItem(id);
      reloadAll();
    }
  };

  // Site Preferences Settings action
  const saveSitePreferencesAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    await StorageService.saveSettings(settings);
    alert('Site Preferences Updated Successfully.');
    if (onSettingsUpdated) {
      onSettingsUpdated();
    }
  };

  return (
    <div id="admin-dashboard-container" className="animate-fade-in flex flex-col md:flex-row min-h-screen bg-gray-50 text-left text-sm text-gray-800">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-100 p-5 shrink-0 border-r border-slate-950 flex flex-col justify-between font-sans">
        <div>
          <div className="flex items-center space-x-2.5 mb-8">
            <ShieldAlert className="h-5 w-5 text-amber-500 animate-pulse shrink-0" />
            <div>
              <span className="font-serif text-md font-bold text-white block">Fatima Publication</span>
              <span className="text-[10px] text-amber-500 font-mono uppercase tracking-wider">Console Console</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-mono font-semibold flex items-center space-x-2.5 transition ${
                activeTab === 'overview' ? 'bg-teal-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Database className="h-4.5 w-4.5" />
              <span>DASHBOARD OVERVIEW</span>
            </button>

            <button
              onClick={() => setActiveTab('books')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-mono font-semibold flex items-center space-x-2.5 transition ${
                activeTab === 'books' ? 'bg-teal-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <FileText className="h-4.5 w-4.5" />
              <span>BOOKS MANAGER</span>
            </button>

            <button
              onClick={() => setActiveTab('manuscripts')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-mono font-semibold flex items-center space-x-2.5 transition ${
                activeTab === 'manuscripts' ? 'bg-teal-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Plus className="h-4.5 w-4.5" />
              <span>MANUSCRIPTS DESK</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-mono font-semibold flex items-center space-x-2.5 transition ${
                activeTab === 'leads' ? 'bg-teal-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <TrendingUp className="h-4.5 w-4.5" />
              <span>PUBLISHING LEADS</span>
            </button>

            <button
              onClick={() => setActiveTab('members')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-mono font-semibold flex items-center space-x-2.5 transition ${
                activeTab === 'members' ? 'bg-teal-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Users className="h-4.5 w-4.5" />
              <span>COMMUNITY MEMBERS</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-mono font-semibold flex items-center space-x-2.5 transition ${
                activeTab === 'messages' ? 'bg-teal-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Mail className="h-4.5 w-4.5" />
              <span>CONTACT INQUIRIES</span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-mono font-semibold flex items-center space-x-2.5 transition ${
                activeTab === 'content' ? 'bg-teal-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Sliders className="h-4.5 w-4.5" />
              <span>LAYOUTS & CONTENT</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-mono font-semibold flex items-center space-x-2.5 transition ${
                activeTab === 'users' ? 'bg-teal-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Users className="h-4.5 w-4.5" />
              <span>USER PROFILES (ADMIN)</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-mono font-semibold flex items-center space-x-2.5 transition ${
                activeTab === 'gallery' ? 'bg-teal-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <ImageIcon className="h-4.5 w-4.5" />
              <span>GALLERY MANAGER</span>
            </button>

            <button
              onClick={() => setActiveTab('site-settings')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-mono font-semibold flex items-center space-x-2.5 transition ${
                activeTab === 'site-settings' ? 'bg-teal-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Settings className="h-4.5 w-4.5" />
              <span>SITE PREFERENCES</span>
            </button>
          </nav>
        </div>

        <div className="pt-8 border-t border-slate-850 text-[10px] font-mono text-slate-400">
          <p>AUTHORIZED SESSION</p>
          <p className="text-amber-500 font-bold">mohd.fahad98871@gmail.com</p>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto max-w-7xl">
        
        {/* ======================= TAB: OVERVIEW ======================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in text-left">
            <h1 className="font-serif text-2xl font-bold text-gray-900">Dashboard Metrics Overview</h1>
            <p className="text-gray-500 -mt-4 text-xs">Summary indices of active writing proposals and registrations.</p>

            {/* Stats deck grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 border border-gray-150 rounded-2xl flex items-center space-x-4">
                <div className="p-3 bg-teal-50 rounded-xl text-teal-600"><Database className="h-5 w-5" /></div>
                <div>
                  <span className="text-gray-400 text-[10px] font-mono font-bold block">TOTAL BOOKS</span>
                  <span className="text-2xl font-serif font-black">{books.length}</span>
                </div>
              </div>

              <div className="bg-white p-5 border border-gray-150 rounded-2xl flex items-center space-x-4">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><Users className="h-5 w-5" /></div>
                <div>
                  <span className="text-gray-400 text-[10px] font-mono font-bold block">MEMBERS TOTAL</span>
                  <span className="text-2xl font-serif font-black">{members.length + 148}</span>
                </div>
              </div>

              <div className="bg-white p-5 border border-gray-150 rounded-2xl flex items-center space-x-4">
                <div className="p-3 bg-rose-50 rounded-xl text-rose-600"><Mail className="h-5 w-5" /></div>
                <div>
                  <span className="text-gray-400 text-[10px] font-mono font-bold block">CONTACT MSGS</span>
                  <span className="text-2xl font-serif font-black">{messages.length}</span>
                </div>
              </div>

              <div className="bg-white p-5 border border-gray-150 rounded-2xl flex items-center space-x-4">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><FileText className="h-5 w-5" /></div>
                <div>
                  <span className="text-gray-400 text-[10px] font-mono font-bold block">MANUSCRIPTS</span>
                  <span className="text-2xl font-serif font-black">{manuscripts.length}</span>
                </div>
              </div>

              <div className="bg-white p-5 border border-gray-150 rounded-2xl flex items-center space-x-4">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><TrendingUp className="h-5 w-5" /></div>
                <div>
                  <span className="text-gray-400 text-[10px] font-mono font-bold block">PUB INQUIRIES</span>
                  <span className="text-2xl font-serif font-black">{leads.length}</span>
                </div>
              </div>
            </div>

            {/* Quick overview panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
              {/* Left Box: Recent Submissions */}
              <div className="bg-white border border-gray-150 rounded-2xl p-5">
                <h3 className="font-serif text-sm font-bold mb-4 flex justify-between">
                  <span>Recent Manuscripts</span>
                  <button onClick={() => setActiveTab('manuscripts')} className="text-[10px] font-mono text-teal-600 hover:underline">View All</button>
                </h3>
                {manuscripts.length === 0 ? (
                  <p className="text-xs text-gray-400 py-6 text-center">No manuscripts uploaded yet.</p>
                ) : (
                  <div className="space-y-3 font-mono text-xs">
                    {manuscripts.slice(0, 3).map((m) => (
                      <div key={m.id} className="flex justify-between items-center p-2.5 bg-gray-50 border border-gray-100 rounded-xl">
                        <div>
                          <p className="font-sans font-bold text-gray-800">{m.title}</p>
                          <p className="text-[10px] text-gray-400">by {m.authorName} ({m.genre})</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                          m.status === 'received' ? 'bg-orange-100 text-orange-800' :
                          m.status === 'review' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>{m.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Box: CRM Pipeline Leads */}
              <div className="bg-white border border-gray-150 rounded-2xl p-5">
                <h3 className="font-serif text-sm font-bold mb-4 flex justify-between">
                  <span>Leads & Inquiries pipeline</span>
                  <button onClick={() => setActiveTab('leads')} className="text-[10px] font-mono text-teal-600 hover:underline">View pipeline</button>
                </h3>
                {leads.length === 0 ? (
                  <p className="text-xs text-gray-400 py-6 text-center">No publishing service leads registered.</p>
                ) : (
                  <div className="space-y-3 font-mono text-xs">
                    {leads.slice(0, 3).map((l) => (
                      <div key={l.id} className="flex justify-between items-center p-2.5 bg-gray-50 border border-gray-100 rounded-xl">
                        <div>
                          <p className="font-sans font-bold text-gray-800">{l.name}</p>
                          <p className="text-[10px] text-gray-400">Pkg: {l.selectedPackage}</p>
                        </div>
                        <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded text-[9px] font-bold">{l.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: BOOKS (CRUD) ======================= */}
        {activeTab === 'books' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-serif text-2xl font-bold text-gray-900">Bookstore Catalog Management</h1>
                <p className="text-gray-500 text-xs">Add, edit, or delete items inside the public Bookstore view.</p>
              </div>
              <button
                onClick={() => setEditingBook({})}
                className="cursor-pointer bg-teal-600 hover:bg-teal-500 text-white font-serif text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Book Work</span>
              </button>
            </div>

            {/* Active Edit Modal */}
            {editingBook && (
              <div className="bg-white border rounded-2xl p-5 mb-6 border-teal-200">
                <h3 className="font-serif text-sm font-bold text-teal-800 mb-4 flex justify-between">
                  <span>{editingBook.id ? 'Edit Book Record' : 'Add New Book Entry'}</span>
                  <button onClick={() => setEditingBook(null)} className="text-xs font-mono text-red-500 underline">Cancel</button>
                </h3>

                <form onSubmit={saveBookAction} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs block font-bold mb-1">Book Title *</label>
                    <input
                      type="text"
                      value={editingBook.title || ''}
                      onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs block font-bold mb-1">Author Name *</label>
                    <input
                      type="text"
                      value={editingBook.author || ''}
                      onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs block font-bold mb-1">Retail Price (e.g., $12.99 / ₹399) *</label>
                    <input
                      type="text"
                      value={editingBook.price || ''}
                      onChange={(e) => setEditingBook({ ...editingBook, price: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs block font-bold mb-1">Genre Category *</label>
                    <input
                      type="text"
                      value={editingBook.genre || ''}
                      onChange={(e) => setEditingBook({ ...editingBook, genre: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs outline-none focus:border-teal-500"
                      placeholder="Fiction, Mystery, Poetry..."
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs block font-bold mb-1">Language *</label>
                    <input
                      type="text"
                      value={editingBook.language || ''}
                      onChange={(e) => setEditingBook({ ...editingBook, language: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs block font-bold mb-1">Cover Image Source (Unsplash/Firebase URL)</label>
                    <input
                      type="text"
                      value={editingBook.coverUrl || ''}
                      onChange={(e) => setEditingBook({ ...editingBook, coverUrl: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs outline-none focus:border-teal-500 animate-fade-in"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="md:col-span-3 bg-teal-50/30 p-2.5 rounded-xl border border-teal-100/50">
                    <label className="text-xs block font-bold text-teal-800 mb-1">Direct "Buy Now" Link / Purchase URL *</label>
                    <input
                      type="url"
                      value={editingBook.buyNowLink || ''}
                      onChange={(e) => setEditingBook({ ...editingBook, buyNowLink: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:border-teal-500 font-mono text-teal-900 bg-white"
                      placeholder="e.g. https://amazon.com/dp/example-book-id"
                    />
                    <p className="text-[10px] text-teal-600 mt-1">Provide the specific redirect link for this book. When public visitors click "Buy Now" on the bookstore, they will go directly here.</p>
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs block font-bold mb-1">Short Description (Synopsis)</label>
                    <textarea
                      rows={2}
                      value={editingBook.description || ''}
                      onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs outline-none focus:border-teal-500"
                      placeholder="Brief outlines..."
                    />
                  </div>

                  <div className="flex space-x-4 pt-1 items-center">
                    <label className="flex items-center space-x-1.5 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingBook.isAvailable !== false}
                        onChange={(e) => setEditingBook({ ...editingBook, isAvailable: e.target.checked })}
                      />
                      <span>In Stock / Available</span>
                    </label>

                    <label className="flex items-center space-x-1.5 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!editingBook.isFeatured}
                        onChange={(e) => setEditingBook({ ...editingBook, isFeatured: e.target.checked })}
                      />
                      <span className="text-teal-600 font-bold">Featured Home Page</span>
                    </label>
                  </div>

                  <div className="md:col-span-3 pt-2 text-right">
                    <button type="submit" className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-6 py-2 rounded-xl">
                      Save Book Item
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Catalog list table */}
            <div className="bg-white border rounded-2xl overflow-hidden shadow-sm font-sans">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-100/70 border-b border-gray-150 text-[10px] text-gray-400 font-mono text-left">
                    <tr>
                      <th className="px-5 py-3">Cover</th>
                      <th className="px-5 py-3">Title & Author</th>
                      <th className="px-5 py-3">Genre / Lang</th>
                      <th className="px-5 py-3">Retail Rates</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {books.map((book) => (
                      <tr key={book.id}>
                        <td className="px-5 py-3 shrink-0">
                          <img src={book.coverUrl} className="h-10 w-7 object-cover rounded shadow-xs" referrerPolicy="no-referrer" />
                        </td>
                        <td className="px-5 py-3 font-medium">
                          <p className="font-bold text-gray-950 font-serif leading-tight">{book.title}</p>
                          <p className="text-[10px] text-gray-400">by {book.author}</p>
                          {book.buyNowLink && (
                            <a 
                              href={book.buyNowLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-[9px] text-teal-650 bg-teal-50 px-1 py-0.5 rounded font-semibold hover:underline inline-block mt-1 font-mono" 
                              title={book.buyNowLink}
                            >
                              🔗 Link active
                            </a>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <span className="bg-teal-50 text-teal-800 font-mono text-[10px] px-1.5 py-0.5 rounded mr-1 animate-fade-in">{book.genre}</span>
                          <span className="text-gray-400 font-mono text-[10px]">{book.language}</span>
                        </td>
                        <td className="px-5 py-3 font-mono font-bold">{book.price}</td>
                        <td className="px-5 py-3">
                          {book.isFeatured && <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-bold mr-1">FEATURED</span>}
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${book.isAvailable ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                            {book.isAvailable ? 'STOCKED' : 'OUT'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right space-x-1 whitespace-nowrap">
                          <button onClick={() => setEditingBook(book)} className="p-1 text-gray-400 hover:text-teal-600 rounded">
                            <Edit2 className="h-4 w-4 inline" />
                          </button>
                          <button onClick={() => deleteBook(book.id)} className="p-1 text-gray-400 hover:text-red-500 rounded">
                            <Trash className="h-4 w-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: MANUSCRIPTS ======================= */}
        {activeTab === 'manuscripts' && (
          <div className="space-y-6 animate-fade-in text-left font-sans">
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900">Manuscript Submissions Desk</h1>
              <p className="text-gray-500 text-xs text-left">Evaluate novel templates, download files, and add notes.</p>
            </div>

            <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-100 border-b border-gray-150 text-[10px] text-gray-400 font-mono text-left">
                    <tr>
                      <th className="px-5 py-3">Author Details</th>
                      <th className="px-5 py-3">Book Elements</th>
                      <th className="px-5 py-3">Synopsis Premise</th>
                      <th className="px-5 py-3">Draft Link</th>
                      <th className="px-4 py-3">Internal Notes</th>
                      <th className="px-5 py-3">Process Pipeline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {manuscripts.map((m) => (
                      <tr key={m.id} id={`row-manuscript-${m.id}`}>
                        <td className="px-5 py-3">
                          <p className="font-bold text-gray-950 font-serif leading-tight">{m.authorName}</p>
                          <p className="text-[10px] text-gray-400">{m.email}</p>
                          <p className="text-[10px] font-mono text-gray-400">{m.phone || 'No phone'}</p>
                        </td>
                        <td className="px-5 py-3 font-medium">
                          <p className="font-bold text-teal-700">{m.title}</p>
                          <p className="text-[10px] text-gray-400">Genre: {m.genre}</p>
                          <p className="text-[10px] font-mono text-gray-400 font-bold">Words: {m.wordCount}</p>
                        </td>
                        <td className="px-5 py-3">
                          <p className="text-gray-500 max-w-xs line-clamp-2 leading-relaxed">{m.synopsis}</p>
                        </td>
                        <td className="px-5 py-3 font-mono whitespace-nowrap">
                          {/* Emulated Download Trigger */}
                          <a
                            href="#download"
                            onClick={(e) => {
                              e.preventDefault();
                              const text = `===================================================================
                       MANUSCRIPT DIGEST DOWNLOAD
===================================================================
PROPOSAL TITLE: ${m.title}
SUBMITTED AUTHOR: ${m.authorName} (${m.email})
PROPOSED GENRE: ${m.genre}
ESTIMATED WORDS: ${m.wordCount}

SYNOPSIS PREMISE:
${m.synopsis}

===================================================================
This file mimics the physical manuscript draft file uploaded
by the author securely to the Fatima Publication Firebase Storage bucket.
===================================================================`;
                              const blob = new Blob([text], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `Fatima_Draft_${m.title.replace(/\s+/g, '_')}_Manuscript.txt`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              URL.revokeObjectURL(url);
                            }}
                            className="text-xs text-teal-600 hover:text-white border border-teal-200 hover:bg-teal-600 bg-white leading-none px-2.5 py-1.5 rounded-lg font-bold transition flex items-center space-x-1"
                          >
                            <Download className="h-3.5 w-3.5 inline text-teal-400 shrink-0" />
                            <span>Download Draft</span>
                          </a>
                        </td>
                        <td className="px-4 py-3">
                          <textarea
                            rows={2}
                            defaultValue={m.internalNotes || ''}
                            onBlur={(e) => updateManuscript(m.id, m.status, e.target.value)}
                            placeholder="Type internal review notes and tap away..."
                            className="border p-1 rounded text-[11px] font-sans w-full bg-gray-50 focus:bg-white focus:outline-teal-500 text-gray-700 font-medium"
                          />
                        </td>
                        <td className="px-5 py-3">
                          <select
                            value={m.status}
                            onChange={(e) => updateManuscript(m.id, e.target.value as Manuscript['status'], m.internalNotes || '')}
                            className="bg-gray-50 border rounded p-1 font-mono text-[10px] font-bold outline-none cursor-pointer"
                          >
                            <option value="received">1. RECEIVED</option>
                            <option value="review">2. UNDER REVIEW</option>
                            <option value="feedback">3. FEEDBACK SENT</option>
                            <option value="contract">4. CONTRACT DISC</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: LEADS ======================= */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-fade-in text-left font-sans">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-serif text-2xl font-bold text-gray-900">Publishing Leads CRM Pipeline</h1>
                <p className="text-gray-500 text-xs">Manage incoming publishing packages interest inquiries.</p>
              </div>
              
              <button
                onClick={exportLeadsToCSV}
                className="cursor-pointer bg-gray-900 hover:bg-teal-600 text-white font-mono text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1"
              >
                <Download className="h-4 w-4 text-teal-400" />
                <span>Export Leads (CSV)</span>
              </button>
            </div>

            <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-100 border-b border-gray-150 text-[10px] text-gray-400 font-mono text-left">
                    <tr>
                      <th className="px-5 py-3">Prospect Details</th>
                      <th className="px-5 py-3">Selected Package</th>
                      <th className="px-5 py-3">Draft Book title</th>
                      <th className="px-5 py-3">Additional notes</th>
                      <th className="px-5 py-3">Lead Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {leads.map((lead) => (
                      <tr key={lead.id}>
                        <td className="px-5 py-3 font-medium">
                          <p className="font-bold text-gray-900 leading-tight">{lead.name}</p>
                          <p className="text-[10px] text-gray-400">Mail: {lead.email}</p>
                          <p className="text-[10px] font-mono text-teal-600 font-bold">Cell: {lead.phone}</p>
                        </td>
                        <td className="px-5 py-3">
                          <span className="bg-amber-100 text-amber-800 font-mono px-2 py-0.5 rounded text-[10px] font-bold uppercase">{lead.selectedPackage}</span>
                        </td>
                        <td className="px-5 py-3">{lead.bookTitle || <em className="text-gray-400">Untitled Work</em>}</td>
                        <td className="px-5 py-3 text-gray-500 leading-normal max-w-xs line-clamp-2">{lead.additionalRequirements || 'No special requirements'}</td>
                        <td className="px-5 py-3">
                          <select
                            value={lead.status}
                            onChange={(e) => updateInquiryStatusAction(lead.id, e.target.value as PackageInquiry['status'])}
                            className="bg-gray-50 border rounded p-1 font-mono text-[10px] font-bold cursor-pointer"
                          >
                            <option value="new">New Lead</option>
                            <option value="contacted">Contacted</option>
                            <option value="consultation">Consultation Scheduled</option>
                            <option value="converted">Converted Client</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: MEMBERS ======================= */}
        {activeTab === 'members' && (
          <div className="space-y-6 animate-fade-in text-left font-sans">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h1 className="font-serif text-2xl font-bold text-gray-900">Registered Community Members</h1>
                <p className="text-gray-550 text-xs">Audit writers and readers participating in Fatima community hub.</p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search members by name/city..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="px-3 py-1.5 border rounded-lg text-xs outline-none focus:border-teal-500 bg-white font-medium"
                />

                <button
                  onClick={exportMembersToCSV}
                  className="cursor-pointer bg-gray-900 hover:bg-teal-600 text-white font-mono text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1"
                >
                  <Download className="h-4 w-4 text-teal-400" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-100 border-b border-gray-150 text-[10px] text-gray-400 font-mono text-left">
                    <tr>
                      <th className="px-5 py-3">Member Details</th>
                      <th className="px-5 py-3">Residing City</th>
                      <th className="px-5 py-3">Occupation</th>
                      <th className="px-5 py-3">Writing focus / interests</th>
                      <th className="px-5 py-3">Joined date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {members
                      .filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase()) || (m.city && m.city.toLowerCase().includes(memberSearch.toLowerCase())))
                      .map((member) => (
                        <tr key={member.id}>
                          <td className="px-5 py-3 font-semibold text-gray-900">
                            <div>{member.name}</div>
                            <div className="text-[10px] text-gray-400 font-normal">Mail: {member.email}</div>
                            <div className="text-[10px] font-mono text-gray-400 font-normal">Cell: {member.phone}</div>
                          </td>
                          <td className="px-5 py-3 font-mono font-bold text-[10px] text-teal-800">{member.city || 'No city'}</td>
                          <td className="px-5 py-3 text-gray-500">{member.occupation || 'Writers group'}</td>
                          <td className="px-5 py-3">
                            <span className="text-[11px] font-sans text-gray-650 max-w-xs block leading-relaxed">{member.interests || 'General reader'}</span>
                          </td>
                          <td className="px-5 py-3 text-gray-400 leading-none">{new Date(member.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: CONTACT MESSAGES ======================= */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-fade-in text-left font-sans">
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900">Contact Messages Desk</h1>
              <p className="text-gray-550 text-xs">Interact with general support inquiries filed on the landing page.</p>
            </div>

            <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-100 border-b border-gray-150 text-[10px] text-gray-400 font-mono text-left">
                    <tr>
                      <th className="px-5 py-3">Prospect</th>
                      <th className="px-5 py-3">Inquiry Message Body</th>
                      <th className="px-5 py-3">Resolved status</th>
                      <th className="px-5 py-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {messages.map((m) => (
                      <tr key={m.id}>
                        <td className="px-5 py-3">
                          <p className="font-bold text-gray-900 font-serif leading-none">{m.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Mail: {m.email}</p>
                          {m.phone && <p className="text-[10px] font-mono text-gray-400">Cell: {m.phone}</p>}
                        </td>
                        <td className="px-5 py-3">
                          <p className="text-gray-600 leading-relaxed font-sans max-w-md">{m.message}</p>
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => toggleMessageResolved(m.id, !m.isResolved)}
                            style={{ transition: 'all 0.2s' }}
                            className={`cursor-pointer text-xs font-mono font-bold px-2.5 py-1 rounded-xl border leading-none ${
                              m.isResolved
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : 'bg-rose-50 border-rose-200 text-rose-800'
                            }`}
                          >
                            {m.isResolved ? '✓ RESOLVED' : '● NEW Support'}
                          </button>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button onClick={() => deleteMessage(m.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-gray-55 transition">
                            <Trash className="h-4 w-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: CONTENT SETUP (CRUD on lists) ======================= */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-fade-in text-left font-sans">
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900">Content Modules Configuration</h1>
              <p className="text-gray-550 text-xs">Update sliders, packages, event list timeline structures, and affiliate partner links.</p>
            </div>

            {/* Sub Tabs */}
            <div className="flex border-b border-gray-200 mb-6 flex-wrap gap-2 text-xs font-mono font-bold uppercase tracking-wider">
              {['slider', 'quotes', 'team', 'timeline', 'packages', 'testimonials', 'partners', 'certificate'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveContentSubTab(sub as any)}
                  className={`px-4 py-2 border-b-2 -mb-[2px] transition ${
                    activeContentSubTab === sub ? 'border-teal-600 text-teal-800 font-extrabold' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* --- CONFIG ELEMENT: HERO SLIDES (SLIDER) --- */}
            {activeContentSubTab === 'slider' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border">
                  <div>
                    <span className="font-serif font-bold text-sm block">Homepage Hero Slides ({heroSlides.length})</span>
                    <span className="text-[10px] text-gray-400 font-mono">Upload images, edit CTA overlays, or add/delete slides</span>
                  </div>
                  <button
                    onClick={() => setEditingHeroSlide({
                      id: 'slide-' + Math.random().toString(36).substring(2, 9),
                      image: '',
                      title: '',
                      subtitle: '',
                      primaryCta: 'Explore Books',
                      primaryAction: 'bookstore',
                      secondaryCta: 'Publish Your Book',
                      secondaryAction: 'publish'
                    })}
                    className="bg-teal-600 hover:bg-teal-500 text-white font-mono text-[10px] px-3 py-1.5 rounded-lg font-bold"
                  >
                    Add New Slide
                  </button>
                </div>

                {editingHeroSlide && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await StorageService.saveHeroSlide(editingHeroSlide);
                      setEditingHeroSlide(null);
                      reloadAll();
                    }}
                    className="bg-white p-6 border rounded-xl space-y-4 text-left"
                  >
                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                      <h4 className="font-serif font-bold text-slate-900 text-sm">
                        {editingHeroSlide.id ? 'Edit Hero Slide' : 'Create New Hero Slide'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setEditingHeroSlide(null)}
                        className="text-gray-450 hover:text-gray-600 cursor-pointer text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Image Source Selection */}
                      <div className="space-y-3">
                        <label className="text-[11px] font-mono block text-gray-700">Image Source (Drag-and-Drop or Browser)</label>
                        
                        {/* Drag and Drop Upload Area */}
                        <div
                          className="border-2 border-dashed border-gray-250 hover:border-teal-400 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50/50 transition cursor-pointer relative group"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const files = e.dataTransfer.files;
                            if (files && files[0]) {
                              const r = new FileReader();
                              r.onload = () => {
                                setEditingHeroSlide({ ...editingHeroSlide, image: r.result as string });
                              };
                              r.readAsDataURL(files[0]);
                            }
                          }}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            id="slide-file-input"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files && files[0]) {
                                const r = new FileReader();
                                r.onload = () => {
                                  setEditingHeroSlide({ ...editingHeroSlide, image: r.result as string });
                                };
                                r.readAsDataURL(files[0]);
                              }
                            }}
                          />
                          <Sliders className="h-6 w-6 text-gray-450 group-hover:text-teal-500 mb-1" />
                          <span className="text-[11px] font-sans text-gray-500 text-center font-medium">
                            Drag & drop home image or <span className="text-teal-600 underline">browse file</span>
                          </span>
                          <span className="text-[9px] font-mono text-gray-400 mt-0.5">JPEG, PNG or Dynamic Base64</span>
                        </div>

                        {/* Direct URL input fallback */}
                        <div>
                          <label className="text-[10px] font-mono block mb-1 text-gray-400">Or Paste Direct Image Link</label>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={editingHeroSlide.image || ''}
                            onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, image: e.target.value })}
                            className="w-full text-xs p-2 border rounded-lg focus:outline-teal-500"
                          />
                        </div>

                        {editingHeroSlide.image && (
                          <div className="relative mt-2 rounded-lg overflow-hidden border bg-gray-900 h-28 flex items-center justify-center">
                            <img src={editingHeroSlide.image} alt="Preview" className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setEditingHeroSlide({ ...editingHeroSlide, image: '' })}
                              className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 text-[10px]"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Content details */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] font-mono block mb-1 text-gray-700">Slide Heading Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Transform Your Manuscript"
                            value={editingHeroSlide.title || ''}
                            onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, title: e.target.value })}
                            className="w-full text-xs p-2 border rounded-lg focus:outline-teal-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono block mb-1 text-gray-700">Subtitle Slogan Text</label>
                          <textarea
                            placeholder="Slide helper description sentences..."
                            value={editingHeroSlide.subtitle || ''}
                            rows={3}
                            onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, subtitle: e.target.value })}
                            className="w-full text-xs p-2 border rounded-lg focus:outline-teal-500"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-mono block mb-0.5 text-gray-750">Primary CTA Text</label>
                            <input
                              type="text"
                              value={editingHeroSlide.primaryCta || ''}
                              onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, primaryCta: e.target.value })}
                              className="w-full text-xs p-1.5 border rounded-lg focus:outline-teal-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono block mb-0.5 text-gray-755">Primary Action Hook</label>
                            <select
                              value={editingHeroSlide.primaryAction || ''}
                              onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, primaryAction: e.target.value })}
                              className="w-full text-xs p-1.5 border rounded-lg focus:outline-teal-500 bg-white"
                            >
                              <option value="home">Home</option>
                              <option value="about">About</option>
                              <option value="bookstore">Bookstore</option>
                              <option value="publish">Publish Info</option>
                              <option value="manuscript">Submit</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-mono block mb-0.5 text-gray-750">Secondary CTA Text</label>
                            <input
                              type="text"
                              value={editingHeroSlide.secondaryCta || ''}
                              onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, secondaryCta: e.target.value })}
                              className="w-full text-xs p-1.5 border rounded-lg focus:outline-teal-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono block mb-0.5 text-gray-755">Secondary Action Hook</label>
                            <select
                              value={editingHeroSlide.secondaryAction || ''}
                              onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, secondaryAction: e.target.value })}
                              className="w-full text-xs p-1.5 border rounded-lg focus:outline-teal-500 bg-white"
                            >
                              <option value="home">Home</option>
                              <option value="about">About</option>
                              <option value="bookstore">Bookstore</option>
                              <option value="publish">Publish Info</option>
                              <option value="manuscript">Submit</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 border-t pt-3">
                      <button
                        type="button"
                        onClick={() => setEditingHeroSlide(null)}
                        className="bg-gray-100 text-gray-700 text-xs px-4 py-2 rounded-lg font-bold"
                      >
                        Discard
                      </button>
                      <button
                        type="submit"
                        className="bg-teal-600 hover:bg-teal-500 text-white text-xs px-5 py-2 rounded-lg font-bold"
                      >
                        Save Master Slide
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {heroSlides.map((slide) => (
                    <div key={slide.id} className="bg-white border rounded-xl overflow-hidden shadow-xs flex flex-col justify-between">
                      <div>
                        {slide.image ? (
                          <div className="h-32 w-full bg-slate-900 relative">
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="h-32 w-full bg-slate-100 flex items-center justify-center font-mono text-[10px] text-gray-400">No Image Specified</div>
                        )}
                        <div className="p-4 space-y-2">
                          <h5 className="font-serif font-bold text-gray-900 text-sm line-clamp-1">{slide.title}</h5>
                          <p className="text-xs text-gray-500 line-clamp-2">{slide.subtitle}</p>
                          <div className="flex gap-1 pt-1 flex-wrap">
                            <span className="bg-slate-100 text-[8px] font-mono text-slate-600 px-1 rounded">CTA1: {slide.primaryCta} → {slide.primaryAction}</span>
                            <span className="bg-slate-100 text-[8px] font-mono text-slate-600 px-1 rounded">CTA2: {slide.secondaryCta} → {slide.secondaryAction}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex border-t bg-gray-50/50 p-2 gap-2 justify-end text-xs font-mono">
                        <button
                          onClick={() => setEditingHeroSlide(slide)}
                          className="text-teal-600 hover:text-teal-850 font-extrabold px-2 py-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Are you sure you want to remove this home banner slide?')) {
                              await StorageService.deleteHeroSlide(slide.id);
                              reloadAll();
                            }
                          }}
                          className="text-red-500 hover:text-red-700 px-2 py-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- CONFIG ELEMENT: QUOTES --- */}
            {activeContentSubTab === 'quotes' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border">
                  <span className="font-serif font-bold text-sm">Landing Page Quotes Listing ({quotes.length})</span>
                  <button onClick={() => setEditingQuote({})} className="bg-teal-600 text-white font-mono text-[10px] px-3 py-1.5 rounded-lg font-bold">Add Quote</button>
                </div>

                {editingQuote && (
                  <form onSubmit={saveQuoteAction} className="bg-white p-4 border rounded-xl gap-4 flex flex-col md:flex-row items-end">
                    <div className="flex-grow">
                      <label className="text-[10px] font-mono block mb-1">Quote text</label>
                      <input
                        type="text"
                        value={editingQuote.text || ''}
                        onChange={(e) => setEditingQuote({ ...editingQuote, text: e.target.value })}
                        className="w-full text-xs p-1.5 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono block mb-1">Author</label>
                      <input
                        type="text"
                        value={editingQuote.author || ''}
                        onChange={(e) => setEditingQuote({ ...editingQuote, author: e.target.value })}
                        className="w-full text-xs p-1.5 border rounded-lg"
                        required
                      />
                    </div>
                    <button type="submit" className="bg-emerald-600 text-white text-xs px-4 py-1.5 rounded-lg font-bold">Save</button>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quotes.map((q) => (
                    <div key={q.id} className="bg-white p-4 border rounded-xl flex justify-between items-start">
                      <div>
                        <p className="font-serif italic text-gray-700">"{q.text}"</p>
                        <p className="text-[10px] font-mono text-gray-400 mt-1">— {q.author}</p>
                      </div>
                      <button onClick={async () => { await StorageService.deleteQuote(q.id); reloadAll(); }} className="text-red-500 hover:text-red-700 bg-gray-50 p-1 rounded font-serif">×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- CONFIG ELEMENT: TEAM --- */}
            {activeContentSubTab === 'team' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border">
                  <span className="font-serif font-bold text-sm">Founders & Panel Editors ({team.length})</span>
                  <button onClick={() => setEditingTeam({})} className="bg-teal-600 text-white font-mono text-[10px] px-3 py-1.5 rounded-lg font-bold">Add Member</button>
                </div>

                {editingTeam && (
                  <form onSubmit={saveTeamAction} className="bg-white p-4 border rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                    <div>
                      <label className="text-[10px] block font-bold mb-1">FullName</label>
                      <input type="text" value={editingTeam.name || ''} onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })} className="w-full p-1.5 text-xs border rounded-lg" required />
                    </div>
                    <div>
                      <label className="text-[10px] block font-bold mb-1">Designation</label>
                      <input type="text" value={editingTeam.designation || ''} onChange={(e) => setEditingTeam({ ...editingTeam, designation: e.target.value })} className="w-full p-1.5 text-xs border rounded-lg" required />
                    </div>
                    <div>
                      <label className="text-[10px] block font-bold mb-1">Photo Link (URL)</label>
                      <input type="text" value={editingTeam.imageUrl || ''} onChange={(e) => setEditingTeam({ ...editingTeam, imageUrl: e.target.value })} className="w-full p-1.5 text-xs border rounded-lg" />
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-[10px] block font-bold mb-1">Short Biography Description</label>
                      <input type="text" value={editingTeam.biography || ''} onChange={(e) => setEditingTeam({ ...editingTeam, biography: e.target.value })} className="w-full p-1.5 text-xs border rounded-lg" />
                    </div>
                    <div className="md:col-span-3 text-right">
                      <button type="submit" className="bg-emerald-600 text-white font-bold text-xs px-4 py-1.5 rounded-lg">Save Member</button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {team.map((t) => (
                    <div key={t.id} className="bg-white p-4 border rounded-xl flex items-start space-x-3">
                      <img src={t.imageUrl} className="h-10 w-10 object-cover rounded-full" referrerPolicy="no-referrer" />
                      <div className="flex-grow text-left">
                        <h4 className="font-serif font-bold text-gray-900 leading-tight">{t.name}</h4>
                        <span className="text-[10px] font-mono text-teal-600 uppercase tracking-wider leading-none font-semibold block">{t.designation}</span>
                        <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{t.biography}</p>
                      </div>
                      <button onClick={async () => { if (window.confirm('Delete member?')) { await StorageService.deleteTeamMember(t.id); reloadAll(); } }} className="text-red-500 font-serif">×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- CONFIG ELEMENT: TIMELINE --- */}
            {activeContentSubTab === 'timeline' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border">
                  <span className="font-serif font-bold text-sm">Chronological Milestones Timeline ({timeline.length})</span>
                  <button onClick={() => setEditingEvent({})} className="bg-teal-600 text-white font-mono text-[10px] px-3 py-1.5 rounded-lg font-bold">Add Milestone</button>
                </div>

                {editingEvent && (
                  <form onSubmit={saveEventAction} className="bg-white p-4 border rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                    <div>
                      <label className="text-[10px] block font-bold mb-1">Milestone Year (e.g. 2018)</label>
                      <input type="text" value={editingEvent.year || ''} onChange={(e) => setEditingEvent({ ...editingEvent, year: e.target.value })} className="w-full p-1.5 text-xs border rounded-lg" required />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] block font-bold mb-1">Milestone Title</label>
                      <input type="text" value={editingEvent.title || ''} onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })} className="w-full p-1.5 text-xs border rounded-lg" required />
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-[10px] block font-bold mb-1">Thematic Description</label>
                      <input type="text" value={editingEvent.description || ''} onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })} className="w-full p-1.5 text-xs border rounded-lg" />
                    </div>
                    <div className="md:col-span-3 text-right">
                      <button type="submit" className="bg-emerald-600 text-white font-bold text-xs px-4 py-1.5 rounded-lg">Save Event</button>
                    </div>
                  </form>
                )}

                <div className="space-y-2 max-w-2xl font-mono text-xs text-left">
                  {timeline.map((event) => (
                    <div key={event.id} className="bg-white p-3 border rounded-xl flex justify-between items-center">
                      <div>
                        <span className="bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded leading-none mr-2">{event.year}</span>
                        <strong className="text-gray-900 font-sans">{event.title}</strong>
                        <p className="text-[11px] text-gray-400 font-sans mt-0.5 ml-14 leading-relaxed">{event.description}</p>
                      </div>
                      <button onClick={async () => { await StorageService.deleteTimelineEvent(event.id); reloadAll(); }} className="text-red-500 font-serif text-sm">×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- CONFIG ELEMENT: PACKAGES --- */}
            {activeContentSubTab === 'packages' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border">
                  <span className="font-serif font-bold text-sm">Author Publishing Packages ({packages.length})</span>
                  <button onClick={() => setEditingPackage({ features: [''] })} className="bg-teal-600 text-white font-mono text-[10px] px-3 py-1.5 rounded-lg font-bold">Add Service Package</button>
                </div>

                {editingPackage && (
                  <form onSubmit={savePackageAction} className="bg-white p-4 border rounded-xl space-y-3 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] block font-bold mb-1">Package Category Title</label>
                        <input type="text" value={editingPackage.name || ''} onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })} className="w-full p-1.5 text-xs border rounded-lg" required />
                      </div>
                      <div>
                        <label className="text-[10px] block font-bold mb-1">Pricing Placeholder Rate (e.g. $599 / ₹49,999)</label>
                        <input type="text" value={editingPackage.price || ''} onChange={(e) => setEditingPackage({ ...editingPackage, price: e.target.value })} className="w-full p-1.5 text-xs border rounded-lg" required />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] block font-bold mb-1">Description</label>
                      <input type="text" value={editingPackage.description || ''} onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })} className="w-full p-1.5 text-xs border rounded-lg" />
                    </div>
                    <div>
                      <label className="text-[10px] block font-bold mb-1">Features (Join features sequentially using semi-colons ';')</label>
                      <textarea
                        rows={2}
                        value={Array.isArray(editingPackage.features) ? editingPackage.features.join('; ') : ''}
                        onChange={(e) => setEditingPackage({ ...editingPackage, features: e.target.value.split(';').map(f => f.trim()) })}
                        className="w-full p-1.5 text-xs border rounded-lg font-mono outline-teal-500"
                        placeholder="Feature 1; Feature 2; Feature 3..."
                      />
                    </div>
                    <div className="text-right">
                      <button type="submit" className="bg-emerald-600 text-white font-bold text-xs px-4 py-1.5 rounded-lg">Save Package Core</button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="bg-white p-4 border rounded-xl flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-gray-900 leading-tight">{pkg.name}</h4>
                        <span className="text-teal-600 font-mono text-xs font-bold block mt-1">{pkg.price}</span>
                        <p className="text-[10px] text-gray-500 mt-1 lines-clamp-2 leading-relaxed h-10 overflow-hidden">{pkg.description}</p>
                        
                        <ul className="space-y-1 mt-3 pl-3 text-[10px] text-gray-400 leading-none">
                          {(pkg.features || []).map((f, i) => (
                            <li key={i}>• {f}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-right border-t pt-2 mt-4">
                        <button
                          onClick={async () => { if (window.confirm('Delete package?')) { await StorageService.deletePackage(pkg.id); reloadAll(); } }}
                          className="text-red-500 font-serif text-xs font-bold"
                        >
                          Erase Package
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- CONFIG ELEMENT: TESTIMONIALS --- */}
            {activeContentSubTab === 'testimonials' && (
              <div className="space-y-4 font-sans">
                <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border">
                  <span className="font-serif font-bold text-sm">Author success Stories Testimonials ({testimonials.length})</span>
                  <button onClick={() => setEditingTestimonial({})} className="bg-teal-600 text-white font-mono text-[10px] px-3 py-1.5 rounded-lg font-bold">Add Review</button>
                </div>

                {editingTestimonial && (
                  <form onSubmit={saveTestimonialAction} className="bg-white p-4 border rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                    <div>
                      <label className="text-[10px] block font-bold mb-1">Author Name Name</label>
                      <input type="text" value={editingTestimonial.name || ''} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })} className="w-full p-1.5 text-xs border rounded-lg" required />
                    </div>
                    <div>
                      <label className="text-[10px] block font-bold mb-1">Subtitle / Book (e.g., Author of 'The Minarets')</label>
                      <input type="text" value={editingTestimonial.relation || ''} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, relation: e.target.value })} className="w-full p-1.5 text-xs border rounded-lg" required />
                    </div>
                    <div>
                      <label className="text-[10px] block font-bold mb-1">Star rating (1 to 5 Stars)</label>
                      <input type="number" min={1} max={5} value={editingTestimonial.rating || 5} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })} className="w-full p-1.5 text-xs border rounded-lg" />
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-[10px] block font-bold mb-1">Full statement review</label>
                      <input type="text" value={editingTestimonial.text || ''} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })} className="w-full p-1.5 text-xs border rounded-lg" required />
                    </div>
                    <div className="md:col-span-3 text-right">
                      <button type="submit" className="bg-emerald-600 text-white font-bold text-xs px-4 py-1.5 rounded-lg">Save Feed</button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {testimonials.map((t) => (
                    <div key={t.id} className="bg-white p-4 border rounded-xl flex flex-col justify-between">
                      <div>
                        <p className="text-[11px] text-gray-500 italic">“{t.text}”</p>
                      </div>
                      <div className="flex justify-between items-end mt-4 border-t pt-2">
                        <div>
                          <h4 className="font-bold text-gray-900 leading-none">{t.name}</h4>
                          <span className="text-[9px] font-mono text-teal-605 mt-0.5 block font-bold uppercase tracking-wider">{t.relation}</span>
                        </div>
                        <button onClick={async () => { await StorageService.deleteTestimonial(t.id); reloadAll(); }} className="text-red-500 shrink-0 font-serif">×</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- CONFIG ELEMENT: PARTNERS --- */}
            {activeContentSubTab === 'partners' && (
              <div className="space-y-4">
                <div className="bg-gray-50/50 p-3 rounded-xl border">
                  <span className="font-serif font-bold text-sm">Affiliate Distribution Stores Links Configuration ({partners.length})</span>
                </div>

                {selectedPartner && (
                  <form onSubmit={savePartnerAction} className="bg-white p-4 border rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="text-[10px] block font-bold">Partner Store Name</label>
                      <input type="text" value={selectedPartner.name} disabled className="w-full p-1.5 text-xs border bg-gray-50 rounded-lg font-mono font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] block font-bold">Manage Landing URL Link</label>
                      <input type="text" value={selectedPartner.partnerUrl} onChange={(e) => setSelectedPartner({ ...selectedPartner, partnerUrl: e.target.value })} className="w-full p-1.5 text-xs border rounded-lg focus:border-teal-500" required />
                    </div>
                    <div>
                      <button type="submit" className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-5 py-2 rounded-lg">Update Store Link</button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-mono text-xs">
                  {partners.map((p) => (
                    <div key={p.id} className="bg-white p-4 border rounded-xl flex items-center justify-between">
                      <div>
                        <strong className="text-gray-950 font-sans block">{p.name}</strong>
                        <span className="text-[10px] text-gray-400 block max-w-xs truncate">{p.partnerUrl}</span>
                      </div>
                      <button onClick={() => setSelectedPartner(p)} className="bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded text-[10px] font-bold border cursor-pointer">Edit Link</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- CONFIG ELEMENT: CERTIFICATE --- */}
            {activeContentSubTab === 'certificate' && settings && (
              <div className="space-y-6 max-w-4xl text-left font-sans">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start space-x-3 text-amber-900 animate-fade-in">
                  <Info className="h-4 w-4 mt-0.5 text-amber-700 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold block">Corporate Registration Certificate Details</span>
                    <p className="mt-0.5 text-amber-800 font-sans">
                      Update the legal incorporative registration text, card titles, validation identifiers, and status tags shown on the About Us page.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  {/* Edit Form */}
                  <div className="bg-white p-6 border rounded-2xl space-y-4">
                    <h3 className="font-serif font-bold text-gray-900 text-sm border-b pb-2">Certificate Details</h3>
                    
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Corporate Header Title</label>
                        <input
                          type="text"
                          className="w-full text-xs p-2 border rounded-xl"
                          value={settings.certCardHeader || ''}
                          onChange={(e) => setSettings({ ...settings, certCardHeader: e.target.value })}
                          placeholder="e.g. Registration Certificate"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Certificate Sub-header (Sub-text)</label>
                        <input
                          type="text"
                          className="w-full text-xs p-2 border rounded-xl"
                          value={settings.certCardSubHeader || ''}
                          onChange={(e) => setSettings({ ...settings, certCardSubHeader: e.target.value })}
                          placeholder="e.g. Govt. of India Legal Cognizance"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Entity Name</label>
                          <input
                            type="text"
                            className="w-full text-xs p-2 border rounded-xl"
                            value={settings.certCardName || ''}
                            onChange={(e) => setSettings({ ...settings, certCardName: e.target.value })}
                            placeholder="e.g. Fatima Publication"
                            required
                          />
                        </div>

                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Registration Code</label>
                          <input
                            type="text"
                            className="w-full text-xs p-2 border rounded-xl font-mono"
                            value={settings.certCardCode || ''}
                            onChange={(e) => setSettings({ ...settings, certCardCode: e.target.value })}
                            placeholder="e.g. FAT-DL7329581A"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Active Status Label</label>
                        <input
                          type="text"
                          className="w-full text-xs p-2 border rounded-xl"
                          value={settings.certCardStatus || ''}
                          onChange={(e) => setSettings({ ...settings, certCardStatus: e.target.value })}
                          placeholder="e.g. Active Partner"
                          required
                        />
                      </div>

                      <hr className="my-2 border-gray-100" />

                      <div>
                        <label className="font-bold text-gray-700 block mb-1">About Page Proof Title Block</label>
                        <input
                          type="text"
                          className="w-full text-xs p-2 border rounded-xl"
                          value={settings.certTitle || ''}
                          onChange={(e) => setSettings({ ...settings, certTitle: e.target.value })}
                          placeholder="e.g. Legal Incorporative Proof"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-bold text-gray-700 block mb-1">About Page Proof Detailed Description</label>
                        <textarea
                          rows={4}
                          className="w-full text-xs p-2 border rounded-xl animate-none font-sans"
                          value={settings.certDescription || ''}
                          onChange={(e) => setSettings({ ...settings, certDescription: e.target.value })}
                          placeholder="Add full validation metadata context..."
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await StorageService.saveSettings(settings);
                            if (onSettingsUpdated) {
                              onSettingsUpdated();
                            }
                            alert('Corporate Registration Certificate specifications updated successfully.');
                          } catch (err) {
                            alert('Error updating certificate settings: ' + err);
                          }
                        }}
                        className="w-full bg-teal-650 hover:bg-teal-555 text-white font-mono text-xs py-2.5 rounded-xl font-bold transition cursor-pointer"
                      >
                        Save Certificate Settings
                      </button>
                    </div>
                  </div>

                  {/* Visual Preview */}
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-gray-900 text-sm border-b pb-2">Live Security Preview</h3>
                    
                    <div className="border border-gray-150 rounded-2xl p-6 bg-gray-50/50 flex flex-col items-center justify-center text-left">
                      <div 
                        className="bg-amber-50 h-52 w-72 shrink-0 border border-amber-200 rounded-lg p-4 flex flex-col justify-between font-serif shadow-xs relative overflow-hidden select-none"
                        onContextMenu={(e) => e.preventDefault()}
                        draggable="false"
                      >
                        {/* watermark */}
                        <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none rotate-12 select-none">
                          <span className="text-[120px] font-bold select-none">REG</span>
                        </div>
                        
                        <div className="border border-dashed border-amber-300 h-full w-full p-2.5 flex flex-col justify-between select-none">
                          <div className="text-center select-none">
                            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 font-bold block select-none">
                              {settings.certCardHeader || "Registration Certificate"}
                            </span>
                            <span className="text-[8px] font-mono text-amber-600 select-none">
                              {settings.certCardSubHeader || "Govt. of India Legal Cognizance"}
                            </span>
                          </div>
                          <div className="text-[11px] font-sans font-medium text-amber-900 leading-snug space-y-0.5 my-2 select-none">
                            <p className="select-none">NAME: <span className="font-semibold text-gray-900 select-none">{settings.certCardName || "Fatima Publication"}</span></p>
                            <p className="select-none">CODE: <span className="font-semibold text-gray-900 select-none">{settings.certCardCode || "FAT-DL7329581A"}</span></p>
                            <p className="select-none">STATUS: <span className="font-semibold text-emerald-800 bg-emerald-100 px-1 py-0.2 rounded select-none">{settings.certCardStatus || "Active Partner"}</span></p>
                          </div>
                          <div className="flex justify-between items-center text-[8px] font-mono text-amber-700 select-none">
                            <span className="select-none font-bold text-[8px]">NEW DELHI</span>
                            <span className="border-t border-amber-400 pt-0.5 select-none font-bold text-[8px]">DIRECTOR SECY</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 w-full text-center">
                        <span className="inline-flex items-center space-x-1.5 text-[10px] text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full font-mono font-bold leading-none mb-2">
                          <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                          <span>Strictly Secured Certificate Visual</span>
                        </span>
                        <h4 className="font-serif text-sm font-bold text-gray-900 mb-1">
                          {settings.certTitle || "Legal Incorporative Proof"}
                        </h4>
                        <p className="text-gray-500 text-[11px] leading-relaxed font-sans max-h-24 overflow-y-auto">
                          {settings.certDescription || "Fatima Publication holds a valid certification issued under Ministry of Commerce and Information Broadcasting Reg No. IN-DL7329581A-FATIMA."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ======================= TAB: USERS ======================= */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-serif text-2xl font-bold text-gray-900">User Profiles Console</h1>
                <p className="text-gray-500 text-xs">Provision, list, and revoke access for system administrators or public readers.</p>
              </div>
              <button
                onClick={() => setEditingProfile({ displayName: '', email: '', role: 'public' })}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add User Account</span>
              </button>
            </div>

            {/* Profile editor Form */}
            {editingProfile && (
              <form onSubmit={saveProfileAction} className="bg-white border rounded-2xl p-6 shadow-sm space-y-4 max-w-xl animate-fade-in">
                <div className="flex justify-between items-center pb-2 border-b">
                  <h3 className="font-serif font-bold text-gray-900 text-base">
                    {editingProfile.id ? 'Edit User Profile' : 'Register New User Account'}
                  </h3>
                  <button type="button" onClick={() => setEditingProfile(null)} className="p-1 text-gray-400 hover:text-gray-650 cursor-pointer">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 font-sans text-xs">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2.5 border rounded-xl"
                      value={editingProfile.displayName || ''}
                      onChange={(e) => setEditingProfile({ ...editingProfile, displayName: e.target.value })}
                      placeholder="e.g. Mohd Fahad"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      className="w-full text-xs p-2.5 border rounded-xl"
                      value={editingProfile.email || ''}
                      onChange={(e) => setEditingProfile({ ...editingProfile, email: e.target.value })}
                      placeholder="e.g. mohd.fahad98871@gmail.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">System Privilege Role</label>
                    <select
                      className="w-full text-xs p-2.5 border rounded-xl"
                      value={editingProfile.role || 'public'}
                      onChange={(e) => setEditingProfile({ ...editingProfile, role: e.target.value as 'admin' | 'public' })}
                    >
                      <option value="public">Public / Read-Only Account</option>
                      <option value="admin">System Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProfile(null)}
                    className="px-4 py-2 border rounded-xl text-xs hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            )}

            {/* List and Table */}
            <div className="bg-white border rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-gray-50 border-b font-mono font-bold text-gray-500">
                  <tr>
                    <th className="p-4">USER DETAILS</th>
                    <th className="p-4">EMAIL ADDRESS</th>
                    <th className="p-4">PRIVILEGE ROLE</th>
                    <th className="p-4">REGISTERED ON</th>
                    <th className="p-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {profiles.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-gray-900">{p.displayName}</td>
                      <td className="p-4 text-gray-600 font-mono">{p.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 font-mono text-[9px] font-bold rounded-lg ${
                          p.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {p.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 font-mono">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingProfile(p)}
                          className="p-1 px-2 border rounded-lg hover:bg-gray-50 text-[10px] font-bold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeProfileAction(p.id)}
                          className="p-1 px-2 text-red-650 hover:bg-red-50 rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================= TAB: GALLERY ======================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-serif text-2xl font-bold text-gray-900">Showcase Gallery Portfolio</h1>
                <p className="text-gray-500 text-xs">Manage workspace images, editorial draft mockups, and community event releases.</p>
              </div>
              <button
                onClick={() => setEditingGalleryItem({ title: '', imageUrl: '', description: '' })}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Gallery Image</span>
              </button>
            </div>

            {/* Gallery item form */}
            {editingGalleryItem && (
              <form onSubmit={saveGalleryAction} className="bg-white border rounded-2xl p-6 shadow-sm space-y-4 max-w-xl animate-fade-in">
                <div className="flex justify-between items-center pb-2 border-b">
                  <h3 className="font-serif font-bold text-gray-900 text-base">
                    {editingGalleryItem.id ? 'Edit Gallery Image Details' : 'Upload Creative Artwork to Gallery'}
                  </h3>
                  <button type="button" onClick={() => setEditingGalleryItem(null)} className="p-1 text-gray-400 hover:text-gray-655 cursor-pointer">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 font-sans text-xs">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Showcase Photo Title</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2.5 border rounded-xl"
                      value={editingGalleryItem.title || ''}
                      onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })}
                      placeholder="e.g. Writers Workshop Summit"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Artwork Photo URL Link</label>
                    <input
                      type="url"
                      className="w-full text-xs p-2.5 border rounded-xl font-mono"
                      value={editingGalleryItem.imageUrl || ''}
                      onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Short Description / Memoir Context</label>
                    <textarea
                      rows={3}
                      className="w-full text-xs p-2.5 border rounded-xl"
                      value={editingGalleryItem.description || ''}
                      onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, description: e.target.value })}
                      placeholder="Brief caption or context (max 1000 characters)"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingGalleryItem(null)}
                    className="px-4 py-2 border rounded-xl text-xs hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Save Artwork
                  </button>
                </div>
              </form>
            )}

            {/* Gallery manager grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div key={item.id} className="bg-white border rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div className="aspect-video w-full bg-gray-100 overflow-hidden relative">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="p-4 space-y-1.5 text-left">
                      <h4 className="font-serif font-bold text-gray-950 text-sm">{item.title}</h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed max-h-16 overflow-hidden text-ellipsis">{item.description || "No description set."}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50/60 border-t flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-400">ID: {item.id}</span>
                    <div className="space-x-1">
                      <button
                        onClick={() => setEditingGalleryItem(item)}
                        className="p-1 px-2.5 bg-white border hover:bg-gray-50 rounded font-mono text-[10px] font-bold cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeGalleryAction(item.id)}
                        className="p-1 px-2.5 bg-red-50 text-red-700 hover:bg-red-100 rounded font-mono text-[10px] font-bold cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB: SITE-SETTINGS ======================= */}
        {activeTab === 'site-settings' && settings && (
          <form onSubmit={saveSitePreferencesAction} className="space-y-6 animate-fade-in text-left max-w-3xl">
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900">Site Workspace Preferences</h1>
              <p className="text-gray-500 text-xs">Fine-tune dynamic site elements, upload site icons, manage layout names, and toggle navigation route visibility.</p>
            </div>

            <div className="bg-white border rounded-2xl p-6 shadow-xs space-y-6 font-sans">
              
              {/* Site Name and Logo Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 block">Workspace Display Branding Name</label>
                  <p className="text-[10px] text-gray-400 font-sans">Modifies the layout title in headers, footers, and stats dashboards.</p>
                  <input
                    type="text"
                    className="w-full text-xs p-2.5 border rounded-xl"
                    value={settings.siteName || ''}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 block">Brand Site Iconology (Image URL)</label>
                  <p className="text-[10px] text-gray-400 font-sans">Enter a public image/SVG URL or paste a base64 encoded graphic.</p>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      className="flex-grow text-xs p-2.5 border rounded-xl font-mono"
                      value={settings.siteIconUrl || ''}
                      onChange={(e) => setSettings({ ...settings, siteIconUrl: e.target.value })}
                      placeholder="e.g. https://domain.com/icon.svg"
                    />
                    {settings.siteIconUrl && (
                      <div className="w-10 h-10 border rounded-xl flex items-center justify-center bg-gray-50 shrink-0">
                        <img src={settings.siteIconUrl} alt="Preview" referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain p-1 rounded" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Menu visibility matrix & Custom Names */}
              <div className="space-y-3 border-b border-gray-100 pb-6 pt-2">
                <label className="text-xs font-bold text-gray-700 block">Visible Navbar Menu Pages & Custom Names</label>
                <p className="text-[10px] text-gray-400 font-sans">Toggle whether a page is shown in the navigation bar, and customize its display label name on the menu dynamically.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {[
                    { id: 'home', defaultLabel: 'Home', defaultPageName: 'Home Page', pageNameKey: 'pageNameHome', settingKey: 'navLabelHome', desc: 'Landing / Hero Slide layout showcase' },
                    { id: 'bookstore', defaultLabel: 'Bookstore', defaultPageName: 'Bookstore Page', pageNameKey: 'pageNameBookstore', settingKey: 'navLabelBookstore', desc: 'Public library catalog and retail desk' },
                    { id: 'about', defaultLabel: 'About', defaultPageName: 'About Us Page', pageNameKey: 'pageNameAbout', settingKey: 'navLabelAbout', desc: 'Company vision, team & registration certificate' },
                    { id: 'gallery', defaultLabel: 'Gallery', defaultPageName: 'Photo Gallery Page', pageNameKey: 'pageNameGallery', settingKey: 'navLabelGallery', desc: 'Literary memories & creative summit events' },
                    { id: 'join', defaultLabel: 'Join', defaultPageName: 'Join Community Page', pageNameKey: 'pageNameJoin', settingKey: 'navLabelJoin', desc: 'Authors registered space / member counter' },
                    { id: 'publish', defaultLabel: 'Publish', defaultPageName: 'Publishing Packages Page', pageNameKey: 'pageNamePublish', settingKey: 'navLabelPublish', desc: 'Rates of different distribution packages' },
                    { id: 'manuscript', defaultLabel: 'Submit', defaultPageName: 'Submit Manuscript Page', pageNameKey: 'pageNameManuscript', settingKey: 'navLabelManuscript', desc: 'Manuscript submission and digital letter upload' }
                  ].map((route) => {
                    const currentVisibleNavs = settings.visibleNavPages || ['home', 'bookstore', 'about', 'join', 'publish', 'manuscript', 'gallery'];
                    const isChecked = currentVisibleNavs.includes(route.id);
                    const currentLabel = settings[route.settingKey] !== undefined ? settings[route.settingKey] : route.defaultLabel;
                    const currentPageName = settings[route.pageNameKey] !== undefined ? settings[route.pageNameKey] : route.defaultPageName;
                    
                    return (
                      <div key={route.id} className="p-4 bg-gray-50/70 border border-gray-100 rounded-xl hover:bg-gray-100/50 transition space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                let updatedList = [...currentVisibleNavs];
                                if (e.target.checked) {
                                  if (!updatedList.includes(route.id)) updatedList.push(route.id);
                                } else {
                                  updatedList = updatedList.filter(rid => rid !== route.id);
                                }
                                setSettings({ ...settings, visibleNavPages: updatedList });
                              }}
                              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 h-4 w-4 cursor-pointer"
                            />
                            <div className="text-left">
                              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 block">Route ID: {route.id}</span>
                              <span className="text-[9px] text-gray-400 font-sans block max-w-[150px] truncate" title={route.desc}>{route.desc}</span>
                            </div>
                          </div>
                          
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isChecked ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-gray-100 text-gray-400'}`}>
                            {isChecked ? 'Link Active' : 'Hidden'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div className="text-left">
                            <label className="text-[9px] block font-semibold text-gray-500 mb-1 uppercase tracking-wider font-mono">Page Display Name</label>
                            <input
                              type="text"
                              value={currentPageName}
                              onChange={(e) => {
                                setSettings({ ...settings, [route.pageNameKey]: e.target.value });
                              }}
                              placeholder={route.defaultPageName}
                              className="w-full text-xs p-1.5 border rounded-lg bg-white focus:border-teal-500 font-semibold text-gray-800"
                            />
                          </div>

                          <div className="text-left">
                            <label className="text-[9px] block font-semibold text-gray-500 mb-1 uppercase tracking-wider font-mono">Navbar Menu Caption</label>
                            <input
                              type="text"
                              value={currentLabel}
                              onChange={(e) => {
                                setSettings({ ...settings, [route.settingKey]: e.target.value });
                              }}
                              placeholder={route.defaultLabel}
                              className="w-full text-xs p-1.5 border rounded-lg bg-white focus:border-teal-500 font-semibold text-gray-800"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Get in Touch section edit block */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-gray-700 block">Get In Touch & Header/Footer Contact Details</label>
                <p className="text-[10px] text-gray-400 font-sans">Modifies headquarters addresses, hotline phone logs, and press emails published everywhere across public layouts.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-gray-500">Office Headquarters Address</label>
                    <textarea
                      rows={3}
                      value={settings.contactAddress || ''}
                      onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                      required
                      className="w-full text-xs p-2.5 border rounded-xl focus:border-teal-500 font-medium text-gray-900"
                      placeholder="e.g. Fatima House, 12/A Literary Lane, Writers Block, New Delhi"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-gray-500">Primary Contact Email</label>
                      <input
                        type="email"
                        value={settings.contactEmail || ''}
                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                        required
                        className="w-full text-xs p-2 border rounded-xl focus:border-teal-500 font-medium text-gray-900"
                        placeholder="e.g. contact@fatimapublication.com"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-gray-500">Primary Office Hotline Numbers</label>
                      <input
                        type="text"
                        value={settings.contactPhone || ''}
                        onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                        required
                        className="w-full text-xs p-2 border rounded-xl focus:border-teal-500 font-medium text-gray-900"
                        placeholder="e.g. +91 98871 XXXXX"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer font-sans"
                >
                  Save Preference Settings
                </button>
              </div>

            </div>
          </form>
        )}

      </main>
    </div>
  );
}
