const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "nm4120bi@meta.ua",
    pass: "H392gPsEi5",
  },
  tls : { rejectUnauthorized: false }
});


async function sendEmail({userName, userEmail, userText}) {

const output = `<h1 style="color:green">You got a letter from: ${userName}</h1>
<p>Contact email is ${userEmail}</p>
<p>Message: ${userText}</p>
<p style="color:blue">Thank you. Newer write us again</p>`;


  const info = await transporter.sendMail({
    from: 'nm4120bi@meta.ua', // sender address
    to: "kintoriak@gmail.com", // list of receivers
    subject: "Letter for director", // Subject line
    text: userText, // plain text body
    html: output, // html body
  });

  console.log("Message sent: %s", info.messageId);

}


module.exports = sendEmail;