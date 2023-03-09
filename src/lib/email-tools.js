import sgMail from "@sendgrid/mail";
import { readPDFFile } from "./fs-tools.js";

sgMail.setApiKey(process.env.SENDGRID_KEY);

export const sendsRegistrationEmail = async (recipientAddress) => {
  const msg = {
    to: recipientAddress,
    from: process.env.SENDER_EMAIL_ADDRESS,
    subject: "first",
    text: "test",
    html: "<strong>Blog Posted</strong>",
  };

  await sgMail.send(msg);
};

export const sendPDFToEmail = async (recipientAddress) => {
  const pdf = await readPDFFile();
  const pdfBase = pdf.toString("base64");
  const msg = {
    to: recipientAddress,
    from: process.env.SENDER_EMAIL_ADDRESS,
    subject: "first",
    text: "test",
    html: "<strong>Blog Posted with PDF</strong>",
    attachments: [
      {
        content: pdfBase,
        filename: "blog.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };
  await sgMail.send(msg);
};
