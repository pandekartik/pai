# Vercel + Resend Form Handler Setup

This guide will help you set up form enquiries handling using Vercel serverless functions and Resend email service.

## Prerequisites

- Vercel account (https://vercel.com)
- Resend account (https://resend.com) - Free tier available

## Step 1: Create Resend Account & API Key

1. Go to https://resend.com and sign up for a free account
2. Navigate to **API Keys** section
3. Create a new API key
4. Copy the API key (it starts with `re_`)

## Step 2: Set Up Environment Variables in Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on **Settings** → **Environment Variables**
3. Add new environment variable:
   - **Name:** `RESEND_API_KEY`
   - **Value:** `re_xxxxxxxxxxxxxxxx` (your Resend API key)
   - **Environments:** Select all (Production, Preview, Development)
4. Click **Save**

### Option B: Using Vercel CLI

```bash
# Login to Vercel
vercel login

# Set environment variable
vercel env add RESEND_API_KEY

# When prompted, enter your Resend API key
```

## Step 3: Install Dependencies (Local Development Only)

```bash
npm install resend
```

Or if using yarn:
```bash
yarn add resend
```

## Step 4: Create Local Environment File

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your Resend API key:
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
```

## Step 5: Update Contact Form HTML

The API endpoint expects form data with the following fields:

```html
<form id="contactForm" class="contact-form">
    <div class="form-group mb-3">
        <label for="name">Name <span class="required">*</span></label>
        <input type="text" id="name" name="name" placeholder="Your name" required>
    </div>

    <div class="form-group mb-3">
        <label for="email">Email <span class="required">*</span></label>
        <input type="email" id="email" name="email" placeholder="your@email.com" required>
    </div>

    <div class="form-group mb-3">
        <label for="phone">Phone Number</label>
        <input type="tel" id="phone" name="phone" placeholder="+91 XXXXX XXXXX">
    </div>

    <div class="form-group mb-3">
        <label for="company">Company</label>
        <input type="text" id="company" name="company" placeholder="Company name (optional)">
    </div>

    <div class="form-group mb-3">
        <label for="subject">Subject</label>
        <input type="text" id="subject" name="subject" placeholder="Subject (optional)">
    </div>

    <div class="form-group mb-4">
        <label for="message">Message <span class="required">*</span></label>
        <textarea id="message" name="message" placeholder="Your message..." required></textarea>
    </div>

    <button type="submit" class="btn btn-primary">Send Enquiry</button>
</form>

<!-- Include the contact form scripts -->
<link rel="stylesheet" href="css/contact-form.css">
<script src="js/contact-form.js"></script>
```

## Step 6: Test the Form

### Local Development
```bash
# Install Vercel CLI
npm i -g vercel

# Run development server
vercel dev

# Open http://localhost:3000 and test the form
```

### Production
Deploy to Vercel and test the form on your live site.

## API Endpoint Details

**Endpoint:** `POST /api/contact`

**Expected Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 93257 76868",
    "company": "ABC Corp",
    "subject": "Machinery Inquiry",
    "message": "I'm interested in your CNC machining services..."
}
```

**Success Response (200):**
```json
{
    "success": true,
    "message": "Enquiry received successfully! We will get back to you shortly."
}
```

**Error Response (400/500):**
```json
{
    "error": "Error message describing what went wrong"
}
```

## Email Functionality

### Received Emails
1. **Enquiry Email to Company:**
   - Sent to: `info@pandurangai.com`
   - Contains: Full enquiry details with formatted layout
   - Reply-To: Customer's email address

2. **Confirmation Email to Customer:**
   - Sent to: Customer's email address
   - Contains: Thank you message with next steps
   - Includes: Company contact information

## Troubleshooting

### "Missing API Key" Error
- Verify `RESEND_API_KEY` is set in Vercel environment variables
- Make sure you're using the correct Resend API key (starts with `re_`)
- Redeploy after adding environment variables

### Emails Not Sending
1. Check Resend dashboard for sending logs
2. Verify sender email is verified in Resend dashboard
3. Check form submission in browser console for errors
4. Verify all required fields are provided

### Form Validation Issues
- Name, email, and message are required fields
- Email must be in valid format (example@domain.com)
- Phone number is optional but recommended

## Monitoring & Logs

### Vercel Logs
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Deployments** → **Runtime Logs**

### Resend Logs
1. Go to [Resend Dashboard](https://resend.com)
2. Check **Logs** section for email sending history

## Cost Estimates

- **Vercel:** Free tier includes 1,000 function invocations/month
- **Resend:** Free tier includes 100 emails/day
- **For PAI:** Estimated < $0/month for typical usage

## File Structure

```
/api
  └── contact.js           # Serverless function handler
/css
  └── contact-form.css    # Form styling
/js
  └── contact-form.js     # Form submission logic
.env.local                # Local environment variables (DO NOT COMMIT)
.env.local.example        # Template for environment variables
VERCEL_SETUP.md          # This file
```

## Security Notes

✅ **Already Implemented:**
- Email validation
- Required field validation
- CORS protection via Vercel
- API key stored in environment variables (never exposed)

✅ **Additional Recommendations:**
- Add rate limiting for production
- Consider adding CAPTCHA for spam prevention
- Monitor for suspicious activity in logs

## Support

- **Resend Documentation:** https://resend.com/docs
- **Vercel Documentation:** https://vercel.com/docs
- **API Reference:** See `/api/contact.js` for full implementation

---

**Last Updated:** June 2026
**Status:** Ready for Deployment ✅
