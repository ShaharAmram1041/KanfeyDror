import axios from 'axios';
import React, { useState } from 'react';

export const EmailForm = () => {
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3001/ReportsTable', {
        recipients,
        subject,
        content,
      });
      //console.log('Email sent successfully');

      // Show success alert
      alert('ההודעה נשלחה בהצלחה');

    } catch (error) {

      // Show error alert
      alert('ההודעה לא נשלחה');
      console.error('Error sending email:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="כתובת אימייל"
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
        />
        <input
          type="text"
          placeholder="נושא"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          placeholder="תוכן הודעה"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button type="submit">שלח</button>
      </form>
    </div>
  );
};

