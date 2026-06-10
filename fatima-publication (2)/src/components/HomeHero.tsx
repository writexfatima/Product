import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, UploadCloud, CheckCircle } from 'lucide-react';
import { StorageService } from '../db/firebase';
import { HeroSlide } from '../types';

interface HomeHeroProps {
  setCurrentPage: (page: string) => void;
}

export default function HomeHero({ setCurrentPage }: HomeHeroProps) {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const loadedSlides = await StorageService.getHeroSlides();
        setSlides(loadedSlides);
      } catch (err) {
        console.error("Failed to load slides", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSlides();
  }, []);

  // Auto-slide every 5 seconds as requested in specifications
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  const nextSlide = () => {
    if (slides.length <= 1) return;
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length <= 1) return;
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (isLoading || slides.length === 0) {
    return (
      <div className="h-[450px] md:h-[550px] bg-gray-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-3">
          <span className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span className="text-xs font-mono tracking-wider opacity-60">LOADING HERO STORY...</span>
        </div>
      </div>
    );
  }

  return (
    <section id="hero-slider" className="relative group bg-gray-900 overflow-hidden h-[450px] md:h-[550px]">
      {/* Background slide images */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id || idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          {/* Cover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/70 to-transparent z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center animate-fade-in"
            referrerPolicy="no-referrer"
          />

          {/* Slogan Content Container */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl text-left">
                <span className="inline-flex items-center space-x-1 bg-teal-500/20 text-teal-300 font-mono text-xs px-2.5 py-1 rounded-full border border-teal-500/30 mb-4 animate-pulse">
                  <span>●</span> <span>Fatima Premium Publisher</span>
                </span>
                <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                  {slide.title}
                </h1>
                <p className="text-sm md:text-lg text-gray-300 mb-8 leading-relaxed font-sans max-w-xl">
                  {slide.subtitle}
                </p>

                {/* Call-to-actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setCurrentPage(slide.primaryAction)}
                    className="cursor-pointer bg-teal-600 hover:bg-teal-500 text-white font-serif text-sm px-7 py-3 rounded-full font-bold transition flex items-center space-x-2 shadow-lg shadow-teal-950/25 hover:-translate-y-0.5"
                  >
                    {slide.primaryAction === 'bookstore' && <BookOpen className="h-4 w-4" />}
                    {slide.primaryAction === 'manuscript' && <UploadCloud className="h-4 w-4" />}
                    {slide.primaryAction === 'join' && <CheckCircle className="h-4 w-4" />}
                    <span>{slide.primaryCta}</span>
                  </button>

                  <button
                    onClick={() => setCurrentPage(slide.secondaryAction)}
                    className="cursor-pointer bg-white/10 hover:bg-white/20 text-white font-sans text-sm px-6 py-3 rounded-full font-semibold border border-white/20 backdrop-blur-xs transition hover:-translate-y-0.5"
                  >
                    {slide.secondaryCta}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Manual Sliding Left Arrow */}
      {slides.length > 1 && (
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/10 hover:bg-white/20 hover:scale-105 border border-white/10 rounded-full text-white backdrop-blur-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Previous Slide"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}

      {/* Manual Sliding Right Arrow */}
      {slides.length > 1 && (
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/10 hover:bg-white/20 hover:scale-105 border border-white/10 rounded-full text-white backdrop-blur-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Next Slide"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      )}

      {/* Slide Navigation Indicator Bullets */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                idx === activeSlide ? 'w-6 bg-teal-500' : 'w-2 bg-white/45 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
