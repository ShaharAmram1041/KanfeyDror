const sgMail = require('@sendgrid/mail');
sgMail.setApiKey();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); 

const app = express();
const PORT = 3001; // The port that the server will listen on

app.use(cors());
app.use(bodyParser.json()); // Parse the body
app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/ReportsTable', (req, res) => {
  let { recipients, subject, content } = req.body;

  // Convert recipients to an array if it's a string
  if (typeof recipients === 'string') {
    recipients = [recipients];
  }

  const msg = {
    to: recipients,
    from: 'kanfeidror@gmail.com', // The sender email address
    subject: subject,
    html: content,
  };

  sgMail
    .send(msg)
    .then(() => {
      res.json({ message: 'Email sent successfully' });
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
