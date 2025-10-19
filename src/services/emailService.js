import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Casting Platform" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });

        console.log('[EMAIL] Message sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('[EMAIL] Error sending email:', error);
        return { success: false, error: error.message };
    }
};

export const sendPerformerEmail = async (performer, emailContent) => {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #4A5568; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f7fafc; }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #718096; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Casting Notification</h1>
                </div>
                <div class="content">
                    <p>Dear ${performer.firstName} ${performer.lastName},</p>
                    ${emailContent}
                </div>
                <div class="footer">
                    <p>This is an automated message from the Casting Platform</p>
                </div>
            </div>
        </body>
        </html>
    `;

    return await sendEmail(performer.email, 'New Casting Opportunity', html);
};

export default { sendEmail, sendPerformerEmail };
