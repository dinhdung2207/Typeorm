import * as nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'issac.turcotte87@ethereal.email',
    pass: 'zsaxj4jsjK4HGtdptM',
  },
});

export interface IMessageMailer {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendEmailService = async (message: IMessageMailer) => {
  return await transporter.sendMail(message);
};

export const getPreviewURLMailer = (mailer) => {
  return nodemailer.getTestMessageUrl(mailer);
};
