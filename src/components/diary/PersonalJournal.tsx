// FILE: src/components/diary/PersonalJournal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  mood?: string;
  tags?: string[];
}

interface PersonalJournalProps {
  className?: string;
}

const PersonalJournal: React.FC<PersonalJournalProps> = ({ className = '' }) => {
  const { data: session } = useSession();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({
    title: '',
    content: '',
    tags: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      loadJournalEntries();
    }
  }, [session]);

  const loadJournalEntries = async () => {
    try {
      const response = await fetch('/api/user/journal-entries');
      if (response.ok) {
        const data = await response.json();
        setEntries(data || []);
      }
    } catch (error) {
      console.error('Failed to load journal entries:', error);
    }
  };

  const saveJournalEntry = async () => {
    if (!currentEntry.title.trim() || !currentEntry.content.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/journal-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentEntry.title.trim(),
          content: currentEntry.content.trim(),
          tags: currentEntry.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        const newEntry = await response.json();
        setEntries(prev => [newEntry, ...prev]);
        
        // Reset form
        setCurrentEntry({ title: '', content: '', tags: '' });
        setIsWriting(false);
      }
    } catch (error) {
      console.error('Failed to save journal entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getPreview = (content: string) => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  return (
    <div className={`bg-white/30 backdrop-blur-md rounded-3xl p-6 border border-white/40 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif text-xl text-slate-800">Sacred Journal</h3>
          <p className="font-dreamy text-sm text-slate-600">Your private spiritual sanctuary</p>
        </div>
        {!isWriting && (
          <button
            onClick={() => setIsWriting(true)}
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl font-serif text-sm tracking-wide transition-colors"
          >
            + New Entry
          </button>
        )}
      </div>

      {/* Writing Interface */}
      {isWriting && (
        <div className="mb-6 p-4 bg-white/40 rounded-2xl border border-white/60">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Entry title..."
              value={currentEntry.title}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-0 py-2 bg-transparent border-0 border-b border-slate-300 text-slate-800 placeholder-slate-500 focus:outline-none focus:border-slate-600 font-serif text-lg"
              maxLength={100}
            />
            
            <textarea
              placeholder="Pour your heart onto these pages..."
              value={currentEntry.content}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-3 py-3 bg-white/20 border border-white/40 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none font-dreamy"
              rows={8}
              maxLength={2000}
            />

            <input
              type="text"
              placeholder="Tags (comma separated): gratitude, meditation, growth..."
              value={currentEntry.tags}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-3 py-2 bg-white/20 border border-white/40 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
              maxLength={200}
            />

            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-500">
                {currentEntry.content.length}/2000 characters
              </div>
              <div className="space-x-3">
                <button
                  onClick={() => {
                    setIsWriting(false);
                    setCurrentEntry({ title: '', content: '', tags: '' });
                  }}
                  className="px-4 py-2 bg-white/40 hover:bg-white/60 text-slate-700 rounded-lg font-serif text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveJournalEntry}
                  disabled={isLoading || !currentEntry.title.trim() || !currentEntry.content.trim()}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-serif text-sm tracking-wide transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Journal Entries List */}
      {selectedEntry ? (
        /* Full Entry View */
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-serif text-lg text-slate-800">{selectedEntry.title}</h4>
              <p className="font-dreamy text-sm text-slate-600">{formatDate(selectedEntry.timestamp)}</p>
            </div>
            <button
              onClick={() => setSelectedEntry(null)}
              className="text-slate-600 hover:text-slate-800 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="bg-white/20 rounded-xl p-4">
            <div className="font-dreamy text-slate-700 leading-relaxed whitespace-pre-wrap">
              {selectedEntry.content}
            </div>
          </div>

          {selectedEntry.tags && selectedEntry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedEntry.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Entries List */
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📖</div>
              <p className="font-dreamy text-slate-600">
                Your journal awaits your first entry
              </p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="p-4 bg-white/20 hover:bg-white/40 rounded-xl cursor-pointer transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-serif text-slate-800 group-hover:text-slate-900 transition-colors">
                    {entry.title}
                  </h4>
                  <span className="font-dreamy text-xs text-slate-500">
                    {new Date(entry.timestamp).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                
                <p className="font-dreamy text-sm text-slate-600 leading-relaxed">
                  {getPreview(entry.content)}
                </p>

                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                    {entry.tags.length > 3 && (
                      <span className="text-xs text-slate-500">
                        +{entry.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalJournal;
