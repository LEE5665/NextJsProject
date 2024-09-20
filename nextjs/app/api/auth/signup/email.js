import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export function createVerificationToken(user) {
  return jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

export async function sendVerificationEmail(email, token, subjectt, textt, url) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    const verificationUrl = `${url}${token}`;
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subjectt,
      text: `${textt}${verificationUrl}`,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: ", info.response); // 전송 성공 시 출력
    } catch (error) {
      console.error("Error sending email: ", error); // 전송 실패 시 오류 출력
    }
  }