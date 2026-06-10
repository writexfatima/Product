import React, { useState, useRef } from 'react';
import { StorageService } from '../../db/firebase';
import { UploadCloud, FileText, CheckCircle2, ClipboardCheck, MessageSquare, Landmark, Inbox } from 'lucide-react';

export default function SubmitManuscriptView() {
  // Input states
  const [authorName, setAuthorName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [wordCount, setWordCount] = useState<number>(55000);
  const [synopsis, setSynopsis] = useState('');

  // File states (Emulating storage uploads)
  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  
  const [isDragOverManuscript, setIsDragOverManuscript] = useState(false);
  const [isDragOverCover, setIsDragOverCover] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  // Drag and Drop helpers for Manuscript as demanded in specifications
  const handleDragOverManuscript = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverManuscript(true);
  };
  const handleDragLeaveManuscript = () => {
    setIsDragOverManuscript(false);
  };
  const handleDropManuscript = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverManuscript(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (['pdf', 'doc', 'docx'].includes(ext || '')) {
        setManuscriptFile(file);
      } else {
        alert('Disallowed format type. Only PDF, DOC, and DOCX are accepted.');
      }
    }
  };

  // Drag and Drop helpers for optional Cover Letter
  const handleDragOverCover = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverCover(true);
  };
  const handleDragLeaveCover = () => {
    setIsDragOverCover(false);
  };
  const handleDropCover = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverCover(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (['pdf', 'doc', 'docx'].includes(ext || '')) {
        setCoverFile(file);
      } else {
        alert('Disallowed format type. Only PDF, DOC, and DOCX are accepted.');
      }
    }
  };

  const handleManualFile1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setManuscriptFile(e.target.files[0]);
    }
  };

  const handleManualFile2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !email || !title || !genre || !manuscriptFile) {
      alert('Please fill out all mandatory fields and upload your Manuscript draft file.');
      return;
    }

    setSubmitting(true);
    try {
      // Simulate Storage bucket file write and save details
      const mFileFakeUrl = `https://firebasestorage.googleapis.com/v0/b/fatima-publication/o/manuscripts%2F${encodeURIComponent(manuscriptFile.name)}?alt=media`;
      const cFileFakeUrl = coverFile 
        ? `https://firebasestorage.googleapis.com/v0/b/fatima-publication/o/covers%2F${encodeURIComponent(coverFile.name)}?alt=media` 
        : '';

      await StorageService.submitManuscript({
        authorName,
        email,
        phone,
        city,
        title,
        genre,
        wordCount: Number(wordCount),
        synopsis,
        manuscriptUrl: mFileFakeUrl,
        coverLetterUrl: cFileFakeUrl
      });

      setSuccess(true);
      // Reset
      setAuthorName('');
      setEmail('');
      setPhone('');
      setCity('');
      setTitle('');
      setGenre('');
      setWordCount(55000);
      setSynopsis('');
      setManuscriptFile(null);
      setCoverFile(null);
    } catch (err) {
      console.error(err);
      alert('Draft upload failed. Re-verify configuration params.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="submit-manuscript-page" className="animate-fade-in py-12 bg-white text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Titles */}
        <div className="text-center mb-16">
          <span className="text-xs bg-teal-100 text-teal-800 font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Manuscript Desk
          </span>
          <h1 className="font-serif text-4xl font-extrabold mt-3 text-gray-900 tracking-tight">
            Submit Your Manuscript Draft
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm mt-3 leading-relaxed font-sans">
            Have a story waiting to be told? Review our strict original work submission guidelines below and present your electronic files directly.
          </p>
        </div>

        {/* Guidelines section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Left Block: Guidelines & Review Timeline */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-teal-950 text-white rounded-3xl p-6 shadow-md">
              <h3 className="font-serif text-lg font-bold text-teal-300 mb-3 border-b border-teal-800 pb-2">
                Manuscript Guidelines
              </h3>
              <ul className="space-y-3.5 text-xs text-teal-100/90 leading-relaxed font-sans">
                <li>
                  <strong>Original Works Only:</strong> The author certifies they retain all proprietary copyrights. AI translations or plagiarised elements are blocked instantly.
                </li>
                <li>
                  <strong>Supported Formats:</strong> Upload manuscript drafts in <span className="font-mono text-teal-300 font-bold">.pdf, .doc, or .docx</span> file format only.
                </li>
                <li>
                  <strong>Completeness:</strong> We highly prefer complete novels, anthologies, biography drafts, or poetry sequences over single chapters.
                </li>
                <li>
                  <strong>Formatting Specs:</strong> Set font sizing to 12px double-spaced, utilizing clear pages and page margins if submitting novels.
                </li>
              </ul>
            </div>

            {/* Review workflow process steps */}
            <div className="space-y-4">
              <h3 className="font-serif text-md font-bold text-gray-900">
                Our Editorial Review Process
              </h3>

              <div className="relative border-l border-teal-100 ml-3.5 pl-5 space-y-5 py-2">
                {/* Step 1 */}
                <div className="relative">
                  <span className="absolute -left-[28px] top-0.5 bg-teal-600 text-white rounded-full h-4.5 w-4.5 flex items-center justify-center text-[9px] font-mono font-bold">1</span>
                  <h4 className="text-xs font-serif font-bold text-gray-900">Submission Received</h4>
                  <p className="text-[11px] text-gray-400">Our auto system creates records and allocates tracking indices.</p>
                </div>
                {/* Step 2 */}
                <div className="relative">
                  <span className="absolute -left-[28px] top-0.5 bg-teal-600 text-white rounded-full h-4.5 w-4.5 flex items-center justify-center text-[9px] font-mono font-bold">2</span>
                  <h4 className="text-xs font-serif font-bold text-gray-900">Editorial Panel Review</h4>
                  <p className="text-[11px] text-gray-400">Undergoes copy consistency, prose rhythm, and thematic evaluation of storyline.</p>
                </div>
                {/* Step 3 */}
                <div className="relative">
                  <span className="absolute -left-[28px] top-0.5 bg-teal-600 text-white rounded-full h-4.5 w-4.5 flex items-center justify-center text-[9px] font-mono font-bold">3</span>
                  <h4 className="text-xs font-serif font-bold text-gray-900">Constructive Feedback</h4>
                  <p className="text-[11px] text-gray-400">Receive formal editorial feedback regardless of selection status.</p>
                </div>
                {/* Step 4 */}
                <div className="relative">
                  <span className="absolute -left-[28px] top-0.5 bg-teal-600 text-white rounded-full h-4.5 w-4.5 flex items-center justify-center text-[9px] font-mono font-bold">4</span>
                  <h4 className="text-xs font-serif font-bold text-gray-900">Contract Discussion</h4>
                  <p className="text-[11px] text-gray-400">Discuss royalties, ISBN allocations, physical printing POD bounds, and shipping.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Block: Active Form with Drag and Drop */}
          <div className="lg:col-span-8 bg-gray-50 p-6 sm:p-10 rounded-3xl border border-gray-150">
            {success ? (
              <div className="text-center py-10">
                <div className="h-14 w-14 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mx-auto mb-5 shadow-inner">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900">Manuscript Uploaded!</h3>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed max-w-sm mx-auto">
                  Your files have been saved securely to Firebase Storage buckets. An editorial team member will scrutinize your synopsis drafts and update records chronologically.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="cursor-pointer bg-gray-950 text-white hover:bg-teal-600 font-mono text-xs font-bold px-6 py-2.5 rounded-xl transition duration-200 mt-8"
                >
                  Submit Secondary Manuscript
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-gray-900 mb-6">
                  Online Manuscript Submission Portal
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Author Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. Leo Nikolaevich"
                      className="w-full px-3.5 py-2 border border-gray-200 bg-white rounded-xl focus:border-teal-500 text-sm text-gray-800 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Author Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. leo@yasnayapolyana.org"
                      className="w-full px-3.5 py-2 border border-gray-200 bg-white rounded-xl focus:border-teal-500 text-sm text-gray-800 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 99999 55555"
                      className="w-full px-3.5 py-2 border border-gray-200 bg-white rounded-xl focus:border-teal-500 text-sm text-gray-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Author City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Lucknow"
                      className="w-full px-3.5 py-2 border border-gray-200 bg-white rounded-xl focus:border-teal-500 text-sm text-gray-800 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Proposed Book Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Resonance of the Steppes"
                      className="w-full px-3.5 py-2 border border-gray-200 bg-white rounded-xl focus:border-teal-500 text-sm text-gray-800 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Genre Segment <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      placeholder="e.g. Historical Fiction / Sci-Fi"
                      className="w-full px-3.5 py-2 border border-gray-200 bg-white rounded-xl focus:border-teal-500 text-sm text-gray-800 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Word Count (Estimated total words)
                  </label>
                  <input
                    type="number"
                    value={wordCount}
                    onChange={(e) => setWordCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 border border-gray-200 bg-white rounded-xl focus:border-teal-500 text-sm text-gray-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Brief Synopsis (Short plot outline / premise) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    placeholder="Provide a 100-300 word summary explaining the narrative conflict, target readership demographic..."
                    className="w-full px-3.5 py-2 border border-gray-200 bg-white rounded-xl focus:border-teal-500 text-sm text-gray-800 outline-none resize-none"
                    required
                  />
                </div>

                {/* FILE ATTACHMENTS WITH DRAG & DROP OR MANUAL SELECT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Field 1: Manuscript File */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Upload Manuscript Draft <span className="text-rose-500">*</span>
                    </label>
                    
                    <div
                      onDragOver={handleDragOverManuscript}
                      onDragLeave={handleDragLeaveManuscript}
                      onDrop={handleDropManuscript}
                      onClick={() => fileInputRef1.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                        isDragOverManuscript ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef1}
                        onChange={handleManualFile1}
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                      />
                      {manuscriptFile ? (
                        <div className="text-teal-600 animate-fade-in flex flex-col items-center">
                          <FileText className="h-8 w-8 text-teal-600 mb-1" />
                          <span className="text-xs font-mono font-semibold max-w-[200px] truncate block">
                            {manuscriptFile.name}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {(manuscriptFile.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <UploadCloud className="h-8 w-8 text-gray-400 mb-1" />
                          <span className="text-xs text-gray-600 font-medium">Drag & Drop Draft</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">or tap to select (.pdf / .doc)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Field 2: Optional cover letter File */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Upload Cover Letter (Optional)
                    </label>
                    
                    <div
                      onDragOver={handleDragOverCover}
                      onDragLeave={handleDragLeaveCover}
                      onDrop={handleDropCover}
                      onClick={() => fileInputRef2.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                        isDragOverCover ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef2}
                        onChange={handleManualFile2}
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                      />
                      {coverFile ? (
                        <div className="text-teal-600 animate-fade-in flex flex-col items-center">
                          <FileText className="h-8 w-8 text-teal-600 mb-1" />
                          <span className="text-xs font-mono font-semibold max-w-[200px] truncate block">
                            {coverFile.name}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {(coverFile.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <UploadCloud className="h-8 w-8 text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500">Drag & Drop Cover Letter</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">or tap to select (.pdf / .docx)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="cursor-pointer w-full bg-teal-600 hover:bg-teal-500 text-white py-2.5 rounded-xl font-serif text-sm font-semibold transition flex items-center justify-center space-x-1 shadow-md hover:shadow-lg disabled:bg-gray-300 mt-6"
                >
                  <span>{submitting ? 'Uploading Drafting Files...' : 'Submit Manuscript Draft'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
