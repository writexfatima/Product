import React, { useState, useEffect } from 'react';
import { Quote } from '../types';
import { StorageService } from '../db/firebase';

export default function HomeQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const list = await StorageService.getQuotes();
        if (list.length > 0) {
          setQuotes(list);
        }
      } catch (e) {
        console.error('Error fetching quotes:', e);
      }
    };
    loadQuotes();
  }, []);

  // Quotes alternate every 7s
  useEffect(() => {
    if (quotes.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % quotes.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [quotes]);

  if (quotes.length === 0) return null;

  return (
    <section id="literary-quotes-carousel" className="bg-[#f5f2eb] text-[#2d2a26] py-12 px-4 border-y border-[#2d2a26]/10 relative overflow-hidden">
      {/* Absolute decorative quotation visual backdrops */}
      <span className="absolute -top-10 left-6 text-[180px] text-[#5a5a40]/10 font-serif font-black select-none pointer-events-none">
        “
      </span>
      <span className="absolute -bottom-24 right-6 text-[180px] text-[#5a5a40]/10 font-serif font-black select-none pointer-events-none">
        ”
      </span>

      <div className="max-w-4xl mx-auto text-center h-[120px] md:h-[90px] flex flex-col justify-center relative">
        {quotes.map((quote, idx) => (
          <div
            key={quote.id}
            className={`transition-all duration-700 absolute inset-0 flex flex-col items-center justify-center ${
              idx === activeIdx ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
            }`}
          >
            <p className="font-serif text-sm md:text-lg italic text-[#2d2a26]/90 tracking-wide font-medium">
              "{quote.text}"
            </p>
            <p className="text-xs md:text-sm font-mono text-teal-600 mt-2 font-bold uppercase tracking-widest">
              — {quote.author}
            </p>
          </div>
        ))}
      </div>

      {/* Manual Indicator Bullets */}
      <div className="flex justify-center space-x-1.5 mt-4">
        {quotes.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`h-1.5 rounded-full cursor-pointer transition-all ${
              idx === activeIdx ? 'w-5 bg-teal-600' : 'w-1.5 bg-teal-200 hover:bg-teal-300'
            }`}
            aria-label={`Go to literary quote ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
