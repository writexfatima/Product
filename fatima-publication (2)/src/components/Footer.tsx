import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Rss } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
  contactAddress: string;
  contactEmail: string;
  contactPhone: string;
  siteName?: string;
  siteIconUrl?: string;
}

export default function Footer({ setCurrentPage, contactAddress, contactEmail, contactPhone, siteName, siteIconUrl }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="app-footer" className="bg-gray-950 text-gray-300 pt-16 pb-8 border-t border-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1 border-b md:border-b-0 pb-6 md:pb-0 border-gray-800">
            <div className="flex items-center space-x-2.5 mb-4">
              {siteIconUrl ? (
                <img src={siteIconUrl} alt="Logo" referrerPolicy="no-referrer" className="w-8 h-8 object-contain shrink-0 rounded-lg" />
              ) : (
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white">
                  <div className="w-4 h-4 border-2 border-white rounded-xs rotate-45"></div>
                </div>
              )}
              <span className="text-lg font-bold text-white tracking-tight uppercase">
                {siteName || 'FATIMA PUBLICATION'}
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              {siteName || 'Fatima Publication'} empowers independent thinkers, academic researchers, and creative minds to bring their manuscripts to global bookstores.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3.5">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-900 rounded-lg hover:bg-teal-600 hover:text-white transition-colors duration-200">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-900 rounded-lg hover:bg-teal-600 hover:text-white transition-colors duration-200">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-900 rounded-lg hover:bg-teal-600 hover:text-white transition-colors duration-200">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-900 rounded-lg hover:bg-teal-600 hover:text-white transition-colors duration-200">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-mono text-teal-500">Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-teal-400 hover:underline transition">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('about')} className="hover:text-teal-400 hover:underline transition">
                  About
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('bookstore')} className="hover:text-teal-400 hover:underline transition">
                  Bookstore Catalog
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('join')} className="hover:text-teal-400 hover:underline transition">
                  Join
                </button>
              </li>
            </ul>
          </div>

          {/* Author services column */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-mono text-teal-500">Author Services</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setCurrentPage('manuscript')} className="hover:text-teal-400 hover:underline transition">
                  Submit
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('publish')} className="hover:text-teal-400 hover:underline transition">
                  Publish Your Book
                </button>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Fatima Publication Privacy Policy: We hold submitted manuscript properties strictly confidential. We will never share your personal data, draft files, or synopsis details with external sources or networks."); }} className="hover:text-teal-400 hover:underline transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Fatima Publication Terms & Conditions: By submitting manuscript previews, users verify that the work is an original writing of the stated author. No copyright violations should be contained."); }} className="hover:text-teal-400 hover:underline transition">
                  Terms and Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-mono text-teal-500">Get In Touch</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start space-x-2.5">
                <MapPin className="h-4.5 w-4.5 text-teal-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{contactAddress}</span>
              </div>
              <div className="flex items-center space-x-2.5 font-mono">
                <Mail className="h-4 w-4 text-teal-500" />
                <a href={`mailto:${contactEmail}`} className="hover:text-white transition">{contactEmail}</a>
              </div>
              <div className="flex items-center space-x-2.5 font-mono">
                <Phone className="h-4 w-4 text-teal-500" />
                <span>{contactPhone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-gray-500 font-mono">
            &copy; {currentYear} {siteName || 'Fatima Publication'}. All rights reserved globally.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0 text-xs text-gray-500 font-mono">
            <span>Powered by Google Cloud Run & Firebase Storage</span>
            <span>·</span>
            <button onClick={() => alert("Registrations: Reg No. IN-DL7329581A-FATIMA.")} className="hover:text-teal-400">
              Registration Certificate DL73
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
