import React, { useState, useEffect } from 'react';
import { StorageService } from '../../db/firebase';
import { Users, Award, BookOpen, Star, Sparkles, MapPin, Briefcase, Heart } from 'lucide-react';

interface JoinViewProps {
  memberCount: number;
  onMemberRegistered: () => void;
}

export default function JoinView({ memberCount, onMemberRegistered }: JoinViewProps) {
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [occupation, setOccupation] = useState('');
  const [interests, setInterests] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [assignedId, setAssignedId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert('Please fill out the required fields (Full Name, Email, Contact Phone).');
      return;
    }

    setSubmitting(true);
    try {
      await StorageService.registerMember({
        name,
        email,
        phone,
        city,
        occupation,
        interests
      });
      
      onMemberRegistered();
      setAssignedId('FAT-MEMBER-' + Math.floor(1000 + Math.random() * 9000));
      setSuccess(true);
      
      // Clear forms
      setName('');
      setEmail('');
      setPhone('');
      setCity('');
      setOccupation('');
      setInterests('');
    } catch (e) {
      console.error(e);
      alert('Failed to register member. Please check values.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="join-community-view" className="animate-fade-in py-12 bg-white text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Heading */}
        <div className="text-center mb-16">
          <span className="text-xs bg-teal-100 text-teal-800 font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Creative Hub
          </span>
          <h1 className="font-serif text-4xl font-extrabold mt-3 text-gray-900 tracking-tight">
            Join the Fatima Publication Community
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm mt-3 leading-relaxed font-sans">
            Connect with seasoned authors, participate in private literary editing clinics, and claim free tickets to physical launch workshops.
          </p>
        </div>

        {/* Counter and Benefits Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* Left Column: Metrics & Why Join */}
          <div className="lg:col-span-5 space-y-8">
            {/* Visual Membership Counter Card */}
            <div className="bg-gradient-to-br from-teal-900 to-cyan-950 p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
              <span className="absolute -top-10 -right-10 text-[150px] text-teal-800/20 font-mono font-black select-none pointer-events-none">
                #
              </span>

              <div className="flex items-center space-x-3.5 mb-4">
                <Users className="h-6 w-6 text-teal-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-300">
                  Total Active Members
                </span>
              </div>
              
              <div className="flex items-baseline space-x-1">
                <span id="registered-counter-value" className="font-serif text-5xl md:text-6xl font-black tracking-tight text-white animate-pulse">
                  {memberCount + 148}
                </span>
                <span className="text-lg font-medium text-teal-300">Writers & Readers</span>
              </div>

              <p className="text-xs text-teal-100/80 leading-relaxed mt-4">
                We are a thriving, cohesive community of researchers, novelists, poets, and visual artists supporting each other dynamically.
              </p>
            </div>

            {/* Structured benefits block */}
            <div className="space-y-5">
              <h3 className="font-serif text-xl font-bold text-gray-900">
                Community Privileges & Benefits
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="p-2 bg-teal-50 border border-teal-100 rounded-xl text-teal-600 shrink-0 mt-0.5">
                    <BookOpen className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-gray-900">Publishing Workshops</h4>
                    <p className="text-xs text-gray-500 leading-normal mt-0.5">
                      Earn free invitations to our monthly webinars covering formatting standardizations, POD setups, and Amazon catalog SEO.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="p-2 bg-teal-50 border border-teal-100 rounded-xl text-teal-600 shrink-0 mt-0.5">
                    <Star className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-gray-900">Editorial Feedback Pools</h4>
                    <p className="text-xs text-gray-500 leading-normal mt-0.5">
                      Gain access to our community manuscript pools, allowing peers and senior reviewers to proofread chapters securely.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="p-2 bg-teal-50 border border-teal-100 rounded-xl text-teal-600 shrink-0 mt-0.5">
                    <Sparkles className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-gray-900">Biannual Creative Anthologies</h4>
                    <p className="text-xs text-gray-500 leading-normal mt-0.5">
                      We select and compile promising short essays and poetry from general members to publish in our combined anthologies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Registration Form */}
          <div className="lg:col-span-1"></div>
          <div className="lg:col-span-6">
            <div className="bg-gray-50 border border-gray-150 rounded-3xl p-6 sm:p-8">
              
              {success ? (
                <div className="text-center py-6 animate-fade-in">
                  <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-gray-900">Welcome Aboard!</h3>
                  <p className="text-xs font-mono text-teal-600 font-bold tracking-wider mt-1">{assignedId}</p>
                  
                  <p className="text-gray-500 text-sm leading-relaxed mt-4 max-w-sm mx-auto">
                    You have successfully registered in our community ecosystem. A registration packet has been routed to your email alongside invitations to our upcoming authors roundtable.
                  </p>

                  <button
                    onClick={() => setSuccess(false)}
                    className="cursor-pointer font-sans bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-5 py-2 rounded-xl transition duration-200 mt-8"
                  >
                    Register Another Member Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">
                    Apply for Free Membership
                  </h3>
                  <p className="text-gray-500 text-xs leading-normal mb-6">
                    Enroll takes under 60 seconds. Free and accessible to everyone.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:border-teal-500 bg-white text-sm text-gray-800 outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. elena@writers.com"
                        className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:border-teal-500 bg-white text-sm text-gray-800 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Contact Phone <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 XXXXX XXXXX"
                        className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:border-teal-500 bg-white text-sm text-gray-800 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" />
                        <span>Residing City</span>
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Mumbai"
                        className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:border-teal-500 bg-white text-sm text-gray-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
                        <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                        <span>Occupation</span>
                      </label>
                      <input
                        type="text"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        placeholder="e.g. Research Scholar"
                        className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:border-teal-500 bg-white text-sm text-gray-800 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
                      <Heart className="h-3.5 w-3.5 text-gray-400" />
                      <span>Writing Focus / Interests</span>
                    </label>
                    <textarea
                      rows={2}
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      placeholder="e.g. Screenplays, historical essays, Sci-Fi prose"
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:border-teal-500 bg-white text-sm text-gray-800 outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="cursor-pointer w-full bg-teal-600 hover:bg-teal-500 text-white py-2.5 rounded-xl font-serif text-sm font-semibold transition flex items-center justify-center space-x-1 shadow-md hover:shadow-lg disabled:bg-gray-300 mt-4"
                  >
                    <span>{submitting ? 'Registering Name...' : 'Register Community Profile'}</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
