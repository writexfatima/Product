import React, { useState, useEffect } from 'react';
import { Book, PublishingPartner } from '../../types';
import { StorageService } from '../../db/firebase';
import HomeHero from '../HomeHero';
import HomeQuotes from '../HomeQuotes';
import BookCard from '../BookCard';
import { Award, ShieldAlert, Cpu, HeartHandshake, CheckCircle2, Mail, Phone, MapPin, Send } from 'lucide-react';

interface HomeViewProps {
  setCurrentPage: (page: string) => void;
  onViewBookDetails: (book: Book) => void;
  settings?: any;
}

export default function HomeView({ setCurrentPage, onViewBookDetails, settings }: HomeViewProps) {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [partners, setPartners] = useState<PublishingPartner[]>([]);
  
  // Contact Form state info
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch featured books and partners on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const books = await StorageService.getBooks();
        setFeaturedBooks(books.filter(b => b.isFeatured));
        
        const partList = await StorageService.getPartners();
        setPartners(partList);
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
    };
    fetchData();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) {
      setErrorMsg('Please populate all required fields (Name, Email, Message).');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);
    try {
      await StorageService.submitContactMessage({
        name: formName,
        email: formEmail,
        phone: formPhone,
        message: formMessage
      });
      setSuccess(true);
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormMessage('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setErrorMsg('Failed to process message submission. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="home-view" className="animate-fade-in">
      {/* 1. Full-Width Slide Carousel Hero */}
      <HomeHero setCurrentPage={setCurrentPage} />

      {/* 2. Literary Quotes Scroller Section */}
      <HomeQuotes />

      {/* 3. Featured Books Display */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs bg-teal-100 text-teal-800 font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Selected Works
            </span>
            <h2 className="font-serif text-3xl font-bold mt-2 text-gray-900 tracking-tight">
              Featured Publications
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto text-sm mt-2">
              Explore some of our most beautiful, highly discussed, and commercially successful printed works.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.slice(0, 4).map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onViewDetails={onViewBookDetails}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => setCurrentPage('bookstore')}
              className="cursor-pointer font-serif text-teal-600 hover:text-white border border-teal-600 hover:bg-teal-600 font-bold px-6 py-2.5 rounded-xl transition duration-300"
            >
              Examine Complete Bookstore Portfolio
            </button>
          </div>
        </div>
      </section>

      {/* 4. Publishing Partners Section */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-mono font-bold uppercase tracking-widest text-gray-400 mb-6">
            Global Shelf Affiliates & Distribution Partners
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
            {partners.map((partner) => (
              <a
                key={partner.id}
                href={partner.partnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-60 hover:opacity-100 transition duration-200 grayscale hover:grayscale-0 flex flex-col items-center"
                title={`Visit ${partner.name}`}
              >
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="h-9 w-24 object-cover rounded shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[10px] font-mono text-gray-500 mt-1">{partner.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Choose Fatima Publication */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs bg-emerald-100 text-emerald-800 font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Authors First
            </span>
            <h2 className="font-serif text-3xl font-bold mt-2 text-gray-900 tracking-tight">
              Why Publish With Us
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto text-sm mt-2">
              Traditional publishing standards meet boutique, bespoke designer care and seamless logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 text-left">
              <div className="h-10 w-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 mb-5">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-md font-bold text-gray-900 mb-1.5">Professional Editing</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Your writing demands clarity. Our veteran editors refine grammar, logic, and structure while preserving your core voice.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 text-left">
              <div className="h-10 w-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 mb-5">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-md font-bold text-gray-900 mb-1.5">Global Distribution</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                We bridge your book to physical paperbacks and eBooks instantly across major global stores in the US, Europe, and Asia.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 text-left">
              <div className="h-10 w-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 mb-5">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-md font-bold text-gray-900 mb-1.5">Bespoke Design</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Work directly with creative artists to craft custom, gorgeous front covers and interior margins that match your story perfectly.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 text-left">
              <div className="h-10 w-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 mb-5">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-md font-bold text-gray-900 mb-1.5">Dedicated Support</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Bypass opaque gatekeepers. Access author dashboards, sales insights, and direct consulting channels round the clock.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Get in Touch & Contact Submission Section */}
      <section className="py-16 bg-gray-50/70 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Contact details */}
            <div className="lg:col-span-5 text-left">
              <span className="text-xs bg-teal-100 text-teal-800 font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Direct Line
              </span>
              <h2 className="font-serif text-3xl font-bold mt-2 text-gray-900 tracking-tight">
                Get In Touch With Us
              </h2>
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                Have publishing questions, bulk library orders, or press inquiries? Fill out the contact desk or contact us directly.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-white rounded-xl border border-gray-200 text-teal-600 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">Headquarters Address</h4>
                    <p className="text-gray-700 text-sm mt-0.5 font-medium leading-relaxed font-sans">
                      {settings?.contactAddress || "Fatima House, 12/A Literary Lane, Writers Block, New Delhi, India"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-white rounded-xl border border-gray-200 text-teal-600 shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">Press & Editorial Email</h4>
                    <p className="text-gray-700 text-sm font-semibold tracking-wide mt-0.5 font-sans">
                      {settings?.contactEmail || "contact@fatimapublication.com"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-white rounded-xl border border-gray-200 text-teal-600 shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">Author Consulting Office</h4>
                    <p className="text-gray-700 text-sm font-semibold mt-0.5 font-sans">
                      {settings?.contactPhone || "+91 98871 XXXXX / +91 11 2345 XXXX"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-6 text-left">
                  Send a Direct Message
                </h3>

                <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Liam Sterling"
                        className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-sm text-gray-800 bg-gray-50/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="e.g. liam@writershub.com"
                        className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-sm text-gray-800 bg-gray-50/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-sm text-gray-800 bg-gray-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Message details <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Type your outline, publishing questions, translation inquiries..."
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-sm text-gray-800 bg-gray-50/50 resize-y"
                      required
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-rose-600 font-mono font-semibold bg-rose-50 px-3 py-1.5 rounded-lg">
                      ⚠️ {errorMsg}
                    </p>
                  )}

                  {success && (
                    <p className="text-xs text-emerald-800 font-mono font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center space-x-1.5">
                      <span>✓</span> <span>Message received. Our lead editor will contact you shortly.</span>
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="cursor-pointer w-full bg-teal-600 hover:bg-teal-500 text-white py-2.5 rounded-xl font-serif text-sm font-semibold transition flex items-center justify-center space-x-1 shadow-md hover:shadow-lg disabled:bg-gray-300"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{submitting ? 'Sending Message...' : 'Submit Message Outline'}</span>
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
