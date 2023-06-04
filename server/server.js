const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(
  "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"
);

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express();
const PORT = 3001;

const serviceAccount = require('./ServiceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://kanfeidror-e774f-default-rtdb.firebaseio.com',
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/ReportsTable', (req, res) => {
  const { recipients, subject, content } = req.body;

  const msg = {
    to: recipients,
    from: 'kanfeidror@gmail.com',
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

app.post('/AddAdministrator', (req, res) => {
  const { email, password } = req.body;

  admin
    .auth()
    .createUser({
      email,
      password,
    })
    .then((userRecord) => {
      console.log('Successfully created new admin:', userRecord.uid);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error creating new admin:', error);
      res.status(500).json({ error: 'Failed to create new admin' });
    });
});

app.delete('/RemoveAdministrator', (req, res) => {
  const { email } = req.body;

  admin
    .auth()
    .getUserByEmail(email)
    .then((userRecord) => {
      return admin.auth().deleteUser(userRecord.uid);
    })
    .then(() => {
      console.log('Successfully removed admin user from authentication');
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error removing admin user:', error);
      res.status(500).json({ error: 'Failed to remove admin user from authentication' });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});