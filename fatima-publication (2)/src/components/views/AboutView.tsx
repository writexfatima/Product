import React, { useState, useEffect } from 'react';
import { TeamMember, TimelineEvent, AppSettings } from '../../types';
import { StorageService } from '../../db/firebase';
import { Award, Compass, Heart, ShieldCheck, Download, Calendar } from 'lucide-react';

export default function AboutView() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamList = await StorageService.getTeamMembers();
        setTeam(teamList);

        const timeList = await StorageService.getTimelineEvents();
        setTimeline(timeList);

        const appSet = await StorageService.getSettings();
        setSettings(appSet);
      } catch (e) {
        console.error('Error fetching About Us data:', e);
      }
    };
    fetchData();
  }, []);

  const handleDownloadCertificate = () => {
    // Generate simple text file blob that simulates the PDF and download it
    const content = `===================================================================
                  GOVERNMENT OF INDIA REGISTRATION
===================================================================
REGISTRY CODE: IN-DL7329581A-FATIMA
PUBLISHER CODE: FAT-98871
ISSUED TO: FATIMA PUBLICATION
AUTHORIZED BY: Ministry of Commerce & Information Broadcasting

Headquarters Address:
Fatima House, 12/A Literary Lane, Writers Block, New Delhi, India

Establishment Year: 2018
Category: Literary Publication, eBooks Content Platform, Physical Printing Logistics

This document verifies that Fatima Publication is a legally registered
corporative entity authorized to issue international standard book
identifiers (ISBN) and manage global shipping distribution channels.

===================================================================
                      VALID COGNIZANCE DL73
===================================================================`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Fatima_Publication_Registration_Certificate.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="about-us-view" className="animate-fade-in py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Heading */}
        <div className="text-center mb-16">
          <span className="text-xs bg-teal-100 text-teal-800 font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Our Heritage
          </span>
          <h1 className="font-serif text-4xl font-extrabold mt-3 text-gray-900 tracking-tight">
            The Story of Fatima Publication
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm mt-3 leading-relaxed">
            Founded with a passion for creative expression, we combine classical narrative standards with modern digital distribution lanes.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 text-left">
          <div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
              Building Bridges for Storytelling
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4 font-sans">
              {settings?.aboutStory || DEFAULTS_story_fallback()}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed font-sans">
              We look at self-publishing not as an isolated effort, but as a prestigious co-creation. Authors work direct with designated illustrators and veteran editors to release publications that stand upright on any bookshelf in Delhi, London, or San Francisco.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-100">
              <div className="h-9 w-9 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 mb-4">
                <Compass className="h-5 w-5" />
              </div>
              <h4 className="font-serif text-sm font-bold text-gray-900 mb-1">Our Mission</h4>
              <p className="text-gray-500 text-xs leading-relaxed">
                {settings?.aboutMission || "To empower visionaries and storytellers across the globe with access to editing visual craft and distribution without bounds."}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100">
              <div className="h-9 w-9 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 mb-4">
                <Award className="h-5 w-5" />
              </div>
              <h4 className="font-serif text-sm font-bold text-gray-900 mb-1">Our Vision</h4>
              <p className="text-gray-500 text-xs leading-relaxed">
                {settings?.aboutVision || "To become a preeminent globally accessible platform that transforms raw ideas into literary and cultural landmarks."}
              </p>
            </div>

            <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-teal-50 to-emerald-50 p-5 rounded-xl border border-teal-100 text-left">
              <div className="flex items-center space-x-2 text-teal-800 font-serif font-bold text-sm mb-3">
                <Heart className="h-4.5 w-4.5 text-teal-600" />
                <span>Core Values We Live By</span>
              </div>
              <ul className="space-y-2 text-xs text-teal-900 leading-relaxed font-sans font-medium">
                {(settings?.aboutValues || [
                  'Editorial Rigour: Beautiful writing is crafted with tireless care.',
                  'Author Agency: Authors are co-creators of their visual identity.',
                  'Global Ingress: Reaching readers wherever books are read online.',
                  'Inclusive Narratives: Storytelling across cultural boundaries.'
                ]).map((val, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-teal-600 mt-0.5">•</span>
                    <span>{val}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Dynamic Chronological Milestones Timeline */}
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 mb-20 text-left border border-gray-100">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1 text-center">
            Chronological Milestones
          </h2>
          <p className="text-gray-500 text-xs leading-normal mt-1 mb-10 text-center">
            Loaded dynamically from our active Firestore datastore
          </p>

          <div className="relative border-l border-teal-200 ml-4 md:ml-24 space-y-8 py-4">
            {timeline.map((event) => (
              <div key={event.id} id={`milestone-${event.id}`} className="relative pl-6 md:pl-8">
                {/* Visual marker */}
                <span className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-teal-600 bg-white shadow-xs"></span>
                
                {/* Date marker */}
                <div className="md:absolute md:-left-24 md:top-1.5 md:w-20 md:text-right">
                  <span className="inline-flex items-center space-x-1 bg-teal-100 text-teal-800 font-mono text-xs px-2 py-0.5 rounded-md font-bold">
                    <Calendar className="h-3 w-3" />
                    <span>{event.year}</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-sm md:text-md font-bold text-gray-900 leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-gray-500 text-xs md:text-sm mt-1 max-w-xl leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Founders and Team Section */}
        <div className="mb-20">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3 text-center">
            Founders and Team Leadership
          </h2>
          <p className="text-gray-500 text-sm mb-12 text-center max-w-md mx-auto">
            Our editors, visual layout planners, and design architects bringing books to physical form.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.id}
                id={`team-member-${member.id}`}
                className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition p-5 text-left flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4"
              >
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover shadow-sm shrink-0 border border-gray-100"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-serif text-md font-bold text-gray-900">{member.name}</h3>
                  <span className="text-teal-600 font-mono text-xs uppercase tracking-wider font-bold">
                    {member.designation}
                  </span>
                  <p className="text-gray-500 text-xs leading-relaxed mt-2">
                    {member.biography}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Certificate Section */}
        <div className="border border-gray-150 rounded-2xl p-6 sm:p-10 bg-gray-50/50 max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8 text-left">
          {/* Certificate visual card */}
          <div 
            className="bg-amber-50 h-52 w-full md:w-72 shrink-0 border border-amber-200 rounded-lg p-4 flex flex-col justify-between font-serif shadow-xs relative overflow-hidden select-none"
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
                  {settings?.certCardHeader || "Registration Certificate"}
                </span>
                <span className="text-[8px] font-mono text-amber-600 select-none">
                  {settings?.certCardSubHeader || "Govt. of India Legal Cognizance"}
                </span>
              </div>
              <div className="text-[11px] font-sans font-medium text-amber-900 leading-snug space-y-0.5 my-2 select-none">
                <p className="select-none">NAME: <span className="font-semibold text-gray-900 select-none">{settings?.certCardName || "Fatima Publication"}</span></p>
                <p className="select-none">CODE: <span className="font-semibold text-gray-900 select-none">{settings?.certCardCode || "FAT-DL7329581A"}</span></p>
                <p className="select-none">STATUS: <span className="font-semibold text-emerald-800 bg-emerald-100 px-1 py-0.2 rounded select-none">{settings?.certCardStatus || "Active Partner"}</span></p>
              </div>
              <div className="flex justify-between items-center text-[8px] font-mono text-amber-700 select-none">
                <span className="select-none">NEW DELHI</span>
                <span className="border-t border-amber-400 pt-0.5 select-none font-bold">DIRECTOR SECY</span>
              </div>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center space-x-1.5 text-xs text-amber-800 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full font-mono font-bold leading-none mb-3">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
              <span>Certified Publisher DL73</span>
            </span>
            <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">
              {settings?.certTitle || "Legal Incorporative Proof"}
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed font-sans">
              {settings?.certDescription || "Fatima Publication holds a valid certification issued under Ministry of Commerce and Information Broadcasting Reg No. IN-DL7329581A-FATIMA."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

function DEFAULTS_story_fallback() {
  return "Founded in 2018, Fatima Publication emerged from a simple observation: some of the most profound voices in modern literature often remain unheard. We set out to build a publishing bridge that combines the quality standards of traditional publishing houses with the custom care, agility, and global digital distribution expected by modern authors.";
}
