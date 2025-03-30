const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

exports.sendEmail = async ({ to, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: `"Machine Management System" <${config.email.user}>`,
      to,
      subject,
      text,
      html
    });
    return true;
  } catch (err) {
    console.error('Email sending error:', err);
    return false;
  }
};

exports.sendRepairNotification = async (email, machineName, remainingDays) => {
  const subject = `Repair Due Soon: ${machineName}`;
  const text = `The machine ${machineName} requires maintenance in ${remainingDays} days.`;
  const html = `<h1>Maintenance Alert</h1>
    <p>The machine <strong>${machineName}</strong> requires maintenance in <strong>${remainingDays}</strong> days.</p>`;

  return this.sendEmail({
    to: email,
    subject,
    text,
    html
  });
};