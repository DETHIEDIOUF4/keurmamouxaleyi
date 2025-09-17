import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "dethiediouf144165@gmail.com",
    pass: "svuy jtnh mojt hxdk",
  },
});

export const sendOrderMail = async (
  to: string,
  subject: string,
  html: string,
  attachments?: Array<{ filename: string; path?: string; content?: Buffer | string; contentType?: string }>
) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    html,
    attachments,
  });
};