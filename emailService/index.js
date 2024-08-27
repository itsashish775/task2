const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});

const emailConnect = () => {
    transporter
        .verify()
        .then(() => console.log('Connected to email server'))
        .catch(() => console.log('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));

}
const sendEmail = async (to, subject, text) => {
    const msg = { from: process.env.EMAIL_FROM, to, subject, text };
    await transporter.sendMail(msg);
}

module.exports = { emailConnect, sendEmail }