import nodemailer from 'nodemailer';

export const sendResetEmail = async (to, token) => {
  const resetLink = `http://localhost:3000/reset-password?token=${token}`; // TODO: Update to frontend URL

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Sentinel Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reset Your Password',
    html: `
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link is valid for 15 minutes.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `
  });
};
