// FILE: src/app/contact/page.tsx
'use client';

import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import { sendContactEmail, isEmailJSConfigured } from '@/lib/emailjs';
import React, { useState } from 'react';
import { ContactFormData } from '@/types/common';
import { CONTACT_INTERESTS } from '@/utils/constants';
import { findInterestByValue, createEmailMessage, saveEmailToLocalStorage } from '@/utils/helpers';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    interest: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = event.target;
    setFormData(previousFormData => ({
      ...previousFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const emailMessage = createEmailMessage(formData);
      saveEmailToLocalStorage(emailMessage);

      if (!isEmailJSConfigured()) {
        console.warn('EmailJS not configured - check environment variables');
        
        const response = await fetch('/api/contact/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }
      } else {
        const result = await sendContactEmail(formData);
        
        if (!result.success) {
          throw new Error('Failed to send email via EmailJS');
        }
      }
      
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

        <main className="relative z-20 min-h-screen flex items-center justify-center p-3 xs:p-4 sm:p-6 pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-20 xs:pb-22 sm:pb-24">
          <div 
            className="w-full max-w-xs xs:max-w-sm sm:max-w-md bg-white/10 backdrop-blur-xl p-4 xs:p-6 sm:p-8 md:p-12 rounded-2xl shadow-2xl border border-white/20 text-center"
          >
            <div className="mb-4 xs:mb-5 sm:mb-6">
              <div className="w-12 xs:w-14 sm:w-16 h-12 xs:h-14 sm:h-16 mx-auto mb-3 xs:mb-4 bg-green-400/20 rounded-full flex items-center justify-center">
                <svg className="w-6 xs:w-7 sm:w-8 h-6 xs:h-7 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h1 className="font-dreamy text-2xl xs:text-3xl sm:text-4xl text-white mb-3 xs:mb-4 text-glow">
              Message Received! 
            </h1>
            <p className="font-sans text-white/70 mb-6 xs:mb-7 sm:mb-8 leading-relaxed text-sm xs:text-base">
              Thank you for reaching out, {formData.name}. Your inquiry about <strong>{findInterestByValue(formData.interest)?.label}</strong> has been received. 
              <br /><br />
              I'll respond within 24 hours with personalized guidance for your journey.
            </p>
            
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ name: '', email: '', interest: '', message: '' });
              }}
              className="bg-white/20 hover:bg-white/30 text-white font-serif tracking-widest uppercase px-4 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm rounded-full transition-all duration-300 focus-ring"
            >
              Send Another Message
            </button>
          </div>
        </main>

        <div className="relative z-30">
          <GlobalFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-black">
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

      <main className="relative z-20 flex-grow flex items-center justify-center p-3 xs:p-4 sm:p-6 pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-20 xs:pb-24 sm:pb-28 md:pb-32">
        <div 
          className="w-full max-w-sm xs:max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white/10 backdrop-blur-xl p-4 xs:p-5 sm:p-6 md:p-8 lg:p-12 rounded-2xl shadow-2xl border border-white/20"
        >
          <div className="text-center mb-6 xs:mb-7 sm:mb-8">
            <h1 className="font-dreamy text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-white mb-3 xs:mb-4 text-glow">
              Let's Begin Your Journey
            </h1>
            <p className="font-sans text-white/70 text-sm xs:text-base sm:text-lg leading-relaxed px-2">
              Whether you're drawn to the ethereal sanctuary, creative collaboration, or mathematical exploration, 
              I'm here to guide you on your path.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-5 sm:space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="font-sans text-xs xs:text-sm font-medium text-white/80 block mb-1.5 xs:mb-2 uppercase tracking-wider">
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
                className="w-full px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 font-sans text-sm xs:text-base text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:border-white/50 focus:ring-0 focus:outline-none transition-all duration-300 placeholder:text-white/40 disabled:opacity-50"
                placeholder="Enter your name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="font-sans text-xs xs:text-sm font-medium text-white/80 block mb-1.5 xs:mb-2 uppercase tracking-wider">
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
                className="w-full px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 font-sans text-sm xs:text-base text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:border-white/50 focus:ring-0 focus:outline-none transition-all duration-300 placeholder:text-white/40 disabled:opacity-50"
                placeholder="Enter your email"
              />
            </div>

            {/* Interest Selection */}
            <div>
              <label htmlFor="interest" className="font-sans text-xs xs:text-sm font-medium text-white/80 block mb-1.5 xs:mb-2 uppercase tracking-wider">
                What Calls to You?
              </label>
              <select
                id="interest"
                name="interest"
                value={formData.interest}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="w-full px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 font-sans text-sm xs:text-base text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:border-white/50 focus:ring-0 focus:outline-none transition-all duration-300 disabled:opacity-50"
              >
                <option value="">Select your interest...</option>
                {CONTACT_INTERESTS.map((interest) => (
                  <option key={interest.value} value={interest.value} className="bg-slate-800 text-white">
                    {interest.label}
                  </option>
                ))}
              </select>
              {formData.interest && (
                <p className="mt-1.5 xs:mt-2 font-sans text-xs xs:text-sm text-white/60 italic">
                  {findInterestByValue(formData.interest)?.description}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="font-sans text-xs xs:text-sm font-medium text-white/80 block mb-1.5 xs:mb-2 uppercase tracking-wider">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                disabled={isLoading}
                className="w-full px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 font-sans text-sm xs:text-base text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:border-white/50 focus:ring-0 focus:outline-none transition-all duration-300 placeholder:text-white/40 resize-none disabled:opacity-50"
                placeholder="Tell me about your intentions, questions, or what draws you to this path..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 xs:pt-3 sm:pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-serif tracking-widest uppercase px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-xs xs:text-sm sm:text-base rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 xs:mr-3 h-4 xs:h-5 w-4 xs:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
        </div>
      </main>

      {/* Footer with proper spacing - fixed positioning */}
      <div className="relative z-30">
        <GlobalFooter theme="dark" />
      </div>
    </div>
  );
};

export default ContactPage;
