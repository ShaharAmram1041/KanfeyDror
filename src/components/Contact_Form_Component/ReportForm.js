import styles from './Form.module.css';

import { uid } from "uid";
// import styles from "./ReportFormStyle.module..css";
import { db } from "../../firebase_setup/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect, useRef } from "react";
import cities from "./cities.json";
// import * as React from 'react';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Paper, MenuItem, Select, InputLabel } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import randomatic from "randomatic";
import Moment from "react-moment";
import emailjs from "@emailjs/browser";
import axios from "axios";
import classes from "./ReportForm.scss";
import { useParams } from "react-router-dom";




export default function ReportForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [Class, setClass] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isAno, setIsAno] = useState(false);
  const [isNotAno, setIsNotAno] = useState(false);

  const [secretCode, setSecretCode] = useState(randomatic("Aa0", 8));
  const [schoolName, setSchoolName] = useState("");
  const [youthName, setYouthName] = useState("");
  const [otherPlace, setOtherPlace] = useState("");
  const treatment = "";
  const form = useRef();
  const { type } = useParams();

  const writeReportToDB = async (e) => {
    e.preventDefault();
    const uuid = secretCode;
    const date1 = new Date();
    const options = { day: "numeric", month: "numeric", year: "numeric" };
    const reportDate = date1.toLocaleDateString("en-GB", options);

    try {
      // Query Firestore to check if there is a document with the same UUID
      const querySnapshot = await getDocs(
        query(collection(db, "Reports"), where("uuid", "==", uuid))
      );

      // If a document with the same UUID is found, display an error message
      if (!querySnapshot.empty) {
        setSecretCode(randomatic("Aa0", 8));
        uuid = secretCode;
      }

      const docData = {
        name,
        email,
        message,
        city,
        place,
        reportDate,
        date,
        urgency: "דחוף",
        status: "בטיפול",
        uuid,
        treatment,
        schoolName,
        Class,
        youthName,
        otherPlace,
      };

      const docRef = await addDoc(collection(db, "Reports"), docData);

      // alert("Report added successfully!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleRecipientChange = (e) => {
    setEmail(e.target.value);
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    setIsEmailValid(emailRegex.test(e.target.value));
  };

  const handleSendReport = async (e) => {
    e.preventDefault();
    await writeReportToDB(e);
    if (secretCode !== "")
      toast(
        <div dir="rtl">
          <p>כל הכבוד על הדיווח! זהו הקוד הסודי שלך: {secretCode}</p>
          <p>נשמח להציע מספר פעולות שאפשר לעשות כבר עכשיו</p>
          <ul>
            <li>
              פנייה פרטית למוחרם – להגיד לו בסודיות שאתה לא חלק מהחרם הזה ושלא
              כולם נגדו
            </li>
            <li>
              הזמנה לפעילות: הזמן את הילד לפעילות או משחק כלשהו. אפשר גם אחרי
              שעות הבית ספר בבית שלו או במגרש השכונתי
            </li>
            <li>
              שתף חברים קרובים: תשתף את החברים שאתה מאמין שיכולים לעזור ולהועיל
              ויחד תגשו לילד המוחרם
            </li>
            <li>שתף מורה או הורה</li>
          </ul>
        </div>,
        {
          autoClose: false, // Disable automatic closing of this specific toast
          closeButton: true, // Show the close button on this toast
        }
      );
    setSecretCode(randomatic("Aa0", 8));
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_vrmu408",
        "template_tyq21ol",
        form.current,
        "QGS3yboIL2bq4kMnz"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );

    if (email !== "" && isEmailValid) {
      const message =
        "תודה על פנייתך! הקוד הסודי שלך למעקב אחרי הפנייה הוא: " + secretCode;
      console.log(message);
      let recipients = [email];

      try {
        await axios.post("http://localhost:3001/ReportsTable", {
          recipients,
          subject: "קוד סודי",
          content: message,
        });

        // Show success alert
        alert("ההודעה נשלחה בהצלחה");
        // Clear form fields
      } catch (error) {
        // Show error alert
        alert("ההודעה לא נשלחה");
        console.error("Error sending email:", error);
      }
    }
  };

  const handleOpenAnoForm = () => {
    setIsAno((isAno) => !isAno);
    setIsNotAno(false);
  };

  const handleOpenNotAnoForm = () => {
    setIsNotAno((isNotAno) => !isNotAno);
    setIsAno(false);
  };

  return (
    <div className={`${classes.center_question} ${classes.report_form}`}>

     {type === "anonymous" ? (
           <div className="full-page-form">
           <Paper
             elevation={3}
             style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}
             dir="rtl"
           >
             <form
               ref={form}
               onSubmit={(event) => {
                 sendEmail(event);
                 handleSendReport(event);
                 setTimeout(() => {
                   setIsAno(false); // Close the form after 2 seconds
                 }, 2000);
               }}
             >
               {" "}
               <Grid
                 container
                 spacing={3}
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
               >
                 <Grid item xs={12}>
                   <TextField
                     select
                     required
                     label="באיזה עיר החרם התרחש?"
                     fullWidth
                     variant="standard"
                     value={city}
                     onChange={(e) => setCity(e.target.value)}
                   >
                     <MenuItem dir="rtl" value="">
                       <em>בחר עיר</em>
                     </MenuItem>
                     {cities
                       .filter((city) => city !== "")
                       .map((city) => (
                         <MenuItem dir="rtl" key={city.name} value={city.name}>
                           {city.name}
                         </MenuItem>
                       ))}
                   </TextField>
                 </Grid>
 
                 <Grid item xs={12}>
                   <TextField
                     select
                     dir="rtl"
                     required
                     label="יודעים באיזה מסגרת?"
                     placeholder="בחר מסגרת"
                     fullWidth
                     variant="standard"
                     value={place}
                     onChange={(e) => setPlace(e.target.value)}
                   >
                     <MenuItem dir="rtl" value="בית ספר">
                       בית ספר
                     </MenuItem>
                     <MenuItem dir="rtl" value="תנועת נוער">
                       תנועת נוער
                     </MenuItem>
                     <MenuItem dir="rtl" value="אחר">
                       אחר
                     </MenuItem>
                   </TextField>
                 </Grid>
 
                 {/* school */}
                 {place === "בית ספר" && (
                   <Grid
                     container
                     spacing={3}
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
                   >
                     <Grid item xs={12}>
                       <TextField
                         dir="rtl"
                         required
                         label="שם בית הספר"
                         fullWidth
                         variant="standard"
                         value={schoolName}
                         onChange={(e) => setSchoolName(e.target.value)}
                       ></TextField>
                     </Grid>
 
                     <Grid item xs={12}>
                       <TextField
                         select
                         required
                         label="כיתה"
                         placeholder="כיתה"
                         value={Class}
                         fullWidth
                         variant="standard"
                         onChange={(e) => setClass(e.target.value)}
                       >
                         <MenuItem dir="rtl" value="כיתה א">
                           כיתה א
                         </MenuItem>
                         <MenuItem dir="rtl" value="כיתה ב">
                           כיתה ב
                         </MenuItem>
                         <MenuItem dir="rtl" value="כיתה ג">
                           כיתה ג
                         </MenuItem>
                         <MenuItem dir="rtl" value="כיתה ד">
                           כיתה ד
                         </MenuItem>
                         <MenuItem dir="rtl" value="כיתה ה">
                           כיתה ה
                         </MenuItem>
                         <MenuItem dir="rtl" value="כיתה ו">
                           כיתה ו
                         </MenuItem>
                         <MenuItem dir="rtl" value="כיתה ז">
                           כיתה ז
                         </MenuItem>
                         <MenuItem dir="rtl" value="כיתה ח">
                           כיתה ח
                         </MenuItem>
                         <MenuItem dir="rtl" value="כיתה ט">
                           כיתה ט
                         </MenuItem>
                         <MenuItem dir="rtl" value="כיתה י">
                           כיתה י
                         </MenuItem>
                         <MenuItem dir="rtl" value="כיתה יא">
                           כיתה יא
                         </MenuItem>
                         <MenuItem dir="rtl" value="כיתה יב">
                           כיתה יב
                         </MenuItem>
                       </TextField>
                     </Grid>
                   </Grid>
                 )}
                 {/* youth */}
                 {place === "תנועת נוער" && (
                   <Grid item xs={12}>
                     <TextField
                       dir="rtl"
                       required
                       label="שם תנועת הנוער"
                       fullWidth
                       variant="standard"
                       value={youthName}
                       onChange={(e) => setYouthName(e.target.value)}
                     ></TextField>
                   </Grid>
                 )}
                 {/* other */}
                 {place === "אחר" && (
                   <Grid item xs={12}>
                     <TextField
                       dir="rtl"
                       required
                       label="אחר"
                       fullWidth
                       variant="standard"
                       value={otherPlace}
                       onChange={(e) => setOtherPlace(e.target.value)}
                     ></TextField>
                   </Grid>
                 )}
 
                 <Grid item xs={12}>
                   <TextField
                     label="באיזה תאריך החרם קרה?"
                     type="date"
                     value={date}
                     fullWidth
                     variant="standard"
                     onChange={(e) => setDate(e.target.value)}
                     inputProps={{
                       className: { paddingRight: "230px" },
                     }}
                   />
                 </Grid>
 
                 <Grid item xs={12}>
                   <TextField
                     required
                     label="תיאור קצר של המקרה:"
                     placeholder="כתוב את התוכן כאן"
                     value={message}
                     dir="rtl"
                     onChange={(e) => setMessage(e.target.value)}
                     fullWidth
                     multiline
                     variant="standard"
                   />
                 </Grid>
                 <Grid item>
                   <button type="submit" variant="contained">
                     שלח דיווח
                   </button>
                 </Grid>
               </Grid>
             </form>
           </Paper>
         </div>
    ) : (
      <div className="full-page-form">
      <Paper
        elevation={3}
        style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}
        dir="rtl"
      >
        <form
          ref={form}
          onSubmit={(event) => {
            sendEmail(event);
            handleSendReport(event);
            setTimeout(() => {
              setIsNotAno(false); // Close the form after 2 seconds
            }, 2000);
          }}
        >
          {" "}
          <Grid
            container
            spacing={3}
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
          >
            <Grid item xs={12} sm={6}>
              <TextField
                label="שם"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                variant="standard"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="כתובת אימייל"
                placeholder="כתוב את התוכן כאן"
                value={email}
                dir="ltr"
                fullWidth
                multiline
                variant="standard"
                onChange={handleRecipientChange}
                error={!isEmailValid && email !== ""}
                helperText={!isEmailValid ? "כתובת מייל לא תקינה" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                required
                label="באיזה עיר החרם התרחש?"
                fullWidth
                variant="standard"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <MenuItem dir="rtl" value="">
                  <em>בחר עיר</em>
                </MenuItem>
                {cities
                  .filter((city) => city !== "")
                  .map((city) => (
                    <MenuItem dir="rtl" key={city.name} value={city.name}>
                      {city.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                dir="rtl"
                required
                label="יודעים באיזה מסגרת?"
                placeholder="בחר מסגרת"
                fullWidth
                variant="standard"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
              >
                <MenuItem dir="rtl" value="בית ספר">
                  בית ספר
                </MenuItem>
                <MenuItem dir="rtl" value="תנועת נוער">
                  תנועת נוער
                </MenuItem>
                <MenuItem dir="rtl" value="אחר">
                  אחר
                </MenuItem>
              </TextField>
            </Grid>

            {/* school */}
            {place === "בית ספר" && (
              <Grid
                container
                spacing={3}
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
              >
                <Grid item xs={12}>
                  <TextField
                    dir="rtl"
                    required
                    label="שם בית הספר"
                    fullWidth
                    variant="standard"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                  ></TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    select
                    required
                    label="כיתה"
                    placeholder="כיתה"
                    value={Class}
                    fullWidth
                    variant="standard"
                    onChange={(e) => setClass(e.target.value)}
                  >
                    <MenuItem dir="rtl" value="כיתה א">
                      כיתה א
                    </MenuItem>
                    <MenuItem dir="rtl" value="כיתה ב">
                      כיתה ב
                    </MenuItem>
                    <MenuItem dir="rtl" value="כיתה ג">
                      כיתה ג
                    </MenuItem>
                    <MenuItem dir="rtl" value="כיתה ד">
                      כיתה ד
                    </MenuItem>
                    <MenuItem dir="rtl" value="כיתה ה">
                      כיתה ה
                    </MenuItem>
                    <MenuItem dir="rtl" value="כיתה ו">
                      כיתה ו
                    </MenuItem>
                    <MenuItem dir="rtl" value="כיתה ז">
                      כיתה ז
                    </MenuItem>
                    <MenuItem dir="rtl" value="כיתה ח">
                      כיתה ח
                    </MenuItem>
                    <MenuItem dir="rtl" value="כיתה ט">
                      כיתה ט
                    </MenuItem>
                    <MenuItem dir="rtl" value="כיתה י">
                      כיתה י
                    </MenuItem>
                    <MenuItem dir="rtl" value="כיתה יא">
                      כיתה יא
                    </MenuItem>
                    <MenuItem dir="rtl" value="כיתה יב">
                      כיתה יב
                    </MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            )}
            {/* youth */}
            {place === "תנועת נוער" && (
              <Grid item xs={12}>
                <TextField
                  dir="rtl"
                  required
                  label="שם תנועת הנוער"
                  fullWidth
                  variant="standard"
                  value={youthName}
                  onChange={(e) => setYouthName(e.target.value)}
                ></TextField>
              </Grid>
            )}
            {/* other */}
            {place === "אחר" && (
              <Grid item xs={12}>
                <TextField
                  dir="rtl"
                  required
                  label="אחר"
                  fullWidth
                  variant="standard"
                  value={otherPlace}
                  onChange={(e) => setOtherPlace(e.target.value)}
                ></TextField>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                label="באיזה תאריך החרם קרה?"
                type="date"
                value={date}
                fullWidth
                variant="standard"
                onChange={(e) => setDate(e.target.value)}
                inputProps={{
                  className: { paddingRight: "230px" },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                label="תיאור קצר של המקרה:"
                placeholder="כתוב את התוכן כאן"
                value={message}
                dir="rtl"
                onChange={(e) => setMessage(e.target.value)}
                fullWidth
                multiline
                variant="standard"
              />
            </Grid>

            <Grid item>
              <button type="submit" variant="contained">
                שלח דיווח
              </button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
    )} 
      <ToastContainer
        className="custom-toast-container" // Apply the custom CSS class
        autoClose={false}
        closeButton={true}
        hideProgressBar={true}
      />
    </div>
  );
}


//   return (
//     <div className={styles.container}>
//       <form className={styles.form}>
//         <h1 className={styles.title}></h1>
//         <div>
//           <label htmlFor="name">?באיזה עיר קרה המקרה</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             required
            
//           />
//         </div>
//         <div className={styles.inputs}>
//           <div>
//             <label htmlFor="email">?יודעים באיזה עיר</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="johndoe@example.io"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="purpose">Purpose</label>
//             <select name="purpose" id="purpose">
//               <option value="" selected disabled required>
//                 Select one
//               </option>
//               <option value="Web Development">Web Development</option>
//               <option value="App Development">App Development</option>
//               <option value="Query / Question">Query / Question</option>
//               <option value="Feedback / Message">Feedback / Message</option>
//             </select>
//           </div>
//         </div>
//         <div>
//           <label htmlFor="message">Message</label>
//           <textarea
//             name="message"
//             id="message"
//             rows="5"
//             placeholder="Hi there!"
//             required
//           ></textarea>
//         </div>
//         <button className={styles.btn} type="submit">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// }

  // return (
  //   <div>
  //     <Paper
  //       elevation={3}
  //       style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}
  //       dir="rtl"
  //     >
  //       <React.Fragment>
  //         <Typography variant="h3" gutterBottom>
  //           אני רוצה לדווח על חרם!
  //         </Typography>
  //         <button className="anonymus" onClick={() => setIsAno(true)}>
  //           אנונימי
  //         </button>
  //         <button className="notAno" onClick={() => setIsAno(false)}>
  //           לא אנונימי
  //         </button>
  //       </React.Fragment>
  //     </Paper>

  //     {/* is anonymous */}
  //     {isFormVisible && isAno === true && isAno !== null && (
  //       <div className="full-page-form">
  //         <Paper
  //           elevation={3}
  //           style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}
  //           dir="rtl"
  //         >
  //           <form
  //             ref={form}
  //             onSubmit={(event) => {
  //               sendEmail(event);
  //               handleSendReport(event);
  //               setTimeout(() => {
  //                 setFormVisible(false); // Close the form after 2 seconds
  //               }, 2000);
  //             }}
  //           >
  //             {" "}
  //             <Grid
  //               container
  //               spacing={3}
  //               sx={{
  //                 width: "400px",
  //                 "& label": {
  //                   left: "unset",
  //                   right: "2.75rem",
  //                   transformOrigin: "right",
  //                   fontSize: "0.8rem",
  //                 },
  //                 "& legend": {
  //                   textAlign: "left",
  //                   fontSize: "0.6rem",
  //                 },
  //               }}
  //             >
  //               <Grid item xs={12}>
  //                 <TextField
  //                   select
  //                   required
  //                   label="באיזה עיר החרם התרחש?"
  //                   fullWidth
  //                   variant="standard"
  //                   value={city}
  //                   onChange={(e) => setCity(e.target.value)}
  //                 >
  //                   <MenuItem dir="rtl" value="">
  //                     <em>בחר עיר</em>
  //                   </MenuItem>
  //                   {cities
  //                     .filter((city) => city !== "")
  //                     .map((city) => (
  //                       <MenuItem dir="rtl" key={city.name} value={city.name}>
  //                         {city.name}
  //                       </MenuItem>
  //                     ))}
  //                 </TextField>
  //               </Grid>

  //               <Grid item xs={12}>
  //                 <TextField
  //                   select
  //                   dir="rtl"
  //                   required
  //                   label="יודעים באיזה מסגרת?"
  //                   placeholder="בחר מסגרת"
  //                   fullWidth
  //                   variant="standard"
  //                   value={place}
  //                   onChange={(e) => setPlace(e.target.value)}
  //                 >
  //                   <MenuItem dir="rtl" value="בית ספר">
  //                     בית ספר
  //                   </MenuItem>
  //                   <MenuItem dir="rtl" value="תנועת נוער">
  //                     תנועת נוער
  //                   </MenuItem>
  //                   <MenuItem dir="rtl" value="אחר">
  //                     אחר
  //                   </MenuItem>
  //                 </TextField>
  //               </Grid>

  //               {/* school */}
  //               {place === "בית ספר" && (
  //                 <Grid
  //                   container
  //                   spacing={3}
  //                   sx={{
  //                     width: "400px",
  //                     "& label": {
  //                       left: "unset",
  //                       right: "2.75rem",
  //                       transformOrigin: "right",
  //                       fontSize: "0.8rem",
  //                     },
  //                     "& legend": {
  //                       textAlign: "left",
  //                       fontSize: "0.6rem",
  //                     },
  //                   }}
  //                 >
  //                   <Grid item xs={12}>
  //                     <TextField
  //                       dir="rtl"
  //                       required
  //                       label="שם בית הספר"
  //                       fullWidth
  //                       variant="standard"
  //                       value={schoolName}
  //                       onChange={(e) => setSchoolName(e.target.value)}
  //                     ></TextField>
  //                   </Grid>

  //                   <Grid item xs={12}>
  //                     <TextField
  //                       select
  //                       required
  //                       label="כיתה"
  //                       placeholder="כיתה"
  //                       value={Class}
  //                       fullWidth
  //                       variant="standard"
  //                       onChange={(e) => setClass(e.target.value)}
  //                     >
  //                       <MenuItem dir="rtl" value="כיתה א">
  //                         כיתה א
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה ב">
  //                         כיתה ב
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה ג">
  //                         כיתה ג
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה ד">
  //                         כיתה ד
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה ה">
  //                         כיתה ה
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה ו">
  //                         כיתה ו
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה ז">
  //                         כיתה ז
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה ח">
  //                         כיתה ח
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה ט">
  //                         כיתה ט
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה י">
  //                         כיתה י
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה יא">
  //                         כיתה יא
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה יב">
  //                         כיתה יב
  //                       </MenuItem>
  //                     </TextField>
  //                   </Grid>
  //                 </Grid>
  //               )}
  //               {/* youth */}
  //               {place === "תנועת נוער" && (
  //                 <Grid item xs={12}>
  //                   <TextField
  //                     dir="rtl"
  //                     required
  //                     label="שם תנועת הנוער"
  //                     fullWidth
  //                     variant="standard"
  //                     value={youthName}
  //                     onChange={(e) => setYouthName(e.target.value)}
  //                   ></TextField>
  //                 </Grid>
  //               )}
  //               {/* other */}
  //               {place === "אחר" && (
  //                 <Grid item xs={12}>
  //                   <TextField
  //                     dir="rtl"
  //                     required
  //                     label="אחר"
  //                     fullWidth
  //                     variant="standard"
  //                     value={otherPlace}
  //                     onChange={(e) => setOtherPlace(e.target.value)}
  //                   ></TextField>
  //                 </Grid>
  //               )}

  //               <Grid item xs={12}>
  //                 <TextField
  //                   label="באיזה תאריך החרם קרה?"
  //                   type="date"
  //                   value={date}
  //                   fullWidth
  //                   variant="standard"
  //                   onChange={(e) => setDate(e.target.value)}
  //                   inputProps={{
  //                     style: { paddingRight: "230px" },
  //                   }}
  //                 />
  //               </Grid>

  //               <Grid item xs={12}>
  //                 <TextField
  //                   required
  //                   label="תיאור קצר של המקרה:"
  //                   placeholder="כתוב את התוכן כאן"
  //                   value={message}
  //                   dir="rtl"
  //                   onChange={(e) => setMessage(e.target.value)}
  //                   fullWidth
  //                   multiline
  //                   variant="standard"
  //                 />
  //               </Grid>
  //               <Grid item>
  //                 <button type="submit" variant="contained">
  //                   שלח דיווח
  //                 </button>
  //               </Grid>
  //             </Grid>
  //           </form>
  //         </Paper>
  //       </div>
  //     )}

  //     {/* is not anonymous */}
  //     {isFormVisible && !isAno && isAno !== null && (
  //       <div className="full-page-form">
  //         <Paper
  //           elevation={3}
  //           style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}
  //           dir="rtl"
  //         >
  //           <form
  //             ref={form}
  //             onSubmit={(event) => {
  //               sendEmail(event);
  //               handleSendReport(event);
  //               setTimeout(() => {
  //                 setFormVisible(false); // Close the form after 2 seconds
  //               }, 2000);
  //             }}
  //           >
  //             {" "}
  //             <Grid
  //               container
  //               spacing={3}
  //               sx={{
  //                 width: "400px",
  //                 "& label": {
  //                   left: "unset",
  //                   right: "2.75rem",
  //                   transformOrigin: "right",
  //                   fontSize: "0.8rem",
  //                 },
  //                 "& legend": {
  //                   textAlign: "left",
  //                   fontSize: "0.6rem",
  //                 },
  //               }}
  //             >
  //               <Grid item xs={12} sm={6}>
  //                 <TextField
  //                   label="שם"
  //                   value={name}
  //                   onChange={(e) => setName(e.target.value)}
  //                   fullWidth
  //                   variant="standard"
  //                 />
  //               </Grid>

  //               <Grid item xs={12}>
  //                 <TextField
  //                   label="כתובת אימייל"
  //                   placeholder="כתוב את התוכן כאן"
  //                   value={email}
  //                   dir="ltr"
  //                   fullWidth
  //                   multiline
  //                   variant="standard"
  //                   onChange={handleRecipientChange}
  //                   error={!isEmailValid && email !== ""}
  //                   helperText={!isEmailValid ? "כתובת מייל לא תקינה" : ""}
  //                 />
  //               </Grid>
  //               <Grid item xs={12}>
  //                 <TextField
  //                   select
  //                   required
  //                   label="באיזה עיר החרם התרחש?"
  //                   fullWidth
  //                   variant="standard"
  //                   value={city}
  //                   onChange={(e) => setCity(e.target.value)}
  //                 >
  //                   <MenuItem dir="rtl" value="">
  //                     <em>בחר עיר</em>
  //                   </MenuItem>
  //                   {cities
  //                     .filter((city) => city !== "")
  //                     .map((city) => (
  //                       <MenuItem dir="rtl" key={city.name} value={city.name}>
  //                         {city.name}
  //                       </MenuItem>
  //                     ))}
  //                 </TextField>
  //               </Grid>

  //               <Grid item xs={12}>
  //                 <TextField
  //                   select
  //                   dir="rtl"
  //                   required
  //                   label="יודעים באיזה מסגרת?"
  //                   placeholder="בחר מסגרת"
  //                   fullWidth
  //                   variant="standard"
  //                   value={place}
  //                   onChange={(e) => setPlace(e.target.value)}
  //                 >
  //                   <MenuItem dir="rtl" value="בית ספר">
  //                     בית ספר
  //                   </MenuItem>
  //                   <MenuItem dir="rtl" value="תנועת נוער">
  //                     תנועת נוער
  //                   </MenuItem>
  //                   <MenuItem dir="rtl" value="אחר">
  //                     אחר
  //                   </MenuItem>
  //                 </TextField>
  //               </Grid>

  //               {/* school */}
  //               {place === "בית ספר" && (
  //                 <Grid
  //                   container
  //                   spacing={3}
  //                   sx={{
  //                     width: "400px",
  //                     "& label": {
  //                       left: "unset",
  //                       right: "2.75rem",
  //                       transformOrigin: "right",
  //                       fontSize: "0.8rem",
  //                     },
  //                     "& legend": {
  //                       textAlign: "left",
  //                       fontSize: "0.6rem",
  //                     },
  //                   }}
  //                 >
  //                   <Grid item xs={12}>
  //                     <TextField
  //                       dir="rtl"
  //                       required
  //                       label="שם בית הספר"
  //                       fullWidth
  //                       variant="standard"
  //                       value={schoolName}
  //                       onChange={(e) => setSchoolName(e.target.value)}
  //                     ></TextField>
  //                   </Grid>

  //                   <Grid item xs={12}>
  //                     <TextField
  //                       select
  //                       required
  //                       label="כיתה"
  //                       placeholder="כיתה"
  //                       value={Class}
  //                       fullWidth
  //                       variant="standard"
  //                       onChange={(e) => setClass(e.target.value)}
  //                     >
  //                       <MenuItem dir="rtl" value="כיתה א">
  //                         כיתה א
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה ב">
  //                         כיתה ב
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה ג">
  //                         כיתה ג
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה ד">
  //                         כיתה ד
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה ה">
  //                         כיתה ה
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה ו">
  //                         כיתה ו
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה ז">
  //                         כיתה ז
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה ח">
  //                         כיתה ח
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה ט">
  //                         כיתה ט
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה י">
  //                         כיתה י
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה יא">
  //                         כיתה יא
  //                       </MenuItem>
  //                       <MenuItem dir="rtl" value="כיתה יב">
  //                         כיתה יב
  //                       </MenuItem>
  //                     </TextField>
  //                   </Grid>
  //                 </Grid>
  //               )}
  //               {/* youth */}
  //               {place === "תנועת נוער" && (
  //                 <Grid item xs={12}>
  //                   <TextField
  //                     dir="rtl"
  //                     required
  //                     label="שם תנועת הנוער"
  //                     fullWidth
  //                     variant="standard"
  //                     value={youthName}
  //                     onChange={(e) => setYouthName(e.target.value)}
  //                   ></TextField>
  //                 </Grid>
  //               )}
  //               {/* other */}
  //               {place === "אחר" && (
  //                 <Grid item xs={12}>
  //                   <TextField
  //                     dir="rtl"
  //                     required
  //                     label="אחר"
  //                     fullWidth
  //                     variant="standard"
  //                     value={otherPlace}
  //                     onChange={(e) => setOtherPlace(e.target.value)}
  //                   ></TextField>
  //                 </Grid>
  //               )}

  //               <Grid item xs={12}>
  //                 <TextField
  //                   label="באיזה תאריך החרם קרה?"
  //                   type="date"
  //                   value={date}
  //                   fullWidth
  //                   variant="standard"
  //                   onChange={(e) => setDate(e.target.value)}
  //                   inputProps={{
  //                     style: { paddingRight: "230px" },
  //                   }}
  //                 />
  //               </Grid>

  //               <Grid item xs={12}>
  //                 <TextField
  //                   required
  //                   label="תיאור קצר של המקרה:"
  //                   placeholder="כתוב את התוכן כאן"
  //                   value={message}
  //                   dir="rtl"
  //                   onChange={(e) => setMessage(e.target.value)}
  //                   fullWidth
  //                   multiline
  //                   variant="standard"
  //                 />
  //               </Grid>

  //               <Grid item>
  //                 <button type="submit" variant="contained">
  //                   שלח דיווח
  //                 </button>
  //               </Grid>
  //             </Grid>
  //           </form>
  //         </Paper>
  //       </div>
  //     )}

  //     <ToastContainer
  //       className="custom-toast-container" // Apply the custom CSS class
  //       autoClose={false}
  //       closeButton={true}
  //       hideProgressBar={true}
  //     />

  //     <div>אנשי קשר רלוונטיים: - כנפי דרור: - מוקד 105:</div>
  //   </div>
  // );

