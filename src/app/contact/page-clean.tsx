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
    interest: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const interests = [
    { value: 'yoga-sanctuary', label: '🧘‍♀️ The Sanctuary ($888/month)', description: 'Personalized meditation, crystal collection, and spiritual guidance' },
    { value: 'yoga-inner-sanctum', label: '✨ The Inner Sanctum ($9999/year)', description: 'Ayurvedic mastery, crystal jewelry, and aura readings' },
    { value: 'art-collaboration', label: '🎨 Art Collaboration', description: 'Creative projects and artistic partnerships' },
    { value: 'math-basic', label: '🎮 Basic Math Pack', description: 'Foundational mathematical concepts and tools' },
    { value: 'math-premium', label: '🚀 Premium Math Pack', description: 'Advanced mathematical exploration and problem-solving' },
    { value: 'other', label: '💫 Other Inquiry', description: 'General questions or custom requests' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission (replace with your actual email service)
    try {
      // Here you would integrate with your email service (EmailJS, Resend, etc.)
      console.log('Form submitted:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src="/beach-background.mp4"
        />
        <div className="absolute inset-0 pastel-dream-gradient mix-blend-overlay opacity-60 z-10"></div>
        <div className="absolute inset-0 bg-black/30 z-10"></div>

        <Header />

        <main className="relative z-20 min-h-screen flex items-center justify-center p-4 pb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-2xl border border-white/20 text-center"
          >
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-400/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h1 className="font-dreamy text-4xl text-white mb-4 text-glow">
              Message Received! 
            </h1>
            <p className="font-sans text-white/70 mb-8 leading-relaxed">
              Thank you for reaching out, {formData.name}. Your inquiry about <strong>{interests.find(i => i.value === formData.interest)?.label}</strong> has been received. 
              <br /><br />
              I'll respond within 24 hours with personalized guidance for your journey.
            </p>
            
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ name: '', email: '', interest: '', message: '' });
              }}
              className="bg-white/20 hover:bg-white/30 text-white font-serif tracking-widest uppercase px-8 py-3 rounded-full transition-all duration-300 focus-ring"
            >
              Send Another Message
            </button>
          </motion.div>
        </main>

        <div className="relative z-30">
          <GlobalFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/beach-background.mp4"
      />
      <div className="absolute inset-0 pastel-dream-gradient mix-blend-overlay opacity-60 z-10"></div>
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      <Header />

      <main className="relative z-20 min-h-screen flex items-center justify-center p-4 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-2xl bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-2xl border border-white/20"
        >
          <div className="text-center mb-8">
            <h1 className="font-dreamy text-4xl md:text-5xl text-white mb-4 text-glow">
              Let's Begin Your Journey
            </h1>
            <p className="font-sans text-white/70 text-lg leading-relaxed">
              Whether you're drawn to the ethereal sanctuary, creative collaboration, or mathematical exploration, 
              I'm here to guide you on your path.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="font-sans text-sm font-medium text-white/80 block mb-2 uppercase tracking-wider">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="w-full px-6 py-4 font-sans text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:border-white/50 focus:ring-0 focus:outline-none transition-all duration-300 placeholder:text-white/40 disabled:opacity-50"
                placeholder="Enter your name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="font-sans text-sm font-medium text-white/80 block mb-2 uppercase tracking-wider">
                Your Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="w-full px-6 py-4 font-sans text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:border-white/50 focus:ring-0 focus:outline-none transition-all duration-300 placeholder:text-white/40 disabled:opacity-50"
                placeholder="Enter your email"
              />
            </div>

            {/* Interest Selection */}
            <div>
              <label htmlFor="interest" className="font-sans text-sm font-medium text-white/80 block mb-2 uppercase tracking-wider">
                What Calls to You?
              </label>
              <select
                id="interest"
                name="interest"
                value={formData.interest}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="w-full px-6 py-4 font-sans text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:border-white/50 focus:ring-0 focus:outline-none transition-all duration-300 disabled:opacity-50"
              >
                <option value="">Select your interest...</option>
                {interests.map((interest) => (
                  <option key={interest.value} value={interest.value} className="bg-slate-800 text-white">
                    {interest.label}
                  </option>
                ))}
              </select>
              {formData.interest && (
                <p className="mt-2 font-sans text-sm text-white/60 italic">
                  {interests.find(i => i.value === formData.interest)?.description}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="font-sans text-sm font-medium text-white/80 block mb-2 uppercase tracking-wider">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                disabled={isLoading}
                className="w-full px-6 py-4 font-sans text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:border-white/50 focus:ring-0 focus:outline-none transition-all duration-300 placeholder:text-white/40 resize-none disabled:opacity-50"
                placeholder="Tell me about your intentions, questions, or what draws you to this path..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-serif tracking-widest uppercase px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Begin the Conversation'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </main>

      {/* Footer with proper spacing - fixed positioning */}
      <div className="relative z-30">
        <GlobalFooter />
      </div>
    </div>
  );
}
