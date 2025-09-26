const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { firstName, lastName, email, company, subject, message } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !subject || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Resolve SMTP configuration with sensible fallbacks
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT || (smtpHost === 'smtp.gmail.com' ? 465 : 587));
  const smtpSecure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === 'true'
    : smtpHost === 'smtp.gmail.com' || smtpPort === 465;

  const sanitize = (v) => typeof v === 'string' ? v.trim().replace(/^['"]+|['",]+$/g, '') : v;
  const sanitizePass = (v) => {
    if (typeof v !== 'string') return v;
    // Remove spaces (Gmail app passwords display with spaces) and strip quotes/commas
    return v.trim().replace(/\s+/g, '').replace(/^['"]+|['",]+$/g, '');
  };

  const smtpUser = sanitize(process.env.SMTP_USER || process.env.EMAIL_USER);
  const smtpPass = sanitizePass(process.env.SMTP_PASS || process.env.EMAIL_PASS);

  if (!smtpUser || !smtpPass) {
    return res.status(500).json({
      message: 'Email transport is not configured. Please set SMTP_USER/SMTP_PASS or EMAIL_USER/EMAIL_PASS.'
    });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  // Preflight: verify SMTP connectivity/auth before sending
  try {
    await transporter.verify();
  } catch (verifyError) {
    console.error('SMTP verify failed:', {
      code: verifyError.code,
      responseCode: verifyError.responseCode,
      message: verifyError.message,
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      userMasked: smtpUser ? `${smtpUser.slice(0, 2)}***@${(smtpUser.split('@')[1] || '').replace(/.*/,'***')}` : undefined,
    });

    const isAuthError = verifyError.code === 'EAUTH' || verifyError.responseCode === 535;
    return res.status(isAuthError ? 401 : 502).json({
      message: 'Email service authentication failed. Please update email credentials and try again.',
      hint: smtpHost.includes('gmail.com')
        ? 'For Gmail: use a 16-character App Password (no spaces), and ensure EMAIL_USER/SMTP_USER has no quotes or commas.'
        : 'Check SMTP_HOST/PORT/SECURE/USER/PASS values or use a different provider.',
    });
  }

  // HTML email template
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>New Contact Form Submission</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            padding: 20px;
          }
          .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            max-width: 600px;
            margin: auto;
          }
          h2 {
            color: #3e6ae1;
          }
          .field {
            margin-bottom: 10px;
          }
          .label {
            font-weight: bold;
            color: #555;
          }
          .value {
            margin-left: 5px;
            color: #333;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>New Contact Form Submission</h2>
          <p>You've received a new message from your website form.</p>

          <div class="field">
            <span class="label">First Name:</span>
            <span class="value">${firstName}</span>
          </div>

          <div class="field">
            <span class="label">Last Name:</span>
            <span class="value">${lastName}</span>
          </div>

          <div class="field">
            <span class="label">Email:</span>
            <span class="value">${email}</span>
          </div>

          <div class="field">
            <span class="label">Company:</span>
            <span class="value">${company || 'Not provided'}</span>
          </div>

          <div class="field">
            <span class="label">Subject:</span>
            <span class="value">${subject}</span>
          </div>

          <div class="field">
            <span class="label">Message:</span>
            <span class="value">${message}</span>
          </div>

          <p style="margin-top: 20px;">Regards,<br>Your Website</p>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.EMAIL_USER || smtpUser,
    to: process.env.SMTP_TO || process.env.RECEIVER_EMAIL || smtpUser,
    subject: `New Contact Form Submission from ${firstName} ${lastName}`,
    html: htmlTemplate,
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'Email sent successfully' });
  } catch (error) {
    // Log safe, useful details server-side for diagnosis
    console.error('Error sending email:', {
      code: error.code,
      responseCode: error.responseCode,
      message: error.message,
    });
    // Return a generic error message to the client
    res.status(500).json({ message: 'Error sending email. Please try again later.' });
  }
}
