const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  }
});

const sendEmail = async (to, subject, template, token) => {
  try {
    const templatePath = path.join(__dirname, "..", "views", `${template}.ejs`);

    const html = await ejs.renderFile(templatePath, { token }, { async: true });

    const mailOptions = {
      from: {
        name: "Mentor Token",
        address: process.env.NODEMAILER_GMAIL_EMAIL,
      },
      to,
      subject,
      html,
    };

    const info = await transport.sendMail(mailOptions);

    return JSON.stringify(info);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

const sendContactMessage = async (to, subject, template,) => {
  try {
    const templatePath = path.join(__dirname, 'views', `${template}.ejs`);

    const html = await ejs.renderFile(templatePath, {data}, { async: true });

    const mailOptions = {
      from: {
        name: "Mentor Token",
        address: process.env.google_account, 
      },
      to,
      subject,
      html,
    };

    const info = await transport.sendMail(mailOptions);

    // console.log(`Email sent successfully. Info: ${JSON.stringify(info)}`);
    return JSON.stringify(info);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};


module.exports = sendEmail, sendContactMessage;
