import React from 'react';
import { Book } from '../types';
import { ExternalLink, Eye, ShoppingCart } from 'lucide-react';

interface BookCardProps {
  key?: string | number;
  book: Book;
  onViewDetails: (book: Book) => void;
}

export default function BookCard({ book, onViewDetails }: BookCardProps) {
  // Quick resolver of a cover preview
  const coverSrc = book.coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';

  // Extract first purchase link if any exists
  const firstLinkKey = Object.keys(book.purchaseLinks || {}).find(
    (key) => !!book.purchaseLinks[key as keyof typeof book.purchaseLinks]
  );
  const firstLinkUrl = firstLinkKey 
    ? book.purchaseLinks[firstLinkKey as keyof typeof book.purchaseLinks] 
    : 'https://amazon.com';

  const purchaseUrl = book.buyNowLink || firstLinkUrl;

  return (
    <div
      id={`book-card-${book.id}`}
      className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group h-full hover:-translate-y-1"
    >
      {/* Cover Image container */}
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden shrink-0">
        <img
          src={coverSrc}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        
        {/* Availability Badge Overlay */}
        <span
          className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider z-10 ${
            book.isAvailable
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-rose-100 text-rose-800'
          }`}
        >
          {book.isAvailable ? 'In Stock' : 'Out of Stock'}
        </span>

        {/* Action icons shown on hover */}
        <div className="absolute inset-0 bg-gray-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-2.5 transition-opacity duration-300 z-10">
          <button
            onClick={() => onViewDetails(book)}
            className="p-2.5 bg-white text-gray-900 rounded-full hover:bg-teal-600 hover:text-white transition shadow-lg cursor-pointer flex items-center space-x-1 text-xs font-semibold"
          >
            <Eye className="h-4 w-4" />
            <span>Details</span>
          </button>
        </div>
      </div>

      {/* Content Metadata */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono text-teal-600 uppercase tracking-widest font-bold">
            {book.genre}
          </span>
          <span className="text-[10px] font-mono text-gray-400">
            {book.language}
          </span>
        </div>

        <h3 className="font-serif text-md font-bold text-gray-900 leading-snug group-hover:text-teal-600 transition-colors line-clamp-1">
          {book.title}
        </h3>
        
        <p className="text-xs text-gray-500 mb-2 font-medium">
          by {book.author}
        </p>

        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4 flex-grow">
          {book.description || "An extraordinary literary journey published dynamically under global distribution and design."}
        </p>

        {/* Retail Pricing & Primary Quick-CTAs */}
        <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-auto">
          <span className="text-sm font-mono font-bold text-gray-900">
            {book.price}
          </span>

          <div className="flex space-x-1">
            <button
              onClick={() => onViewDetails(book)}
              className="text-xs text-gray-600 hover:text-teal-600 border border-gray-200 hover:border-teal-200 px-2.5 py-1.5 rounded-lg transition"
            >
              Info
            </button>
            <a
              href={purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition whitespace-nowrap"
            >
              <ShoppingCart className="h-3 w-3" />
              <span>Buy Now</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
