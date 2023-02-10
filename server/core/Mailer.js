const nodemailer = require("nodemailer");
const {logger} = require('../config/logger')

const sendEmail = async (to, subject, txt) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    let mailDetails = {
        from: '"UniversalServiceBook" <' + process.env.EMAIL + '>',
        to: to,
        subject: subject,
        html: txt,
    }

    transporter.sendMail(mailDetails, function (err, info) {
        if (err) {
            logger.error('Sikertelen email küldés!', {user: 'Mailer', data: JSON.stringify(err)})
        } else {
            logger.info('Sikeres email küldés!', {user: 'Mailer', data: JSON.stringify(info)})
        }
    });
};

module.exports = sendEmail;