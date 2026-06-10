import React, { useState, useEffect } from 'react';
import { Book } from '../../types';
import { StorageService } from '../../db/firebase';
import BookCard from '../BookCard';
import { Search, Filter, SlidersHorizontal, BookOpen, X, ExternalLink, ShoppingBag } from 'lucide-react';

interface BookstoreViewProps {
  selectedDetailBook: Book | null;
  setSelectedDetailBook: (book: Book | null) => void;
}

export default function BookstoreView({ selectedDetailBook, setSelectedDetailBook }: BookstoreViewProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedAuthor, setSelectedAuthor] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  // Load books
  const loadBooks = async () => {
    try {
      const data = await StorageService.getBooks();
      setBooks(data);
    } catch (e) {
      console.error('Error fetching Bookstore list:', e);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // Compute unique values for filtering selectors
  const genres = ['All', ...Array.from(new Set(books.map((b) => b.genre)))];
  const authors = ['All', ...Array.from(new Set(books.map((b) => b.author)))];
  const languages = ['All', ...Array.from(new Set(books.map((b) => b.language)))];

  // Apply filters
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.description && book.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
    const matchesAuthor = selectedAuthor === 'All' || book.author === selectedAuthor;
    const matchesLanguage = selectedLanguage === 'All' || book.language === selectedLanguage;

    return matchesSearch && matchesGenre && matchesAuthor && matchesLanguage;
  });

  return (
    <div id="bookstore-catalog-view" className="animate-fade-in py-12 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center mb-10">
          <span className="text-xs bg-teal-100 text-teal-800 font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Explore Catalog
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-extrabold mt-3 text-gray-900 tracking-tight">
            The Bookstore
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-sm mt-2 leading-relaxed font-sans">
            Search and filter through our active list of published paperbacks, hardcovers, and immersive digital eBooks.
          </p>
        </div>

        {/* Dynamic Search & Filters Console */}
        <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm mb-10 text-left">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Search inputs */}
            <div className="md:col-span-5 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by book title, author name, or synopsis..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-sm text-gray-800"
              />
            </div>

            {/* Select Genre */}
            <div className="md:col-span-2 relative">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-teal-500 outline-none text-xs text-gray-700 font-medium cursor-pointer appearance-none"
              >
                <option value="All">All Genres</option>
                {genres.filter(g => g !== 'All').map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Select Author */}
            <div className="md:col-span-2 relative">
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-teal-500 outline-none text-xs text-gray-700 font-medium cursor-pointer appearance-none"
              >
                <option value="All">All Authors</option>
                {authors.filter(a => a !== 'All').map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Select Language */}
            <div className="md:col-span-2 relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-teal-500 outline-none text-xs text-gray-700 font-medium cursor-pointer appearance-none"
              >
                <option value="All">All Languages</option>
                {languages.filter(l => l !== 'All').map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Reset option */}
            <div className="md:col-span-1 text-center md:text-right">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGenre('All');
                  setSelectedAuthor('All');
                  setSelectedLanguage('All');
                }}
                className="text-xs text-rose-500 hover:text-rose-700 font-semibold font-mono underline transition cursor-pointer"
              >
                Clear
              </button>
            </div>

          </div>
        </div>

        {/* Selected Results Count */}
        <div className="flex justify-between items-center mb-6 font-mono text-xs text-gray-400">
          <span>Found {filteredBooks.length} books in physical & digital catalogs</span>
          {searchQuery && <span>Matching: "{searchQuery}"</span>}
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onViewDetails={setSelectedDetailBook}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-sm mx-auto shadow-xs">
            <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-4" />
            <h3 className="font-serif text-lg font-bold text-gray-700">No Books Found</h3>
            <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
              We couldn't locate any matching book works with the specified query context. Try resetting filters.
            </p>
          </div>
        )}

        {/* -------------------- DETAIL OVERLAY MODAL -------------------- */}
        {selectedDetailBook && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Dark drop background */}
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs transition-opacity"
                onClick={() => setSelectedDetailBook(null)}
                aria-hidden="true"
              ></div>

              {/* Centered Modal content */}
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-100 p-6 sm:p-8 animate-fade-in">
                {/* Close Button Pin */}
                <button
                  onClick={() => setSelectedDetailBook(null)}
                  className="absolute top-5 right-5 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-4">
                  {/* Left Column: Cover */}
                  <div className="md:col-span-5 flex justify-center">
                    <div className="w-full max-w-[240px] aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm relative shrink-0">
                      <img
                        src={selectedDetailBook.coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400'}
                        alt={selectedDetailBook.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Right Column: Metadata Details */}
                  <div className="md:col-span-7 text-left flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] bg-teal-100 text-teal-800 font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {selectedDetailBook.genre}
                        </span>
                        <span className="text-xs text-gray-400 font-mono h-5 flex items-center">
                          Language: {selectedDetailBook.language}
                        </span>
                      </div>

                      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1 leading-snug">
                        {selectedDetailBook.title}
                      </h2>
                      <p className="text-sm text-teal-600 font-medium mb-4">
                        by {selectedDetailBook.author}
                      </p>

                      {/* Technical specifications info */}
                      <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 mb-4 font-mono text-[10px] text-gray-500">
                        <div>
                          <strong className="text-gray-700 block">ISBN Token Code</strong>
                          <span>ISBN-13: 978-81-{selectedDetailBook.id.toUpperCase()}</span>
                        </div>
                        <div>
                          <strong className="text-gray-700 block">Published Year</strong>
                          <span>{new Date(selectedDetailBook.createdAt || '2025').getFullYear()}</span>
                        </div>
                      </div>

                      <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider font-semibold mb-1">Synopsis Outline</h4>
                      <p className="text-xs text-gray-600 leading-relaxed mb-6 font-sans">
                        {selectedDetailBook.description || "An extraordinary narrative tracing character development, historical themes, and societal challenges published directly with standard global POD linkages."}
                      </p>
                    </div>

                    {/* Affiliate Store Links Panel */}
                    <div className="border-t border-gray-100 pt-4 mt-auto">
                      <div className="flex items-center justify-between font-mono text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
                        <span>Buy this book from:</span>
                        <span className="text-gray-900">{selectedDetailBook.price}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {selectedDetailBook.buyNowLink && (
                          <a
                            href={selectedDetailBook.buyNowLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-4 py-2 rounded-xl font-mono font-bold flex items-center space-x-1.5 transition shadow-sm border border-teal-500 hover:border-teal-600 animate-pulse"
                          >
                            <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
                            <span>Buy Now (Direct checkout)</span>
                          </a>
                        )}
                        {selectedDetailBook.purchaseLinks?.amazon && (
                          <a
                            href={selectedDetailBook.purchaseLinks.amazon}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 text-xs px-3 py-1.5 rounded-lg font-mono font-bold flex items-center space-x-1.5 transition"
                          >
                            <ShoppingBag className="h-3 w-3 shrink-0" />
                            <span>Amazon Store</span>
                          </a>
                        )}
                        {selectedDetailBook.purchaseLinks?.kindle && (
                          <a
                            href={selectedDetailBook.purchaseLinks.kindle}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs px-3 py-1.5 rounded-lg font-mono font-bold flex items-center space-x-1.5 transition"
                          >
                            <span>Amazon Kindle</span>
                          </a>
                        )}
                        {selectedDetailBook.purchaseLinks?.googlePlay && (
                          <a
                            href={selectedDetailBook.purchaseLinks.googlePlay}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs px-3 py-1.5 rounded-lg font-mono font-bold flex items-center space-x-1.5 transition"
                          >
                            <ExternalLink className="h-3 w-3 shrink-0" />
                            <span>Google Play</span>
                          </a>
                        )}
                        {selectedDetailBook.purchaseLinks?.flipkart && (
                          <a
                            href={selectedDetailBook.purchaseLinks.flipkart}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border border-yellow-200 text-xs px-3 py-1.5 rounded-lg font-mono font-bold flex items-center space-x-1.5 transition"
                          >
                            <span>Flipkart POS</span>
                          </a>
                        )}
                        {selectedDetailBook.purchaseLinks?.kobo && (
                          <a
                            href={selectedDetailBook.purchaseLinks.kobo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs px-3 py-1.5 rounded-lg font-mono font-bold flex items-center space-x-1.5 transition"
                          >
                            <span>Kobo Reader</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
