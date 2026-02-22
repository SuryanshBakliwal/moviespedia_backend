// Utils/mailer.js
import nodemailer from "nodemailer";
import { Resend } from "resend";
// const transporter = nodemailer.createTransport({
//     host: process.env.HOST,
//     port: process.env.MAIL_PORT = 465,
//     secure: true,
//     auth: {
//         user: process.env.DB_AUTH_MAIL,
//         pass: process.env.DB_AUTH_MAIL_PASSWORD,
//     },
// });

// export const sendMail = async (to, subject, html) => {
//     try {
//         await transporter.sendMail({
//             from: `"Moviespedia" <${process.env.DB_AUTH_MAIL}>`,
//             to,
//             subject,
//             html,
//         });
//         console.log(`Email sent to ${to}`);
//     } catch (err) {
//         console.error("Error sending email:", err);
//         throw new Error("Email sending failed");
//     }
// };




const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async (to, subject, html) => {
    try {
        await resend.emails.send({
            from: "Moviespedia <onboarding@resend.dev>",
            to,
            subject,
            html,
        });

        console.log(`Email sent to ${to}`);
    } catch (err) {
        console.error("Error sending email:", err);
        throw new Error("Email sending failed");
    }
};