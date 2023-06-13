import axios from "axios";
import React, { useState, useEffect } from "react";
import { db } from "../../firebase_setup/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Grid, TextField, MenuItem, Modal, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import Swal from "sweetalert2";


export const EmailForm = ({ c, onClose }) => {
  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [city] = useState(c);
  const [email] = useState("");
  const [existingEmails, setExistingEmails] = useState([]);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [showForm, setShowForm] = useState(true);

  const handleExit = () => {
    setShowForm(false);

    // Call the callback function to notify the parent component
    if (typeof onClose === "function") {
      onClose();
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);

    // Call the callback function to notify the parent component
    if (typeof onClose === "function") {
      onClose();
    }
  };

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const q = query(collection(db, "DB"), where("city", "==", city));
        const querySnapshot = await getDocs(q);
        const emails = querySnapshot.docs.map((doc) => doc.data().mail);
        const roles = querySnapshot.docs.map((doc) => doc.data().role);

        const updatedEmails = emails
  .map((str, index) => {
    const role = roles[index]; // Get the role at the same index
    if (str.includes(",")) {
      const emailArray = str.split(",").map((email) => `${email} (${role})`);
      return emailArray;
    } else {
      return [`${str} (${role})`];
    }
  })
  .flat();

        setExistingEmails(updatedEmails);
      } catch (error) {
        console.error("Error fetching emails: ", error);
      }
    };

    fetchEmails();
  }, [city]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailValid || city === "") {
      return;
    }

    try {
      await axios.post("http://localhost:3001/ReportsTable", {
        recipients,
        subject,
        content,
      });

      // Show success alert
      Swal.fire({
        html: '<div dir="rtl">' + '<h1 dir="rtl">ההודעה נשלחה</h1>' + "</div>",
        icon: "success",
      });
      // Clear form fields
      setRecipients([]);
      setSubject("");
      setContent("");

      // Close the form
      setShowForm(false);
    } catch (error) {
      // Show error alert
      Swal.fire({
        html: '<div dir="rtl">' + '<h1 dir="rtl">קרתה תקלה בשליחת ההודעה!</h1>' + "</div>",
        icon: "error",
      });
    }
  };

  const handleRecipientChange = (e) => {
    let selectedValues = [];
    if (e.target.value !== "") {
      selectedValues = Array.isArray(e.target.value)
        ? e.target.value
        : [e.target.value];
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
  };


  const handleRecipientChangeBar = (e) => {
    let selectedValues = [];
    if (e.target.value !== "") {
      selectedValues = Array.isArray(e.target.value)
        ? e.target.value
        : [e.target.value];
    }

    const uniqueEmails = [];
    selectedValues.forEach((value) => {
      if (value) {
        const email = value.split("(")[0].trim();
        if (!uniqueEmails.includes(email)) {
          uniqueEmails.push(email);
        }
      }
    });
    setRecipients(uniqueEmails);
  };

  return (
    <div>
      <Modal open={showForm} onClose={handleCloseForm}>
        <div
          style={{
            margin:"10px",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
          }}
        >
          <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
            שלח מייל
            <Grid container direction="column" spacing={2} justifyContent="center" alignItems="center">
              {/* The city exists in the database */}
              {existingEmails.length > 0 && (
                <Grid item sx={{ width: "400px" }}>
                  <TextField
                    select
                    label="בחר כתובות אימייל מהמאגר"
                    variant="filled"
                    sx={{
                      width: "400px",
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
                    onChange={handleRecipientChangeBar}
                    fullWidth
                    SelectProps={{
                      multiple: true,
                    }}
                  >
                    <MenuItem disabled value="">
                      {/* <em>בחר כתובת אימייל מהמאגר</em> */}
                    </MenuItem>
                    {existingEmails
                      .filter((email) => email !== "")
                      .map((existingEmail) => (
                        <MenuItem key={existingEmail} value={existingEmail}>
                          {existingEmail}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
              )}

              <Grid item>
                <TextField
                  required
                  label="הזן כתובת אי מייל"
                  variant="filled"
                  placeholder="הזן כתובת"
                  inputProps={{ dir: "rtl" }}
                  sx={{
                    width: "400px",
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
                  multiline // Set multiline to true
                  error={!isEmailValid}
                  helperText={!isEmailValid ? "כתובת מייל לא תקינה" : ""}
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
                  inputProps={{ dir: "rtl" }}
                  sx={{
                    width: "400px",
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
                  label="תוכן ההודעה"
                  variant="filled"
                  color="success"
                  fullWidth
                  multiline
                  placeholder="תוכן הודעה"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  inputProps={{ dir: "rtl" }}
                  sx={{
                    width: "400px",
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
                <Button type="submit" variant="contained">
                  <ForwardToInboxIcon />
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={handleExit} variant="contained">
                  <CloseIcon />
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Modal>
    </div>
  );
};
