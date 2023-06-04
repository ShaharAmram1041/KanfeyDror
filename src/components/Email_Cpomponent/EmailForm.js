import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { db } from "../../firebase_setup/firebase";
import { addDoc,deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Grid ,TextField,MenuItem} from '@mui/material';


export const EmailForm = ({ c }) => {
  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [city, setCity] = useState(c);
  const [email, setEmail] = useState('');
  const [existingEmails, setExistingEmails] = useState([]);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isNewEmailValid, setIsNewEmailValid] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [isDeleteEmailValid, setIsDeleteEmailValid] = useState(true);
  const [deleteEmail, setdeleteEmail] = useState('');
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const q = query(collection(db, "emailDB"), where("city", "==", city));
        const querySnapshot = await getDocs(q);
        const emails = querySnapshot.docs.map((doc) => doc.data().email);
        setExistingEmails(emails);
      } catch (error) {
        console.error("Error fetching emails: ", error);
      }
    };

    if (city) {
      fetchEmails();
    }
  }, [city]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("hrlo!");
    if(!isEmailValid || city === ""){
      console.log("hrlo!ssss");
      console.log("im email"+email);
      console.log("hrlcity" + city);
      console.log("hrlo!ssss" + !isEmailValid);
      return;}
      
    try {
      await axios.post('http://localhost:3001/ReportsTable', {
        recipients,
        subject,
        content,
      });

      // Show success alert
    alert('ההודעה נשלחה בהצלחה');
    // Clear form fields
    setRecipients([]);
    setSubject('');
    setContent('');

    // Close the form
    setShowForm(false);

    } catch (error) {
      // Show error alert
      alert('ההודעה לא נשלחה');
      console.error('Error sending email:', error);
    }
  }

  const handleRecipientChange = (e) => {
    let selectedValues = [];
    if (e.target.value !== "") {
      selectedValues = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
    }
  
    setRecipients(selectedValues);
  
    let isValid = true;
    if (selectedValues.length > 0) {
      selectedValues.forEach((email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(email)) {
          isValid = false;
        }
      });
    }
  
    setIsEmailValid(isValid);
    // setEmail(e.target.value);
    // const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    // setIsEmailValid(emailRegex.test(e.target.value));
  };

  // const writeEmailsToDB = async (e) => {
  //   e.preventDefault();
  //   if(city === "" || email === "")
  //     return;
  //   try {
  //     const docRef = await addDoc(collection(db, "emailDB"), {
  //       city,
  //       email,
  //     });
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }
  //   setEmail('');
  //   setCity('');
  // };

  const writeNewEmailsToDB = async (e) => {
    if (!isNewEmailValid || newEmail === '') {
      return;
    }
  
    try {
      // Check if the email with the same email and city already exists
      const querySnapshot = await getDocs(
        query(
          collection(db, 'emailDB'),
          where('email', '==', newEmail),
          where('city', '==', city)
        )
      );
  
      if (querySnapshot.empty) {
        // No matching document found, proceed with adding the new email
        const docRef = await addDoc(collection(db, 'emailDB'), {
          city,
          email: newEmail,
        });
        alert('המייל נוסף בהצלחה');
        setNewEmail('');
      } else {
        // Email with the same email and city already exists
        alert('כתובת המייל כבר קיימת עבור העיר הנבחרת');
      }
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };


  const handleNewEmailChange = (event) => {
    setNewEmail(event.target.value);
    // Validate email format using a regular expression
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    setIsNewEmailValid(emailRegex.test(newEmail));
  };


  const deleteEmailsDB = async (e) => {
    if (!isDeleteEmailValid || deleteEmail === "") {
      return;
    }
  
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'emailDB'),
          where('email', '==', deleteEmail),
          where('city', '==', city)
        )
      );
  
      if (!querySnapshot.empty) {
        // Delete the matching document
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        alert('המייל נמחק בהצלחה');
        setdeleteEmail('');
      } else {
        // No matching document found
        alert('לא נמצא מייל תואם למחיקה');
      }
    } catch (e) {
      console.error('Error deleting document: ', e);
    }
  };

  const handleDeleteEmailChange = (event) => {
    setdeleteEmail(event.target.value);
    // Validate email format using a regular expression
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    setIsDeleteEmailValid(emailRegex.test(deleteEmail));
  };

  

  


  return (
    <div>
      {showForm && (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
        <Grid container direction="column" spacing={2} >
          {/* The city exists in the database */}
          {existingEmails.length > 0 && (
            <Grid item sx={{ width: '400px' }}>
             <TextField
              select
              label="בחר כתובת אימייל מהמאגר"
              variant="filled"
              sx={{
                width: '400px',
                "& label": {
                  left: "unset",
                  right: "2.75rem",
                  transformOrigin: "right",
                  fontSize: "0.8rem",
                },
                "& legend": {
                  textAlign: "left",
                  fontSize: "0.6rem",
                },
              }}
              value={recipients}
              onChange={handleRecipientChange}
              fullWidth
              SelectProps={{
                multiple: true,
              }}
            >
              <MenuItem disabled value="">
                {/* <em>בחר כתובת אימייל מהמאגר</em> */}
              </MenuItem>
              {existingEmails
                .filter((email) => email !== '')
                .map((existingEmail) => (
                  <MenuItem key={existingEmail} value={existingEmail}>
                    {existingEmail}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
          )}

          <Grid item >
            <TextField
              required
              label="הזן כתובת אי מייל"
              variant="filled"
              placeholder="הזן כתובת"
              inputProps={{ dir: 'rtl' }}
              sx={{
                width: '400px' ,
                "& label": {
                  left: "unset",
                  right: "1.75rem",
                  transformOrigin: "right",
                  fontSize: "0.8rem",
                },
                "& legend": {
                  textAlign: "right",
                  fontSize: "0.6rem",
                },
              }}
              value={recipients}
              onChange={handleRecipientChange}
              error={!isEmailValid}
              helperText={!isEmailValid ? 'כתובת מייל לא תקינה' : ''}
            />
          </Grid>

          <Grid item>
        <TextField
          required
          label="נושא ההודעה"
          variant="filled"
          placeholder="נושא"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          inputProps={{ dir: 'rtl' }}
          sx={{
            width: '400px' ,
            "& label": {
              left: "unset",
              right: "1.75rem",
              transformOrigin: "right",
              fontSize: "0.8rem",
            },
            "& legend": {
              textAlign: "right",
              fontSize: "0.6rem",
            },
          }}
        />
      </Grid>
      <Grid item>
          <TextField
              required
              type="text"
              label = "תוכן ההודעה"
              variant="filled"
              color="success"
              fullWidth
              multiline
              placeholder="תוכן הודעה"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              inputProps={{ dir: 'rtl' }}
              sx={{
                width: '400px' ,
                "& label": {
                  left: "unset",
                  right: "1.75rem",
                  transformOrigin: "right",
                  fontSize: "0.8rem",
                },
                "& legend": {
                  textAlign: "right",
                  fontSize: "0.6rem",
                },
              }}
          />
          </Grid>

          <Grid item>
            <button type="submit">שלח מייל</button>
          </Grid>
        </Grid>
      </form>
   </div>
   )}

    {showForm && ( 
      <div>
      <TextField
        label="הוסף כתובת מייל למאגר"
        variant="filled"
        value={newEmail}
        onChange={handleNewEmailChange}
        error={!isNewEmailValid}
        helperText={!isNewEmailValid ? 'כתובת מייל לא תקינה' : ''}
        sx={{
          "& label": {
            left: "unset",
            right: "1.75rem",
            transformOrigin: "right",
            fontSize: "0.8rem",
          },
          "& legend": {
            textAlign: "right",
            fontSize: "0.6rem",
          },
        }}
      />
      <button onClick={writeNewEmailsToDB} variant="contained" color="primary">
       הוסף מייל
      </button>
    </div>
    )}

{showForm && ( 
    <div>
      <TextField
        label= "הסר כתובת מייל מהמאגר"
        variant="filled"
        value={deleteEmail}
        onChange={handleDeleteEmailChange}
        error={!isDeleteEmailValid}
        helperText={!isDeleteEmailValid ? 'כתובת מייל לא תקינה' : ''}
        sx={{
          "& label": {
            left: "unset",
            right: "1.75rem",
            transformOrigin: "right",
            fontSize: "0.8rem",
          },
          "& legend": {
            textAlign: "right",
            fontSize: "0.6rem",
          },
        }}
      />
      <button onClick={deleteEmailsDB} variant="contained" color="primary">
       הסר מייל
      </button>
    </div>
)}
    


    </div>
  );
};
