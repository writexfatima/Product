import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../../types';
import { StorageService } from '../../db/firebase';
import { Search, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function GalleryView() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        const data = await StorageService.getGalleryItems();
        setItems(data);
      } catch (err) {
        console.error('Error loading gallery items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-mono font-medium animate-pulse">
            <Sparkles className="h-3.5 w-3.5 text-teal-500" />
            <span>Curated Showcase Portfolio</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-gray-950 tracking-tight leading-none">
            Our Literary & Creative Gallery
          </h1>
          <p className="text-gray-600 text-sm sm:text-md leading-relaxed">
            Take a visual tour through our publishing craft, book release events, design workshops, and the inspiring community moments that define our custom author-centric catalog.
          </p>
        </div>

        {/* Filter / Search bar */}
        <div className="max-w-md mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search gallery showcases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs outline-none focus:border-teal-500 shadow-sm transition font-medium"
          />
        </div>

        {/* Grid Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border rounded-3xl overflow-hidden p-4 space-y-4 animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-2xl w-full"></div>
                <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded-md w-full"></div>
                <div className="h-3 bg-gray-200 rounded-md w-5/6"></div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white text-center py-16 px-4 border border-gray-150 rounded-3xl space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <ImageIcon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-gray-900">No Showcase Images Found</h3>
              <p className="text-gray-500 text-xs">Try adjusting your keywords or check back later.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                id={`gallery-item-${item.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group bg-white border border-gray-150 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image wrapper */}
                  <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Body Info */}
                  <div className="p-6 space-y-2 text-left">
                    <h3 className="font-serif font-bold text-gray-905 text-lg group-hover:text-teal-700 transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-550 leading-relaxed font-sans">
                      {item.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 text-left border-t border-gray-50/50">
                  <span className="text-[10px] font-mono text-gray-400">
                    Added {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
