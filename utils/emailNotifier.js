const nodemailer = require('nodemailer');

// Notification email recipient
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'krishnaheritagecollection2026@gmail.com';

// Create transporter - uses Gmail SMTP
// Requires a Gmail App Password (not regular password) set in .env
let transporter;

function getTransporter() {
  if (!transporter) {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      console.warn('⚠️  Email notifications disabled: SMTP_USER and SMTP_PASS not set in .env');
      return null;
    }

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
  }
  return transporter;
}

// ─── Branded HTML wrapper ───────────────────────────────────────────
function wrapHtml(title, bodyHtml) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { margin: 0; padding: 0; background: #f9f6f0; font-family: 'Segoe UI', Arial, sans-serif; }
      .container { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
      .header { background: #2c2117; padding: 28px 32px; text-align: center; }
      .header h1 { color: #d4b978; font-size: 22px; letter-spacing: 6px; margin: 0 0 4px 0; font-weight: 600; }
      .header p { color: #b8935a; font-size: 11px; letter-spacing: 5px; margin: 0; }
      .divider { text-align: center; padding: 8px 0 0 0; }
      .divider span { display: inline-block; width: 36px; height: 1px; background: #b8935a; vertical-align: middle; }
      .divider em { color: #b8935a; font-size: 14px; margin: 0 8px; vertical-align: middle; }
      .body { padding: 32px; color: #333; line-height: 1.7; font-size: 14px; }
      .body h2 { color: #2c2117; font-size: 18px; margin: 0 0 16px 0; }
      .info-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
      .info-table td { padding: 10px 14px; border-bottom: 1px solid #f0ebe0; }
      .info-table td:first-child { color: #888; font-size: 13px; width: 140px; }
      .info-table td:last-child { color: #2c2117; font-weight: 500; }
      .footer { background: #fdfbf7; padding: 20px 32px; text-align: center; border-top: 1px solid #f0ebe0; }
      .footer p { color: #999; font-size: 12px; margin: 0; }
      .btn { display: inline-block; background: #b8935a; color: #fff; text-decoration: none; padding: 10px 28px; border-radius: 6px; font-size: 14px; font-weight: 600; letter-spacing: 1px; margin-top: 16px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>KRISHNA</h1>
        <p>H E R I T A G E</p>
        <div class="divider"><span></span><em>✦</em><span></span></div>
      </div>
      <div class="body">
        <h2>${title}</h2>
        ${bodyHtml}
      </div>
      <div class="footer">
        <p>Krishna Heritage Collection &bull; Premium Indian Sarees</p>
      </div>
    </div>
  </body>
  </html>`;
}

// ─── Send helper ────────────────────────────────────────────────────
async function sendNotification(subject, title, bodyHtml) {
  const t = getTransporter();
  if (!t) return;

  try {
    await t.sendMail({
      from: `"Krishna Heritage" <${process.env.SMTP_USER}>`,
      to: NOTIFICATION_EMAIL,
      subject,
      html: wrapHtml(title, bodyHtml)
    });
    console.log(`📧  Notification sent: ${subject}`);
  } catch (err) {
    console.error('❌  Email notification failed:', err.message);
  }
}

// ─── Pre-built notification types ───────────────────────────────────

// 1. New User Sign-Up
async function notifyNewSignup(user) {
  const body = `
    <p>A new customer has created an account on your website.</p>
    <table class="info-table">
      <tr><td>Full Name</td><td>${user.name || '—'}</td></tr>
      <tr><td>Email</td><td>${user.email || '—'}</td></tr>
      <tr><td>Mobile</td><td>${user.mobile || '—'}</td></tr>
      <tr><td>Signed Up At</td><td>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
    </table>
  `;
  await sendNotification('🆕 New Customer Sign-Up', 'New Customer Registration', body);
}

// 2. New Order
async function notifyNewOrder(order) {
  const items = (order.products || []).map(p =>
    `<tr><td>${p.name || p.product?.name || 'Saree'}</td><td>₹${p.price || '—'} × ${p.quantity || 1}</td></tr>`
  ).join('');

  const body = `
    <p>A new order has been placed on your store!</p>
    <table class="info-table">
      <tr><td>Order ID</td><td>#${order._id || '—'}</td></tr>
      <tr><td>Customer</td><td>${order.customerName || '—'}</td></tr>
      <tr><td>Email</td><td>${order.customerEmail || '—'}</td></tr>
      <tr><td>Mobile</td><td>${order.customerMobile || '—'}</td></tr>
      <tr><td>Total</td><td>₹${order.totalAmount || '—'}</td></tr>
      ${items}
    </table>
    <a href="http://localhost:3000/admin/orders" class="btn">VIEW ORDER</a>
  `;
  await sendNotification('🛒 New Order Received', 'New Order Placed', body);
}

// 3. Contact Form Message
async function notifyContactMessage(data) {
  const body = `
    <p>You've received a new message from the contact form.</p>
    <table class="info-table">
      <tr><td>Name</td><td>${data.name || '—'}</td></tr>
      <tr><td>Email</td><td>${data.email || '—'}</td></tr>
      <tr><td>Subject</td><td>${data.subject || '—'}</td></tr>
      <tr><td>Message</td><td>${data.message || '—'}</td></tr>
      <tr><td>Received At</td><td>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
    </table>
  `;
  await sendNotification('💬 New Contact Message', 'New Contact Form Submission', body);
}

// 4. OTP Email
async function sendOtpEmail(email, otpCode) {
  const body = `
    <div style="text-align: center; padding: 20px 0;">
      <p style="font-size: 16px; color: #555; margin-bottom: 30px;">You requested a one-time password (OTP) to sign up for Krishna Heritage Collection.</p>
      <div style="display: inline-block; background: #fdfbf7; border: 2px dashed #d4af37; padding: 20px 40px; margin: 20px 0; border-radius: 8px;">
        <h2 style="font-family: 'Cinzel', serif; font-size: 36px; letter-spacing: 8px; color: #2c2117; margin: 0;">${otpCode}</h2>
      </div>
      <p style="font-size: 14px; color: #888; margin-top: 30px;">This code is valid for 5 minutes.<br>Please do not share it with anyone.</p>
    </div>
  `;
  
  const t = getTransporter();
  if (!t) {
    console.warn('⚠️  Could not send OTP email - Transporter not configured.');
    return;
  }

  try {
    await t.sendMail({
      from: `"Krishna Heritage Collection" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verification Code for Krishna Heritage Collection',
      text: `Your Verification Code for Krishna Heritage Collection is: ${otpCode}. This code is valid for 5 minutes. Please do not share it with anyone.`,
      html: wrapHtml('Email Verification', body)
    });
    console.log(`📧  OTP Email sent to: ${email}`);
  } catch (err) {
    console.error('❌  OTP Email failed to send:', err.message);
    throw err; // Throw so the API can return an error
  }
}

// 5. Welcome Email for Customer
async function sendWelcomeEmail(user) {
  const body = `
    <div style="text-align: center; padding: 20px 0;">
      <h2 style="font-family: 'Cinzel', serif; font-size: 24px; color: #2c2117; margin-bottom: 20px;">Welcome to the Heritage, ${user.name}!</h2>
      <p style="font-size: 16px; color: #555; line-height: 1.8; margin-bottom: 30px;">
        We are thrilled to welcome you to the Krishna Heritage Collection family. 
        Your journey into the world of timeless drapes and modern grace begins here.
      </p>
      <div style="background: #fdfbf7; border: 1px solid #f0ebe0; padding: 30px; margin: 30px 0; border-radius: 8px;">
        <h3 style="font-family: 'Cinzel', serif; font-size: 18px; color: #b8935a; margin-top: 0;">Exclusive Member Benefits</h3>
        <ul style="text-align: left; color: #555; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li>Early access to new saree collections</li>
          <li>Exclusive members-only discounts and offers</li>
          <li>Faster checkout and order tracking</li>
          <li>Curated style recommendations just for you</li>
        </ul>
      </div>
      <p style="font-size: 16px; color: #555; margin-bottom: 30px;">
        As a token of our appreciation, enjoy <strong>10% OFF</strong> your first order!
      </p>
      <a href="http://localhost:3000/all-collections.html" style="display: inline-block; background: #2c2117; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-size: 14px; font-weight: 600; letter-spacing: 2px;">EXPLORE COLLECTION</a>
    </div>
  `;
  
  const t = getTransporter();
  if (!t) return;

  try {
    await t.sendMail({
      from: `"Krishna Heritage Collection" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Welcome to Krishna Heritage Collection ✨',
      text: `Welcome to the Heritage, ${user.name}!\n\nWe are thrilled to welcome you to the Krishna Heritage Collection family. Your journey into the world of timeless drapes and modern grace begins here.\n\nEnjoy 10% OFF your first order!\n\nExplore our collection at http://localhost:3000/all-collections.html`,
      html: wrapHtml('Welcome to Our World', body)
    });
    console.log(`✅ Welcome email successfully sent to ${user.email}`);
  } catch (error) {
    console.error(`❌ Error sending welcome email to ${user.email}:`, error);
    throw error;
  }
}

// ─── Send Password Reset Email ──────────────────────────────────────
async function sendPasswordResetEmail(email, resetUrl) {
  const t = getTransporter();
  if (!t) return;

  const subject = 'Reset Your Password - Krishna Heritage Collection';
  const body = `
    <h2 style="color: #b8935a; margin-top: 0;">Password Reset Request</h2>
    <p>We received a request to reset your password for your Krishna Heritage Collection account.</p>
    <p>Click the button below to choose a new password. This link will expire in 1 hour.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="background-color: #b8935a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
    </div>
    
    <p style="color: #666; font-size: 13px;">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
    <p style="color: #666; font-size: 13px;">For security reasons, this link will expire in 1 hour.</p>
  `;

  try {
    await t.sendMail({
      from: `"Krishna Heritage" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html: wrapHtml('Password Reset Request', body)
    });
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Error sending password reset email to ${email}:`, error);
    throw error;
  }
}

module.exports = {
  notifyNewSignup,
  notifyNewOrder,
  notifyContactMessage,
  sendNotification,
  sendOtpEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail
};
