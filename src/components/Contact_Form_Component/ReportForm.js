import { db } from "../../firebase_setup/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useRef } from "react";
import cities from "./cities.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import randomatic from "randomatic";
import emailjs from "@emailjs/browser";
import axios from "axios";
import AnonImg from "../../photos/AnonymusImg.jpg";
import nonAnonImg from "../../photos/NotAnonymousImg.webp";
import Select from "react-select";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./ReportForm.module.scss";
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
      let recipients = [email];

      try {
        await axios.post("http://localhost:3001/ReportsTable", {
          recipients,
          subject: "קוד סודי",
          content: message,
        });

        // Show success alert
        toast.success("תודה על הפנייה! מספר מעקב נשלח אליך למייל ", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
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
    setCity("");
    setName("");
    setEmail("");
    setMessage("");
    setPlace("");
    setDate("");
    setClass("");
    setIsEmailValid(false);
    setSchoolName("");
    setYouthName("");
    setOtherPlace("");
  };

  const handleOpenNotAnoForm = () => {
    setIsNotAno((isNotAno) => !isNotAno);
    setIsAno(false);
    setCity("");
    setName("");
    setEmail("");
    setMessage("");
    setPlace("");
    setDate("");
    setClass("");
    setIsEmailValid(false);
    setSchoolName("");
    setYouthName("");
    setOtherPlace("");
  };
  return (
    <div className="reportPart">
      <section
        className={classes.section}
        style={{ display: isAno || isNotAno ? "none" : "block" }}
      >
        <h2>אני רוצה לדווח על חרם!</h2>
        <div className={classes.section__button_container}>
          <div className={classes.button_row}>
            <button
              className={`${classes.section__button} ${classes.section__button.anonymous}`}
              onClick={handleOpenAnoForm}
            >
              <img src={AnonImg} alt="דיווח אנונימי" />
            </button>
            <div className={classes.section__button_text}>אנונימי</div>
          </div>
          <div className={classes.button_row}>
            <button
              className={`${classes.section__button} ${classes.section__button.not_anonymous}`}
              onClick={handleOpenNotAnoForm}
            >
              <img src={nonAnonImg} alt="דיווח לא אנונימי" />
            </button>
            <div className={classes.section__button_text}>לא אנונימי</div>
          </div>
        </div>
      </section>

      {isAno && isAno === true && isAno !== null && (
        <div>
          <h2>אנונימי</h2>
          <form
            className={`${classes.anonyForm} ${!isAno ? classes.hidden : ""}`}
            ref={form}
            onSubmit={(event) => {
              sendEmail(event);
              handleSendReport(event);
              setTimeout(() => {
                setIsAno(false); // Close the form after 2 seconds
              }, 2000);
            }}
          >
            <button
              className={classes.showSectionButton}
              type="button"
              onClick={() => setIsAno(false)} // Set isAno to false when the button is clicked
            >
              <CloseIcon />
            </button>

            <label className={classes.labell}>באיזו עיר החרם התרחש?</label>
            <Select
              defaultValue={city}
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary25: "hotpink",
                  primary: "black",
                },
              })}
              className={classes.formControl}
              value={city}
              onChange={(option) => setCity(option.value)}
              styles={{
                control: (provided) => ({
                  ...provided,
                  border: "none",
                  boxShadow: "none",
                  minHeight: "1px", // Use minHeight instead of height to ensure the input is visible
                }),
              }}
              options={cities
                .filter((city) => city !== "")
                .map((city) => ({
                  value: city.name,
                  label: city.name,
                }))}
              placeholder={city} // Add your desired placeholder text here
            />
            <label className={classes.labell}>באיזו מסגרת?</label>
            <select
              className={classes.formControl}
              required
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            >
              <option value="" disabled defaultValue="">
                בחר מסגרת
              </option>
              <option value="אחר">אחר</option>
              <option value="בית ספר">בית ספר</option>
              <option value="תנועת נוער">תנועת נוער</option>
            </select>

            {place === "בית ספר" && (
              <>
                <label className={classes.labell}>שם בית הספר</label>
                <input
                  className={classes.formControl}
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                />

                <label className={classes.labell}>כיתה</label>
                <select
                  className={classes.formControl}
                  required
                  value={Class}
                  onChange={(e) => setClass(e.target.value)}
                >
                  <option value="כיתה א">כיתה א</option>
                  <option value="כיתה ב">כיתה ב</option>
                  <option value="כיתה ג">כיתה ג</option>
                  <option value="כיתה ד">כיתה ד</option>
                  <option value="כיתה ה">כיתה ה</option>
                  <option value="כיתה ו">כיתה ו</option>
                  <option value="כיתה ז">כיתה ז</option>
                  <option value="כיתה ח">כיתה ח</option>
                  <option value="כיתה ט">כיתה ט</option>
                  <option value="כיתה י">כיתה י</option>
                  <option value="כיתה יא">כיתה יא</option>
                  <option value="כיתה יב">כיתה יב</option>{" "}
                </select>
              </>
            )}
            {place === "תנועת נוער" && (
              <>
                <label className={classes.labell}>שם תנועת הנוער</label>
                <input
                  className={classes.formControl}
                  type="text"
                  required
                  value={youthName}
                  onChange={(e) => setYouthName(e.target.value)}
                />
              </>
            )}
            {place === "אחר" && (
              <>
                <label className={classes.labell}>אחר</label>
                <input
                  className={classes.formControl}
                  type="text"
                  required
                  value={otherPlace}
                  onChange={(e) => setOtherPlace(e.target.value)}
                />
              </>
            )}
            <label className={classes.labell}>כמה זמן החרם מתמשך?</label>
            <select
              className={classes.formControl}
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            >
              <option value="יום">יום</option>
              <option value="שבוע">שבוע </option>
              <option value="חודש">חודש </option>
              <option value="כמה חודשים">כמה חודשים </option>
              <option value="שנה">שנה</option>
              <option value="מעל שנה">מעל שנה</option>

              <option value="אני לא יודע">אני לא יודע</option>
            </select>

            <label className={classes.labell}>תיאור קצר של המקרה:</label>
            <textarea
              className={classes.formControl}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button className={classes.submitButton} type="submit">
              שלח דיווח
            </button>
          </form>
        </div>
      )}

      {/* is not anonymous */}
      {isNotAno && !isAno && isAno !== null && (
        <div>
          <h2>לא אנונימי</h2>
          <form
            className={`${classes.isNotAnonynousForm} ${
              isNotAno.hidden ? "" : ""
            }`}
            ref={form}
            onSubmit={(event) => {
              sendEmail(event);
              handleSendReport(event);
              setTimeout(() => {
                setIsNotAno(false); // Close the form after 2 seconds
              }, 2000);
            }}
          >
            <button
              type="button"
              onClick={() => setIsNotAno(false)} // Set isNotAno to false when the button is clicked
              className={classes.showSectionButton}
            >
              <CloseIcon />
            </button>
            <div className={`${classes.nameAndMail}`}>
              <label className={classes.labelll}>שם</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={classes.input}
                required
              />

              <label className={classes.labelll}>כתובת אימייל</label>
              <input
                type="email"
                value={email}
                onChange={handleRecipientChange}
                className={classes.input}
                required
              />
              {!isEmailValid && email !== "" && (
                <p className={classes.invalidEmail}>כתובת מייל לא תקינה</p>
              )}
            </div>
            <label className={classes.labelll}>באיזו עיר החרם התרחש?</label>
            <Select
              defaultValue={city}
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary25: "hotpink",
                  primary: "black",
                },
              })}
              className={classes.formControl}
              value={city}
              onChange={(option) => setCity(option.value)}
              styles={{
                control: (provided) => ({
                  ...provided,
                  border: "none",
                  boxShadow: "none",
                  minHeight: "1px", // Use minHeight instead of height to ensure the input is visible
                }),
              }}
              options={cities
                .filter((city) => city !== "")
                .map((city) => ({
                  value: city.name,
                  label: city.name,
                }))}
              placeholder={city} // Add your desired placeholder text here
            />

            <label className={classes.labelll}>באיזו מסגרת?</label>
            <select
              className={classes.formControl}
              required
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            >
              <option value="" disabled defaultValue="">
                בחר מסגרת
              </option>
              <option value="אחר">אחר</option>
              <option value="בית ספר">בית ספר</option>
              <option value="תנועת נוער">תנועת נוער</option>
            </select>

            {place === "בית ספר" && (
              <>
                <label className={classes.label}>שם בית הספר</label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className={classes.input}
                />

                <label className={classes.label}>כיתה</label>
                <select
                  required
                  value={Class}
                  onChange={(e) => setClass(e.target.value)}
                  className={classes.formControl}
                >
                  <option value="כיתה א">כיתה א</option>
                  <option value="כיתה ב">כיתה ב</option>
                  <option value="כיתה ג">כיתה ג</option>
                  <option value="כיתה ד">כיתה ד</option>
                  <option value="כיתה ה">כיתה ה</option>
                  <option value="כיתה ו">כיתה ו</option>
                  <option value="כיתה ז">כיתה ז</option>
                  <option value="כיתה ח">כיתה ח</option>
                  <option value="כיתה ט">כיתה ט</option>
                  <option value="כיתה י">כיתה י</option>
                  <option value="כיתה יא">כיתה יא</option>
                  <option value="כיתה יב">כיתה יב</option>
                </select>
              </>
            )}

            {place === "תנועת נוער" && (
              <>
                <label className={classes.label}>שם תנועת הנוער</label>
                <input
                  type="text"
                  required
                  value={youthName}
                  onChange={(e) => setYouthName(e.target.value)}
                  className={classes.input}
                />
              </>
            )}

            {place === "אחר" && (
              <>
                <label className={classes.label}>אחר</label>
                <input
                  type="text"
                  required
                  value={otherPlace}
                  onChange={(e) => setOtherPlace(e.target.value)}
                  className={classes.input}
                />
              </>
            )}

            <label className={classes.labelll}>כמה זמן החרם מתמשך?</label>
            <select
              className={classes.formControl}
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            >
              <option value="יום">יום</option>
              <option value="שבוע">שבוע </option>
              <option value="חודש">חודש </option>
              <option value="כמה חודשים">כמה חודשים </option>
              <option value="שנה">שנה</option>
              <option value="מעל שנה">מעל שנה</option>
              <option value="אני לא יודע">אני לא יודע</option>
            </select>

            <label className={classes.labelll}>תיאור קצר של המקרה:</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={classes.textarea}
            ></textarea>

            <button type="submit" className={classes.submitButton}>
              שלח דיווח
            </button>
          </form>
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
