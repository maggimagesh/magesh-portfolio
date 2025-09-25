# Email Setup Instructions

## 1. Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
RECEIVER_EMAIL=your-email@gmail.com
```

## 2. Gmail Setup (if using Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `EMAIL_PASS` (not your regular Gmail password)

## 3. Alternative Email Services

You can use other email services by modifying the transporter configuration in `pages/api/contact.js`:

### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransporter({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

### Custom SMTP
```javascript
const transporter = nodemailer.createTransporter({
  host: 'your-smtp-host',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

## 4. Testing

1. Start the development server: `npm run dev`
2. Fill out the contact form
3. Check your email for the form submission

## 5. Production Deployment

Make sure to set the environment variables in your production environment (Vercel, Netlify, etc.).

## Troubleshooting

- **Authentication failed**: Check your email credentials and app password
- **Connection timeout**: Verify your email service settings
- **Form not submitting**: Check browser console for errors
