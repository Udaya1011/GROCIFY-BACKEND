/**
 * Mock Email Utility
 * Simulates sending emails for development purposes.
 */
export const sendMockEmail = async ({ to, subject, text }) => {
    console.log("------------------------------------------");
    console.log(`📧 MOCK EMAIL SENT`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${text}`);
    console.log("------------------------------------------");

    // In a real scenario, you would use nodemailer or a service like Resend/SendGrid
    return { success: true, message: "Email sent successfully (mock)" };
};
