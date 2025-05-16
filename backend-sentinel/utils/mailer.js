import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use 'smtp.mailtrap.io', 'Outlook365', etc.
  auth: {
    user: process.env.EMAIL_USER || 'your_email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your_email_password_or_app_password'
  }
});

/**
 * Sends a password reset email
 * @param {string} to - Recipient email
 * @param {string} token - JWT reset token
 */
export const sendResetEmail = async (to, token) => {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Password Reset Request',
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password. This link is valid for 15 minutes.</p>
      <a href="${resetLink}">${resetLink}</a>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reset email sent to ${to}`);
  } catch (err) {
    console.error('Error sending reset email:', err);
    throw new Error('Could not send reset email');
  }
};
