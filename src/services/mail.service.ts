import nodemailer from "nodemailer";
import { conf } from "src/conf";

interface MailOptions {
  receiverMail: string;
  subject: string;
  content: string;
  mailHost?: string;
  mailUser?: string;
  mailPassword?: string;
}

export async function mailService({
  receiverMail,
  subject,
  content,
  mailHost = conf.MAIL_HOST,          
  mailUser = conf.MAIL_ADDRESS,       
  mailPassword = conf.MAIL_PASSWORD
}: MailOptions): Promise<boolean> {

  try {
    let transporter = nodemailer.createTransport({
      host: mailHost,
      auth: {
        user: mailUser,
        pass: mailPassword
      },
      // tls: {
      //   rejectUnauthorized: false // Optional: If needed to bypass SSL/TLS errors
      // }
    });

    let info = await transporter.sendMail({
      from: `"${conf.BRAND_NAME}" <${mailUser}>`,
      to: receiverMail,
      subject: subject,
      text: "",
      html: content
    });

    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.log("Error while sending email: ", error);
    return false;
  }
}
