'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import Link from 'next/link';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  "What am I grateful for today?",
  "What patterns am I noticing in my spiritual journey?",
  "What is my soul trying to tell me?",
  "How did I grow today?",
  "What synchronicities appeared in my path?",
  "What shadows am I ready to embrace?",
  "What light am I ready to shine?"
];

export default function SacredJournalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchEntries();
  }, [session, status, router]);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/user/journal-entries');
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/user/journal-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          tags
        })
      });

      if (response.ok) {
        setShowSuccess(true);
        setTitle('');
        setContent('');
        setTags([]);
        setIsWriting(false);
        await fetchEntries();

        // Track in portal API
        await fetch('/api/portal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'saveJournal',
            data: { title, content, tags }
          })
        });

        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const selectPrompt = (prompt: string) => {
    setTitle(prompt);
    setContent('');
    setIsWriting(true);
  };

  const filteredEntries = entries.filter(entry => 
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="fixed inset-0 z-0 pastel-dream-gradient"></div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="font-dreamy text-xl text-white">Opening your sacred journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 z-0 pastel-dream-gradient"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header theme="light" />

        <main className="flex-grow pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-20">
          <div className="max-w-6xl mx-auto px-4 xs:px-6 sm:px-8">
            
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl text-slate-800 mb-4">
                Sacred Journal
              </h1>
              <p className="font-dreamy text-lg xs:text-xl text-slate-600 mb-6">
                A private sanctuary for your spiritual insights and reflections
              </p>
              
              {/* Navigation */}
              <div className="flex items-center justify-center space-x-2 text-sm text-slate-600 mb-6">
                <Link href="/portal" className="hover:text-slate-800 transition-colors font-dreamy">
                  Portal
                </Link>
                <span>→</span>
                <span className="font-medium text-slate-800">Sacred Journal</span>
              </div>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-2xl text-green-800 text-center animate-fadeIn">
                <span className="text-2xl mr-2">📖</span>
                Entry saved to your sacred archives!
              </div>
            )}

            {/* Main Content */}
            {!isWriting && !selectedEntry ? (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: New Entry Options */}
                <div className="lg:col-span-1">
                  <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 border border-white/40">
                    <h2 className="font-serif text-xl text-slate-800 mb-4">Begin Writing</h2>
                    
                    <button
                      onClick={() => setIsWriting(true)}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white font-serif 
                               py-3 rounded-full transition-colors mb-4"
                    >
                      + New Entry
                    </button>

                    <div className="space-y-3">
                      <h3 className="font-dreamy text-sm text-slate-600">Or start with a prompt:</h3>
                      {SUGGESTED_PROMPTS.map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => selectPrompt(prompt)}
                          className="w-full text-left p-3 bg-white/40 rounded-xl hover:bg-white/60 
                                   transition-colors font-dreamy text-sm text-slate-700"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Entry List */}
                <div className="lg:col-span-2">
                  <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 border border-white/40">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="font-serif text-xl text-slate-800">Your Entries</h2>
                      <span className="font-dreamy text-slate-600">{entries.length} reflections</span>
                    </div>

                    {/* Search */}
                    <input
                      type="text"
                      placeholder="Search entries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 mb-4 bg-white/40 border border-white/60 rounded-xl 
                               text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 
                               focus:ring-purple-400 focus:border-transparent"
                    />

                    {/* Entries */}
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {filteredEntries.length === 0 ? (
                        <p className="text-center font-dreamy text-slate-600 py-8">
                          {searchTerm ? 'No entries found' : 'Your journal awaits your first reflection...'}
                        </p>
                      ) : (
                        filteredEntries.map((entry) => (
                          <button
                            key={entry.id}
                            onClick={() => setSelectedEntry(entry)}
                            className="w-full text-left p-4 bg-white/40 rounded-2xl hover:bg-white/60 
                                     transition-colors group"
                          >
                            <h3 className="font-serif text-slate-800 mb-1 group-hover:text-purple-700">
                              {entry.title}
                            </h3>
                            <p className="font-dreamy text-sm text-slate-600 line-clamp-2 mb-2">
                              {entry.content}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                {entry.tags.slice(0, 3).map((tag, index) => (
                                  <span key={index} className="text-xs bg-purple-100 text-purple-700 
                                                             px-2 py-1 rounded-full">
                                    {tag}
                                  </span>
                                ))}
                                {entry.tags.length > 3 && (
                                  <span className="text-xs text-slate-500">+{entry.tags.length - 3}</span>
                                )}
                              </div>
                              <span className="text-xs text-slate-500">
                                {new Date(entry.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : isWriting ? (
              /* Writing View */
              <div className="max-w-3xl mx-auto">
                <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Entry title..."
                        className="w-full px-4 py-3 bg-white/40 border border-white/60 rounded-xl 
                                 text-xl font-serif text-slate-800 placeholder-slate-500 
                                 focus:outline-none focus:ring-2 focus:ring-purple-400 
                                 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Begin your reflection..."
                        rows={15}
                        className="w-full px-4 py-3 bg-white/40 border border-white/60 rounded-xl 
                                 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 
                                 focus:ring-purple-400 focus:border-transparent resize-none"
                        required
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="font-dreamy text-sm text-slate-600 block mb-2">
                        Tags (optional)
                      </label>
                      <div className="flex gap-2 mb-2 flex-wrap">
                        {tags.map((tag, index) => (
                          <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 
                                                     rounded-full text-sm flex items-center gap-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="text-purple-500 hover:text-purple-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          placeholder="Add a tag..."
                          className="flex-grow px-3 py-2 bg-white/40 border border-white/60 rounded-lg 
                                   text-sm text-slate-800 placeholder-slate-500 focus:outline-none 
                                   focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          className="px-4 py-2 bg-purple-200 text-purple-700 rounded-lg 
                                   hover:bg-purple-300 transition-colors text-sm"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsWriting(false);
                          setTitle('');
                          setContent('');
                          setTags([]);
                        }}
                        className="flex-1 bg-white/40 hover:bg-white/60 text-slate-800 font-serif 
                                 py-3 rounded-full transition-colors border border-white/60"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-serif 
                                 py-3 rounded-full transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? 'Saving...' : 'Save Entry'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : selectedEntry ? (
              /* Reading View */
              <div className="max-w-3xl mx-auto">
                <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40">
                  <div className="mb-6">
                    <h2 className="font-serif text-3xl text-slate-800 mb-3">{selectedEntry.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>{new Date(selectedEntry.timestamp).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{new Date(selectedEntry.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="prose prose-slate max-w-none mb-6">
                    <p className="font-dreamy text-lg text-slate-700 whitespace-pre-wrap">
                      {selectedEntry.content}
                    </p>
                  </div>

                  {selectedEntry.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-6">
                      {selectedEntry.tags.map((tag, index) => (
                        <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 
                                                   rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="bg-white/40 hover:bg-white/60 text-slate-800 px-6 py-3 
                             rounded-full font-serif tracking-wide transition-colors 
                             border border-white/60"
                  >
                    ← Back to Entries
                  </button>
                </div>
              </div>
            ) : null}

            {/* Back to Portal */}
            {!isWriting && !selectedEntry && (
              <div className="mt-8 text-center">
                <Link
                  href="/portal"
                  className="inline-block bg-white/40 hover:bg-white/60 text-slate-800 px-6 py-3 
                           rounded-xl font-serif tracking-wide transition-colors border border-white/60"
                >
                  ← Back to Portal
                </Link>
              </div>
            )}
          </div>
        </main>

        <GlobalFooter theme="light" />
      </div>
    </div>
  );
}