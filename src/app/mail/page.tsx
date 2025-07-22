// FILE: src/app/mail/page.tsx
'use client';

import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import React, { useState, useEffect } from 'react';

interface EmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  message: string;
  interest: string;
  timestamp: string;
  read: boolean;
}

export default function MailPage() {
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch emails from contact form submissions
  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      // This would normally fetch from your backend
      // For now, we'll check localStorage for any saved form submissions
      const savedSubmissions = localStorage.getItem('contactSubmissions');
      if (savedSubmissions) {
        const submissions = JSON.parse(savedSubmissions);
        setEmails(submissions);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching emails:', error);
      setIsLoading(false);
    }
  };

  const markAsRead = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, read: true } : email
    ));
  };

  const unreadCount = emails.filter(email => !email.read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading mailbox...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header theme="light" />
      
      <main className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="font-serif text-4xl text-slate-800 mb-2">Mail Center</h1>
            <p className="text-slate-600">admin@kaliania.com</p>
            <div className="mt-4 text-sm text-slate-500">
              {unreadCount > 0 ? (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                  {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-green-600">All messages read</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Email List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg border border-slate-200">
                <div className="p-4 border-b border-slate-200">
                  <h2 className="font-semibold text-slate-800">Inbox ({emails.length})</h2>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {emails.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                      <div className="text-4xl mb-4">📭</div>
                      <p>No messages yet</p>
                      <p className="text-sm mt-2">Contact form submissions will appear here</p>
                    </div>
                  ) : (
                    emails.map((email) => (
                      <div
                        key={email.id}
                        onClick={() => {
                          setSelectedEmail(email);
                          markAsRead(email.id);
                        }}
                        className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                          !email.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        } ${selectedEmail?.id === email.id ? 'bg-blue-100' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`font-medium text-sm ${!email.read ? 'text-slate-900' : 'text-slate-700'}`}>
                            {email.from}
                          </span>
                          <span className="text-xs text-slate-500">
                            {new Date(email.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <div className={`text-sm mb-1 ${!email.read ? 'font-medium text-slate-800' : 'text-slate-600'}`}>
                          {email.subject}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {email.message.substring(0, 60)}...
                        </div>
                        {email.interest && (
                          <div className="mt-2">
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                              {email.interest}
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Email Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg border border-slate-200 min-h-96">
                {selectedEmail ? (
                  <div>
                    {/* Email Header */}
                    <div className="p-6 border-b border-slate-200">
                      <h3 className="text-xl font-semibold text-slate-800 mb-2">
                        {selectedEmail.subject}
                      </h3>
                      <div className="text-sm text-slate-600 space-y-1">
                        <div><strong>From:</strong> {selectedEmail.from}</div>
                        <div><strong>To:</strong> {selectedEmail.to}</div>
                        <div><strong>Date:</strong> {new Date(selectedEmail.timestamp).toLocaleString()}</div>
                        {selectedEmail.interest && (
                          <div><strong>Interest:</strong> {selectedEmail.interest}</div>
                        )}
                      </div>
                    </div>
                    
                    {/* Email Body */}
                    <div className="p-6">
                      <div className="prose max-w-none">
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {selectedEmail.message}
                        </p>
                      </div>
                      
                      {/* Reply Button */}
                      <div className="mt-6 pt-4 border-t border-slate-200">
                        <a
                          href={`mailto:${selectedEmail.from}?subject=Re: ${selectedEmail.subject}`}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Reply
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-96 text-slate-500">
                    <div className="text-center">
                      <div className="text-4xl mb-4">✉️</div>
                      <p>Select an email to read</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Setup Notice */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="font-semibold text-amber-800 mb-2">📧 Email Setup Notice</h3>
            <p className="text-amber-700 text-sm">
              This is a basic email viewer. To receive actual emails at admin@kaliania.com, 
              you need to set up email hosting (like Zoho Mail) and configure MX records in your DNS.
            </p>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}
