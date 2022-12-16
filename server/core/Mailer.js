const nodemailer = require("nodemailer");

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
            console.log(err);
        } else {
            console.log(info);
        }
    });
};

module.exports = sendEmail;