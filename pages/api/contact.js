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

  // Create transporter using your email service
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your email service
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

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
    from: process.env.EMAIL_USER, // Your email
    to: process.env.RECEIVER_EMAIL, // Email where you want to receive the form submissions
    subject: `New Contact Form Submission from ${firstName} ${lastName}`,
    html: htmlTemplate,
    replyTo: email, // So you can reply directly to the person who filled the form
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
}
