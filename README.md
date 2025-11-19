
## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

## Email Configuration

  To enable the contact form, you need to configure email settings:

  1. Create a `.env.local` file in the root of the project
  2. Add your email credentials (see `.env.local` for example configuration)
  3. For Gmail, use an App Password (not your regular password)
     - Go to Google Account settings
     - Enable 2-factor authentication
     - Generate an App Password for "Mail"
     - Use the 16-character app password in the SMTP_PASS field

  The contact form will send emails to the address specified in RECEIVER_EMAIL.
  