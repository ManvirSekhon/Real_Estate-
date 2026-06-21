const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

const sendWelcomeEmail = async (email, name) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: '"Real Estate App" <noreply@realestatemarket.com>',
            to: email,
            subject: 'Welcome to our Real Estate Marketplace',
            html: `
                <h2>Welcome aboard, ${name}! 🏠</h2>
                <p>We are thrilled to have you join our Real Estate Marketplace.</p>
                <p>You can now start browsing properties, saving your favorites, and connecting with sellers.</p>
                <br>
                <p>Best Regards,</p>
                <p><strong>The Real Estate Team</strong></p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully');
    } catch (error) {
        console.error('Error sending welcome email:', error.message);
    }
};

const sendLoginAlert = async (email, name) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: '"Real Estate Security" <security@realestatemarket.com>',
            to: email,
            subject: 'Security Alert: New Login to Your Account',
            html: `
                <h2>Hello ${name},</h2>
                <p>We noticed a successful login to your Real Estate Marketplace account just now.</p>
                <p>If this was you, you can safely ignore this email.</p>
                <p style="color: red;"><strong>If you did not log in, please reply to this email or reset your password immediately.</strong></p>
                <br>
                <p>Stay secure,</p>
                <p><strong>The Real Estate Security Team</strong></p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Login alert sent to ${email}`);
    } catch (error) {
        console.error('Error sending login alert:', error.message);
    }
};

const sendVerificationEmail = async (email, name, verificationLink) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: '"Real Estate Marketplace" <noreply@realestatemarket.com>',
        to: email,
        subject: 'Verify Your Email Address - Real Estate Marketplace',
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to Real Estate Marketplace, ${name}! 🏠</h2>
                    <p style="color: #666; font-size: 16px;">Thank you for registering. Please verify your email address to activate your account.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationLink}" style="background-color: #007bff; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                            Verify Email Address
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
                    <p style="background-color: #f9f9f9; padding: 10px; border-left: 3px solid #007bff; word-break: break-all;">
                        <code>${verificationLink}</code>
                    </p>
                    <p style="color: #856404; background-color: #fff3cd; padding: 12px; border-left: 4px solid #ffc107; border-radius: 4px;">
                        This verification link will expire in 24 hours.
                    </p>
                    <p style="color: #666; font-size: 14px;">If you did not register for this account, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                    <p style="color: #999; font-size: 12px;">Best Regards,<br><strong>The Real Estate Marketplace Team</strong></p>
                </div>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully to:', email);
};

module.exports = { sendWelcomeEmail, sendLoginAlert, sendVerificationEmail };
