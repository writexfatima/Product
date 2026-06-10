import React, { useState, useEffect, useRef } from 'react';
import { PublishingPackage, Testimonial } from '../../types';
import { StorageService } from '../../db/firebase';
import { Check, ArrowRight, ShieldCheck, Mail, Phone, ShoppingBag, Award, MessageSquare, HelpCircle } from 'lucide-react';

export default function PublishView() {
  const [packages, setPackages] = useState<PublishingPackage[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  // Package Inquiry Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [selectedPkg, setSelectedPkg] = useState('Starter Package');
  const [requirements, setRequirements] = useState('');
  const [submittingInq, setSubmittingInq] = useState(false);
  const [successInq, setSuccessInq] = useState(false);

  // Accordion active FAQ state
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const inquiryFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pkgs = await StorageService.getPackages();
        setPackages(pkgs);

        const tests = await StorageService.getTestimonials();
        setTestimonials(tests);
      } catch (e) {
        console.error('Error loading package/testimonial data:', e);
      }
    };
    fetchData();
  }, []);

  const handleSelectPackage = (packageName: string) => {
    setSelectedPkg(packageName);
    inquiryFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert('Please fill out the required contact details (Name, Email, Phone Number).');
      return;
    }

    setSubmittingInq(true);
    try {
      await StorageService.submitPackageInquiry({
        name,
        email,
        phone,
        bookTitle,
        selectedPackage: selectedPkg,
        additionalRequirements: requirements
      });
      setSuccessInq(true);
      setName('');
      setEmail('');
      setPhone('');
      setBookTitle('');
      setRequirements('');
    } catch (err) {
      console.error(err);
      alert('Package inquiry filing failed. Retry.');
    } finally {
      setSubmittingInq(false);
    }
  };

  const FAQS = [
    {
      q: 'Will I retain 100% of my intellectual book rights?',
      a: 'Absolutely. Fatima Publication operates on an author-agency model. You retain full copyright ownership and properties of your writing. We act solely as your design, publication, and distribution agent.'
    },
    {
      q: 'How long does the entire publication lifecycle take?',
      a: 'A typical book draft takes between 30 to 60 days to complete, spanning structural editing reviews, visual layout formatting, cover illustration, ISBN allocation, and global POD indexing.'
    },
    {
      q: 'How are royalty payouts processed and calculated?',
      a: 'We pay authors up to 70% of the net royalties received directly from purchase affiliates like Amazon, Kindle, Flipkart and Google Books. Detailed console records are dispatched quarterly.'
    },
    {
      q: 'Do you publish books in languages other than English?',
      a: 'Yes, we publish across multiple regional languages, including Hindi, Marathi, Bengali, Tamil, and Malayalam, providing full support for non-Latin typesetting.'
    }
  ];

  return (
    <div id="publish-your-book-page" className="animate-fade-in text-left">
      
      {/* 1. Hero banner */}
      <section className="relative bg-gray-950 text-white py-20 px-4 overflow-hidden border-b border-gray-900">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center space-x-1 bg-teal-500/20 text-teal-300 font-mono text-xs px-2.5 py-1 rounded-full border border-teal-500/30 mb-4 font-bold">
            <span>★</span> <span>DESIGN YOUR LITERARY FUTURE</span>
          </span>
          
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Turn Your Manuscript Into a Published Book
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-md leading-relaxed mb-8 font-sans">
            From editing to global distribution, we help authors bring their stories to life. Create customized print paperbacks, electronic ePUB, and hard-bound library editions.
          </p>

          <button
            onClick={() => inquiryFormRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="cursor-pointer bg-teal-600 hover:bg-teal-500 text-white font-serif text-sm font-bold px-7 py-3 rounded-xl transition shadow-lg shadow-teal-900/40"
          >
            Get Started with Professional Publishing Page
          </button>
        </div>
      </section>

      {/* 2. Structured "Why Publish" Columns */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              An End-to-End Publishing Suite
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-xs mt-1">
              Every phase of manuscript production is expertly managed by dedicated designers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50">
              <span className="text-xs font-mono font-bold text-teal-600 block mb-1">01</span>
              <h3 className="text-sm font-serif font-bold text-gray-900 mb-1.5">Editing Services</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Proofreading, substantive grammar, plot holes checking, formatting consistency and layout advice from editors.</p>
            </div>
            <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50">
              <span className="text-xs font-mono font-bold text-teal-600 block mb-1">02</span>
              <h3 className="text-sm font-serif font-bold text-gray-900 mb-1.5">ISBN Registration</h3>
              <p className="text-xs text-gray-500 leading-relaxed">We acquire legal Indian and physical electronic standard book identifiers across hardcover, eBook, and paperbacks.</p>
            </div>
            <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50">
              <span className="text-xs font-mono font-bold text-teal-600 block mb-1">03</span>
              <h3 className="text-sm font-serif font-bold text-gray-900 mb-1.5">Cover Design</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Custom front cover graphics, back descriptions, and spine sizing calculations aligned beautifully for print runs.</p>
            </div>
            <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50">
              <span className="text-xs font-mono font-bold text-teal-600 block mb-1">04</span>
              <h3 className="text-sm font-serif font-bold text-gray-900 mb-1.5">Book Formatting</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">Gutter margins alignment, page numbers headers setup, font pairing, and ePUB/mobi conversion with zero errors.</p>
            </div>
            <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50">
              <span className="text-xs font-mono font-bold text-teal-600 block mb-1">05</span>
              <h3 className="text-sm font-serif font-bold text-gray-900 mb-1.5">Global Distribution</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Print-on-Demand (POD) setups index your books in KDP, Amazon bookstores, Flipkart and Kobo automatically.</p>
            </div>
            <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50">
              <span className="text-xs font-mono font-bold text-teal-600 block mb-1">06</span>
              <h3 className="text-sm font-serif font-bold text-gray-900 mb-1.5">Author Console Support</h3>
              <p className="text-xs text-gray-500 leading-relaxed">View quarterly royalty insights, print direct author copies at manufacturing cost, and request design edits on the fly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Publishing Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs bg-teal-100 text-teal-800 font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Service Tiers
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mt-1">
              Select Your Publishing Package Structure
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-xs mt-1">
              Choose an off-the-shelf option or assemble a bespoke publishing plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                id={`package-tier-${pkg.id}`}
                className="bg-white rounded-2xl border border-gray-150 p-6 flex flex-col justify-between hover:shadow-md hover:border-teal-200 transition duration-300"
              >
                <div>
                  <h3 className="font-serif text-md font-extrabold text-gray-900 mb-1.5">
                    {pkg.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 leading-normal mb-4 font-sans h-10 overflow-hidden line-clamp-2">
                    {pkg.description}
                  </p>
                  
                  {/* Pricing Placeholder */}
                  <div className="my-4 pt-4 border-t border-gray-50">
                    <span className="text-lg font-mono font-bold text-teal-600 block">
                      {pkg.price}
                    </span>
                    <span className="text-[9px] text-gray-400 font-mono block">Inclusive of editorial setups</span>
                  </div>

                  {/* Bullet Listing */}
                  <ul className="space-y-2 mt-5 text-[11px] text-gray-600 font-medium font-sans">
                    {(pkg.features || []).map((feat, index) => (
                      <li key={index} className="flex items-start space-x-1.5 leading-tight">
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectPackage(pkg.name)}
                  className="cursor-pointer w-full bg-gray-950 hover:bg-teal-600 text-white py-2 rounded-xl text-xs font-bold leading-none mt-8 transition"
                >
                  Inquire Package Core
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive Package Inquiry Form */}
      <section ref={inquiryFormRef} className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-gray-50 rounded-3xl border border-gray-150 p-6 sm:p-10">
            
            {successInq ? (
              <div className="text-center py-8">
                <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900">Inquiry Filed Successfully</h3>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed max-w-sm mx-auto font-sans">
                  We have catalogued interests in the <span className="font-bold text-teal-600">"{selectedPkg}"</span> structure. A senior author relationship manager will contact you in 24 hours.
                </p>
                <button
                  onClick={() => setSuccessInq(false)}
                  className="cursor-pointer bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs font-bold px-6 py-2 rounded-xl transition duration-200 mt-6"
                >
                  File Another Package Consultation
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="font-serif text-xl font-bold text-gray-900">
                    Get a Publication Consultation
                  </h3>
                  <p className="text-xs text-gray-500 font-sans mt-0.5">
                    Submit coordinates to arrange editorial callback discussions.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Leo Tolstoy"
                      className="w-full px-3.5 py-2 border border-gray-200 bg-white rounded-xl focus:border-teal-500 text-sm text-gray-800 outline-none animate-fade-in"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. leo@re-publication.com"
                      className="w-full px-3.5 py-2 border border-gray-200 bg-white rounded-xl focus:border-teal-500 text-sm text-gray-800 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Contact Phone <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98871 XXXXX"
                      className="w-full px-3.5 py-2 border border-gray-200 bg-white rounded-xl focus:border-teal-500 text-sm text-gray-800 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Manuscript Book Title
                    </label>
                    <input
                      type="text"
                      value={bookTitle}
                      onChange={(e) => setBookTitle(e.target.value)}
                      placeholder="e.g. Anna Karenina"
                      className="w-full px-3.5 py-2 border border-gray-200 bg-white rounded-xl focus:border-teal-500 text-sm text-gray-800 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Select Publishing Package Plan
                  </label>
                  <select
                    value={selectedPkg}
                    onChange={(e) => setSelectedPkg(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-200 bg-white rounded-xl focus:border-teal-500 text-sm text-gray-800 outline-none cursor-pointer"
                  >
                    <option value="Starter Package">Starter Package</option>
                    <option value="Professional Package">Professional Package</option>
                    <option value="Premium Package">Premium Package</option>
                    <option value="Custom Package">Custom Package</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Additional requirements or notes
                  </label>
                  <textarea
                    rows={3}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Provide specific details e.g., hardcovers print target count, illustration requirements, or custom speed translation requests..."
                    className="w-full px-3.5 py-2 border border-gray-200 bg-white rounded-xl focus:border-teal-500 text-sm text-gray-800 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingInq}
                  className="cursor-pointer w-full bg-teal-600 hover:bg-teal-500 text-white py-2.5 rounded-xl font-serif text-sm font-semibold transition flex items-center justify-center space-x-1 shadow-md hover:shadow-lg disabled:bg-gray-300"
                >
                  <Mail className="h-4 w-4 shrink-0 text-teal-200" />
                  <span>{submittingInq ? 'Scheduling Consultation Lead...' : 'Submit Publishing Consultation Lead'}</span>
                </button>
              </form>
            )}

          </div>
        </div>
      </section>

      {/* 5. Author Testimonials (dynamic) */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs bg-teal-100 text-teal-800 font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Success Stories
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mt-1">
              Feedback from Our Published Authors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test) => (
              <div
                key={test.id}
                id={`testimonial-card-${test.id}`}
                className="bg-white p-6 rounded-2xl border border-gray-150 relative text-left"
              >
                <div className="flex text-amber-500 space-x-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-sm">★</span>
                  ))}
                </div>
                <p className="text-xs text-gray-600 italic leading-relaxed mb-6 font-sans">
                  “{test.text}”
                </p>
                <div className="border-t border-gray-50 pt-3">
                  <h4 className="text-xs font-bold text-gray-900 font-serif">{test.name}</h4>
                  <p className="text-[10px] font-mono text-teal-600 mt-0.5 font-bold uppercase tracking-wider">
                    {test.relation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl font-bold text-gray-900 tracking-tight">
              Common Publishing Questions
            </h2>
            <p className="text-gray-500 text-xs mt-1">
              General inquiries regarding distribution rights, timelines, and logistics.
            </p>
          </div>

          <div className="space-y-3.5">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-gray-50/50 border border-gray-150 rounded-xl overflow-hidden transition"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 focus:outline-none flex justify-between items-center cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-serif font-bold text-gray-900 flex items-center space-x-2">
                      <HelpCircle className="h-4 w-4 text-teal-600 shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <span className="text-teal-600 font-mono font-bold select-none text-xs">
                      {isOpen ? '▲' : '▼'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 border-t border-gray-100 font-sans leading-relaxed animate-fade-in pl-11">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
