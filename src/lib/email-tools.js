import sgMail from "@sendgrid/mail";

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
