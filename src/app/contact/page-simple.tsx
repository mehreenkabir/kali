// FILE: src/app/contact/page.tsx

'use client';

import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: 'yoga', // yoga, art, math
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const interestOptions = [
    { value: 'yoga', label: 'The Kalianïa Method (Yoga Sanctuary)', description: 'I want to join the yoga sanctuary and learn the Kalianïa Method' },
    { value: 'art', label: 'Art Collaboration', description: 'I want to collaborate on a creative project' },
    { value: 'math', label: 'Math Tutoring Package', description: 'I want to acquire math tutoring services' },
    { value: 'general', label: 'General Inquiry', description: 'I have a general question or inquiry' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Simple form validation
    if (!formData.name || !formData.email || !formData.message) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/contact/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: 'Thank you! Your message has been sent. I\'ll get back to you within 24 hours.' 
        });
        setFormData({ name: '', email: '', interest: 'yoga', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setMessage({ 
        type: 'error', 
        text: 'There was an issue sending your message. Please try again or email directly at hello@kaliania.com' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedInterest = interestOptions.find(option => option.value === formData.interest);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      {/* Animated gradient background */}
      <div className="absolute inset-0 pastel-dream-gradient z-0"></div>
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      <Header />

      <main className="relative z-20 min-h-screen flex items-center justify-center text-center p-4 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="w-full max-w-2xl bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-2xl border border-white/20"
        >
          <h1 className="font-dreamy text-4xl md:text-5xl text-white mb-4 text-glow">
            Let's Begin Your Journey
          </h1>
          <p className="font-sans text-white/80 mb-8 leading-relaxed">
            Whether you're drawn to the yoga sanctuary, seeking creative collaboration, or ready to master mathematics, I'm here to guide your path.
          </p>

          {/* Success/Error Message */}
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg mb-6 ${
                message.type === 'success' 
                  ? 'bg-green-500/20 border border-green-400/30 text-green-100' 
                  : 'bg-red-500/20 border border-red-400/30 text-red-100'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="font-sans text-sm font-medium text-white/90 block mb-2">
                Your Name *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 font-sans text-white bg-white/10 border border-white/30 rounded-lg focus:border-white focus:ring-2 focus:ring-white/30 focus:outline-none transition-all duration-300 placeholder:text-white/50"
                placeholder="Enter your name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="font-sans text-sm font-medium text-white/90 block mb-2">
                Your Email *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 font-sans text-white bg-white/10 border border-white/30 rounded-lg focus:border-white focus:ring-2 focus:ring-white/30 focus:outline-none transition-all duration-300 placeholder:text-white/50"
                placeholder="Enter your email"
              />
            </div>

            {/* Interest Selection */}
            <div>
              <label htmlFor="interest" className="font-sans text-sm font-medium text-white/90 block mb-2">
                I'm Interested In...
              </label>
              <select
                id="interest"
                value={formData.interest}
                onChange={(e) => setFormData({...formData, interest: e.target.value})}
                disabled={isSubmitting}
                className="w-full px-4 py-3 font-sans text-white bg-white/10 border border-white/30 rounded-lg focus:border-white focus:ring-2 focus:ring-white/30 focus:outline-none transition-all duration-300"
              >
                {interestOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                    {option.label}
                  </option>
                ))}
              </select>
              {selectedInterest && (
                <p className="text-white/70 text-sm mt-2 italic">
                  {selectedInterest.description}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="font-sans text-sm font-medium text-white/90 block mb-2">
                Your Message *
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
                disabled={isSubmitting}
                rows={5}
                className="w-full px-4 py-3 font-sans text-white bg-white/10 border border-white/30 rounded-lg focus:border-white focus:ring-2 focus:ring-white/30 focus:outline-none transition-all duration-300 placeholder:text-white/50 resize-none"
                placeholder="Tell me about what you're looking for, your goals, or any questions you have..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white/80 backdrop-blur-md text-slate-800 font-serif tracking-widest uppercase px-8 py-4 rounded-full transition-all duration-300 hover:bg-white hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="font-sans text-white/70 text-sm">
              You can also reach me directly at:{' '}
              <a 
                href="mailto:hello@kaliania.com" 
                className="text-white hover:text-amber-300 transition-colors duration-300 underline"
              >
                hello@kaliania.com
              </a>
            </p>
          </div>
        </motion.div>
      </main>

      <GlobalFooter />
    </div>
  );
}
