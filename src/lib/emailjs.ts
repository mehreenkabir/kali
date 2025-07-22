// FILE: src/lib/emailjs.ts
import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

interface ContactFormData {
  name: string;
  email: string;
  interest: string;
  message: string;
}

export const sendContactEmail = async (formData: ContactFormData) => {
  try {
    // Template variables that will be passed to your EmailJS template
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      interest: formData.interest,
      message: formData.message,
      to_email: 'admin@kaliania.com', // Your email
      reply_to: formData.email
    };

    console.log('Sending email with params:', templateParams);

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
};

// Check if EmailJS is properly configured
export const isEmailJSConfigured = () => {
  return !!(
    EMAILJS_SERVICE_ID && 
    EMAILJS_TEMPLATE_ID && 
    EMAILJS_PUBLIC_KEY &&
    EMAILJS_SERVICE_ID !== 'your_service_id_here'
  );
};
