/**
 * Email Notification System
 * Handles welcome emails, reminders, and spiritual insights
 */

import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.resend.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Welcome email after subscription
export async function sendWelcomeEmail(userEmail: string, subscriptionTier: string): Promise<boolean> {
  try {
    const template = getWelcomeEmailTemplate(subscriptionTier);
    
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'portal@yoursite.com',
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    console.log(`✅ Welcome email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return false;
  }
}

// Daily mood check-in reminder
export async function sendMoodReminderEmail(userEmail: string, userName: string): Promise<boolean> {
  try {
    const template = getMoodReminderTemplate(userName);
    
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'portal@yoursite.com',
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    return true;
  } catch (error) {
    console.error('❌ Error sending mood reminder:', error);
    return false;
  }
}

// Weekly spiritual insights
export async function sendWeeklyInsightsEmail(
  userEmail: string, 
  userName: string, 
  insights: any
): Promise<boolean> {
  try {
    const template = getWeeklyInsightsTemplate(userName, insights);
    
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'portal@yoursite.com',
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    return true;
  } catch (error) {
    console.error('❌ Error sending weekly insights:', error);
    return false;
  }
}

// Crystal jewelry shipping notification
export async function sendShippingNotificationEmail(
  userEmail: string,
  userName: string,
  orderDetails: any
): Promise<boolean> {
  try {
    const template = getShippingNotificationTemplate(userName, orderDetails);
    
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'portal@yoursite.com',
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    return true;
  } catch (error) {
    console.error('❌ Error sending shipping notification:', error);
    return false;
  }
}

// Payment failure notification
export async function sendPaymentFailureEmail(
  userEmail: string,
  userName: string
): Promise<boolean> {
  try {
    const template = getPaymentFailureTemplate(userName);
    
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'portal@yoursite.com',
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    return true;
  } catch (error) {
    console.error('❌ Error sending payment failure notification:', error);
    return false;
  }
}

// Email Templates

function getWelcomeEmailTemplate(subscriptionTier: string): EmailTemplate {
  const tierName = subscriptionTier === 'sanctuary' ? 'The Sanctuary' : 'The Inner Sanctum';
  const features = subscriptionTier === 'sanctuary' 
    ? ['Personalized Meditation Portal', 'Akashic Records Access', 'Crystal Guidance', 'Tarot Forecasts']
    : ['Everything in Sanctuary', 'Ayurvedic Masterpath', 'Custom Crystal Jewelry', 'Youth Elixir Practices', 'Personal Aura Readings'];

  return {
    subject: `🌟 Welcome to ${tierName} - Your Spiritual Journey Begins!`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Georgia', serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
        <div style="background: white; border-radius: 20px; padding: 40px; text-align: center;">
          <h1 style="color: #4C1D95; margin-bottom: 20px; font-size: 28px;">✨ Welcome to ${tierName} ✨</h1>
          
          <p style="color: #6B7280; font-size: 18px; line-height: 1.6; margin-bottom: 30px;">
            Your spiritual transformation journey begins now. We're honored to guide you on this sacred path.
          </p>

          <div style="background: #F3F4F6; border-radius: 15px; padding: 30px; margin: 30px 0;">
            <h3 style="color: #4C1D95; margin-bottom: 20px;">Your Exclusive Features:</h3>
            <ul style="list-style: none; padding: 0; text-align: left;">
              ${features.map(feature => `<li style="color: #6B7280; margin: 10px 0;">🌟 ${feature}</li>`).join('')}
            </ul>
          </div>

          <a href="${process.env.NEXTAUTH_URL}/portal" 
             style="display: inline-block; background: linear-gradient(135deg, #8B5CF6, #EC4899); 
                    color: white; padding: 15px 30px; border-radius: 50px; text-decoration: none; 
                    font-weight: bold; margin: 20px 0;">
            Enter Your Portal
          </a>

          <p style="color: #9CA3AF; font-size: 14px; margin-top: 30px;">
            Complete your profile to unlock personalized guidance and recommendations.
          </p>
        </div>
      </div>
    `,
    text: `Welcome to ${tierName}! Your spiritual journey begins now. Access your portal at ${process.env.NEXTAUTH_URL}/portal`
  };
}

function getMoodReminderTemplate(userName: string): EmailTemplate {
  return {
    subject: '🌈 How is your soul feeling today?',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Georgia', serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
        <div style="background: white; border-radius: 20px; padding: 40px; text-align: center;">
          <h1 style="color: #4C1D95; margin-bottom: 20px;">🌈 Soul Check-In</h1>
          
          <p style="color: #6B7280; font-size: 18px; line-height: 1.6; margin-bottom: 30px;">
            Hello ${userName}, take a moment to connect with your inner self and track your spiritual weather.
          </p>

          <div style="background: linear-gradient(135deg, #FEF3C7, #FDE68A); border-radius: 15px; padding: 30px; margin: 30px 0;">
            <p style="color: #92400E; font-size: 16px; margin: 0;">
              "The soul becomes dyed with the color of its thoughts." - Marcus Aurelius
            </p>
          </div>

          <a href="${process.env.NEXTAUTH_URL}/portal/mood" 
             style="display: inline-block; background: linear-gradient(135deg, #8B5CF6, #EC4899); 
                    color: white; padding: 15px 30px; border-radius: 50px; text-decoration: none; 
                    font-weight: bold; margin: 20px 0;">
            Track My Mood
          </a>

          <p style="color: #9CA3AF; font-size: 14px; margin-top: 30px;">
            Building consistent self-awareness is key to spiritual growth.
          </p>
        </div>
      </div>
    `,
    text: `Hello ${userName}, time for your daily soul check-in. Track your mood at ${process.env.NEXTAUTH_URL}/portal/mood`
  };
}

function getWeeklyInsightsTemplate(userName: string, insights: any): EmailTemplate {
  return {
    subject: '💫 Your Weekly Spiritual Insights',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Georgia', serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
        <div style="background: white; border-radius: 20px; padding: 40px;">
          <h1 style="color: #4C1D95; margin-bottom: 20px; text-align: center;">💫 Your Spiritual Week</h1>
          
          <p style="color: #6B7280; font-size: 18px; line-height: 1.6; margin-bottom: 30px;">
            Hello ${userName}, here are your personalized insights from this week's spiritual journey.
          </p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0;">
            <div style="background: #EDE9FE; border-radius: 15px; padding: 20px; text-align: center;">
              <h3 style="color: #6D28D9; margin: 0 0 10px 0;">Mood Entries</h3>
              <p style="color: #8B5CF6; font-size: 24px; font-weight: bold; margin: 0;">${insights.moodEntries || 0}</p>
            </div>
            <div style="background: #ECFDF5; border-radius: 15px; padding: 20px; text-align: center;">
              <h3 style="color: #059669; margin: 0 0 10px 0;">Journal Entries</h3>
              <p style="color: #10B981; font-size: 24px; font-weight: bold; margin: 0;">${insights.journalEntries || 0}</p>
            </div>
          </div>

          ${insights.dominantMood ? `
            <div style="background: #FEF3C7; border-radius: 15px; padding: 20px; margin: 20px 0; text-align: center;">
              <h3 style="color: #92400E; margin: 0 0 10px 0;">Your Dominant Mood</h3>
              <p style="color: #D97706; font-size: 18px; margin: 0; text-transform: capitalize;">${insights.dominantMood}</p>
            </div>
          ` : ''}

          <a href="${process.env.NEXTAUTH_URL}/portal" 
             style="display: inline-block; background: linear-gradient(135deg, #8B5CF6, #EC4899); 
                    color: white; padding: 15px 30px; border-radius: 50px; text-decoration: none; 
                    font-weight: bold; margin: 20px auto; display: block; text-align: center; width: fit-content;">
            View Full Portal
          </a>
        </div>
      </div>
    `,
    text: `Hello ${userName}, your weekly spiritual insights are ready. View them at ${process.env.NEXTAUTH_URL}/portal`
  };
}

function getShippingNotificationTemplate(userName: string, orderDetails: any): EmailTemplate {
  return {
    subject: '📦 Your Crystal Jewelry is On Its Way!',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Georgia', serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
        <div style="background: white; border-radius: 20px; padding: 40px; text-align: center;">
          <h1 style="color: #4C1D95; margin-bottom: 20px;">💎 Your Sacred Jewelry Ships Soon</h1>
          
          <p style="color: #6B7280; font-size: 18px; line-height: 1.6; margin-bottom: 30px;">
            Hello ${userName}, your custom crystal jewelry piece has been lovingly crafted and is ready to ship!
          </p>

          <div style="background: #F3F4F6; border-radius: 15px; padding: 30px; margin: 30px 0; text-align: left;">
            <h3 style="color: #4C1D95; margin-bottom: 15px;">Order Details:</h3>
            <p style="color: #6B7280; margin: 5px 0;"><strong>Item:</strong> ${orderDetails.itemName}</p>
            <p style="color: #6B7280; margin: 5px 0;"><strong>Crystal:</strong> ${orderDetails.crystal}</p>
            <p style="color: #6B7280; margin: 5px 0;"><strong>Metal:</strong> ${orderDetails.metal}</p>
            ${orderDetails.trackingNumber ? `<p style="color: #6B7280; margin: 5px 0;"><strong>Tracking:</strong> ${orderDetails.trackingNumber}</p>` : ''}
          </div>

          <div style="background: linear-gradient(135deg, #ECFDF5, #D1FAE5); border-radius: 15px; padding: 20px; margin: 20px 0;">
            <p style="color: #065F46; font-size: 16px; margin: 0;">
              "Every crystal carries the wisdom of the Earth and the magic of your intentions."
            </p>
          </div>

          <a href="${process.env.NEXTAUTH_URL}/portal/jewelry" 
             style="display: inline-block; background: linear-gradient(135deg, #8B5CF6, #EC4899); 
                    color: white; padding: 15px 30px; border-radius: 50px; text-decoration: none; 
                    font-weight: bold; margin: 20px 0;">
            Track Your Order
          </a>
        </div>
      </div>
    `,
    text: `Hello ${userName}, your crystal jewelry order is shipping! Track it at ${process.env.NEXTAUTH_URL}/portal/jewelry`
  };
}

function getPaymentFailureTemplate(userName: string): EmailTemplate {
  return {
    subject: '💳 Let\'s Keep Your Spiritual Journey Going',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Georgia', serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
        <div style="background: white; border-radius: 20px; padding: 40px; text-align: center;">
          <h1 style="color: #DC2626; margin-bottom: 20px;">💳 Payment Update Needed</h1>
          
          <p style="color: #6B7280; font-size: 18px; line-height: 1.6; margin-bottom: 30px;">
            Hello ${userName}, we encountered an issue processing your payment. Let's get this resolved quickly so your spiritual journey can continue uninterrupted.
          </p>

          <div style="background: #FEF2F2; border-radius: 15px; padding: 30px; margin: 30px 0;">
            <h3 style="color: #DC2626; margin-bottom: 15px;">What happened?</h3>
            <p style="color: #7F1D1D; margin: 0;">
              Your payment method may have expired or reached its limit. Don't worry - this happens sometimes and is easy to fix.
            </p>
          </div>

          <a href="${process.env.NEXTAUTH_URL}/portal/profile?section=billing" 
             style="display: inline-block; background: linear-gradient(135deg, #8B5CF6, #EC4899); 
                    color: white; padding: 15px 30px; border-radius: 50px; text-decoration: none; 
                    font-weight: bold; margin: 20px 0;">
            Update Payment Method
          </a>

          <p style="color: #9CA3AF; font-size: 14px; margin-top: 30px;">
            Questions? Reply to this email and our team will help you right away.
          </p>
        </div>
      </div>
    `,
    text: `Hello ${userName}, please update your payment method to continue your subscription. Visit ${process.env.NEXTAUTH_URL}/portal/profile`
  };
}
