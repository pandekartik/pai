import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed. Use POST.'
        });
    }

    const { name, email, phone, message, company, subject } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
        return res.status(400).json({
            error: 'Missing required fields: name, email, message'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: 'Invalid email address'
        });
    }

    try {
        // Send email to company inbox
        await resend.emails.send({
            from: 'noreply@pandurangai.com',
            to: 'info@pandurangai.com',
            replyTo: email,
            subject: `New Enquiry: ${subject || 'Website Contact Form'}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #f7f9fc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h2 style="color: #1B3A6B; margin: 0 0 20px 0;">New Enquiry Received</h2>
                    </div>

                    <div style="background: #fff; padding: 20px; border: 1px solid #E8EDF5; border-radius: 8px;">
                        <p style="margin: 0 0 15px 0;"><strong>Name:</strong> ${name}</p>
                        <p style="margin: 0 0 15px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        ${phone ? `<p style="margin: 0 0 15px 0;"><strong>Phone:</strong> ${phone}</p>` : ''}
                        ${company ? `<p style="margin: 0 0 15px 0;"><strong>Company:</strong> ${company}</p>` : ''}

                        <hr style="border: none; border-top: 1px solid #E8EDF5; margin: 20px 0;">

                        <h3 style="color: #0d1f3c; margin: 0 0 10px 0;">Message:</h3>
                        <p style="color: #6B7280; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                    </div>

                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #E8EDF5; text-align: center; color: #8896A8; font-size: 12px;">
                        <p>Enquiry received on ${new Date().toLocaleString('en-IN')}</p>
                    </div>
                </div>
            `
        });

        // Send confirmation email to user
        await resend.emails.send({
            from: 'noreply@pandurangai.com',
            to: email,
            subject: 'We received your enquiry — Pandurang Auto Industries',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #f7f9fc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <img src="https://www.pandurangai.com/img/Logo.png" alt="Pandurang Auto Industries" style="height: 40px; margin-bottom: 20px;">
                        <h2 style="color: #1B3A6B; margin: 0;">Thank You for Contacting Us!</h2>
                    </div>

                    <div style="background: #fff; padding: 20px; border: 1px solid #E8EDF5; border-radius: 8px;">
                        <p>Hi ${name},</p>

                        <p>Thank you for reaching out to Pandurang Auto Industries. We have received your enquiry and appreciate your interest in our services.</p>

                        <p><strong>Here's what happens next:</strong></p>
                        <ul style="color: #374151; line-height: 1.8;">
                            <li>Our team will review your enquiry shortly</li>
                            <li>We'll get back to you within 24 hours (business days)</li>
                            <li>If you have urgent requirements, feel free to call us at <a href="tel:+919325776868" style="color: #1B3A6B;">+91 93257 76868</a></li>
                        </ul>

                        <p style="margin-top: 20px;">
                            <strong>Your Enquiry Details:</strong><br>
                            ${subject ? `Subject: ${subject}<br>` : ''}
                            Contact: ${phone || 'Not provided'}
                        </p>
                    </div>

                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #E8EDF5; color: #8896A8; font-size: 12px;">
                        <p>
                            <strong>Pandurang Auto Industries</strong><br>
                            Plot No: 3B+3, Plot No:22, D1 Block,<br>
                            Akurdi Industrial Estate, MIDC Chinchwad,<br>
                            Pune 411019, Maharashtra<br>
                            <br>
                            <a href="tel:+919325776868" style="color: #93C5FD; text-decoration: none;">+91 93257 76868</a> |
                            <a href="mailto:info@pandurangai.com" style="color: #93C5FD; text-decoration: none;">info@pandurangai.com</a>
                        </p>
                    </div>
                </div>
            `
        });

        return res.status(200).json({
            success: true,
            message: 'Enquiry received successfully! We will get back to you shortly.'
        });

    } catch (error) {
        console.error('Error sending emails:', error);
        return res.status(500).json({
            error: 'Failed to process enquiry. Please try again or contact us directly.',
            details: error.message
        });
    }
}
