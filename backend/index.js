// backend/server.js
require('dotenv').config(); // Load environment variables from .env file

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
const port = 3001; // Choose a port for your backend

app.use(cors());
app.use(express.json());

// Use environment variables for credentials
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const DOMAIN =process.env.DOMAIN;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

app.post("/send-pact-emails", async (req, res) => {
  const { name, amountPerPerson, dueDate, participants, pactId } = req.body;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error("Email credentials are not set in the .env file.");
    return res.status(500).send({ message: "Server configuration error: Email credentials missing." });
  }

  const emailPromises = participants.map((p) => {
    if (p.email) {
      const subject = `You've been invited to a new pact on PayPact: ${name}`;
      const body = `
        <p>Hello,</p>
        <p>You have been invited to a pact titled <b>${name}</b> on PayPact. 🤝</p>
        <p>Your share is <b>${amountPerPerson}</b> SOL, due by ${new Date(dueDate).toLocaleString()}.</p>
        <p>To view the pact and pay your share, click here: <a href="${DOMAIN}/pact/${pactId}">View Pact Details</a></p>
        <p>Thanks,<br/>The PayPact Team</p>
      `;

      const mailOptions = {
        from: EMAIL_USER,
        to: p.email,
        subject,
        html: body,
      };

      return transporter.sendMail(mailOptions);
    }
    return null;
  });

  try {
    await Promise.all(emailPromises.filter(Boolean));
    console.log(`Emails sent for pact ${pactId}`);
    res.status(200).send({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).send({ message: "Failed to send emails", error });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});