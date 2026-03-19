const nodemailer = require("nodemailer");

async function sendEmailWithAttachment(
  toEmail,
  subject,
  patient,
  fromDate,
  toDate,
  pdfBuffer,
) {
  if (!toEmail) throw new Error("Recipient email is missing.");

  console.log("Preparing to send email to:", toEmail);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: serverConfig.GMAIL_USER,
      pass: serverConfig.GMAIL_PASS,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
  });

  // Verify transporter
  // try {
  //   await transporter.verify();
  //   console.log("Gmail transporter verified successfully!");
  // } catch (err) {
  //   console.error("Transporter verification failed:", err);
  //   throw new Error(
  //     "Email transporter authentication failed. Check Gmail credentials."
  //   );
  // }

  // HTML email content
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #0d6efd;">HeartSense</h2>
      <p>Hi <strong>${patient.firstName} ${patient.lastName}</strong>,</p>
      <p>We have generated your ECG reports for the period: <strong>${
        fromDate || "All time"
      } - ${toDate || new Date().toLocaleDateString()}</strong>.</p>
      
      <p>You can view your reports in the attached PDF document. Here’s a quick summary:</p>

      <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
        <thead>
          <tr style="background-color: #0d6efd; color: white;">
            <th style="padding: 8px; text-align: left;">#</th>
            <th style="padding: 8px; text-align: left;">Date</th>
            <th style="padding: 8px; text-align: left;">Status</th>
            <th style="padding: 8px; text-align: left;">Comments</th>
          </tr>
        </thead>
        <tbody>
          ${patient.reports
            .map(
              (r, i) => `
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 8px;">${i + 1}</td>
              <td style="padding: 8px;">${r.createdAt.toLocaleDateString()}</td>
              <td style="padding: 8px;">${r.status}</td>
              <td style="padding: 8px;">${r.comments || "N/A"}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <p style="margin-top: 20px;">Thank you for using HeartSense. Stay healthy!</p>
      <hr style="border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #888;">This is an automated email. Please do not reply.</p>
    </div>
  `;

  // Send the email
  try {
    await transporter.sendMail({
      from: `"ECG Monitoring System" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: "ECG_Report.pdf",
          content: pdfBuffer,
        },
      ],
    });
    console.log("Email sent successfully to:", toEmail);
  } catch (err) {
    console.error("Failed to send email:", err);
    throw err;
  }
}

module.exports = { sendEmailWithAttachment };
