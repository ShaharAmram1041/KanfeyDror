import React, { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";
import classes from "./AddAdministrator.module.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";


export default function AddAdministrator() {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("");

  useEffect(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value.toLowerCase());
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    setIsValidEmail(emailRegex.test(e.target.value));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password.length < 6){
      Swal.fire({
        html: '<div dir="rtl">' + '<h3 dir="rtl">אנא הזן סיסמא חוקית!</h3>' + "</div>",
        icon: "error",
      });
      return;
    }

    if(!isValidEmail){
      Swal.fire({
        html: '<div dir="rtl">' + '<h3 dir="rtl">המייל שהוזן אינו חוקי!</h3>' + "</div>",
        icon: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        html: '<div dir="rtl">' + '<h3 dir="rtl">הסיסמאות אינן תואמות!</h3>' + "</div>",
        icon: "error",
      });
      return;
    }

    try {
      const userDoc = doc(
        db,
        userType === "admin" ? "AdminUsers" : "RegularUsers",
        email
      );
      await setDoc(userDoc, { email, password });

      const data = {
        email: email,
        password: password,
      };

      const response = await fetch("http://localhost:3001/AddAdministrator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Swal.fire({
          html: '<div dir="rtl">' + '<h3 dir="rtl">מנהל חדש נוסף בהצלחה!</h3>' + "</div>",
          icon: "success",
        });


      } else {
        Swal.fire({
          html: '<div dir="rtl">' + '<h3 dir="rtl">המשתמש קיים במערכת!</h3>' + "</div>",
          icon: "warning",
        });
      }

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUserType("");
    } 
    catch (error) {
      Swal.fire({
        html: '<div dir="rtl">' + '<h3 dir="rtl">קרתה תקלה בהוספת משתמש זה!</h3>' + "</div>",
        icon: "warning",
      });
    }
  };

  return (
    <div className={classes.container}>
      <h1 dir="rtl" className={classes.title}>
        כאן מנהלים יוכלו להוסיף משתמשים
      </h1>
      <form dir="rtl" className={classes.form} onSubmit={handleSubmit}>
        <div dir="rtl" className={classes.formGroup}>
          <label dir="rtl" className={classes.label}>
            אימייל:
          </label>
          <input
            dir="rtl"
            className={classes.input}
            type="email"
            placeholder="כתובת אימייל"
            value={email}
            onChange={handleEmailChange}
            required
          />
          {!isValidEmail && email.length > 0 &&(
            <span className={classes.validationMessage}>
            כתובת לא חוקית
          </span>
          )}
        </div>
        <div dir="rtl" className={classes.formGroup}>
          <label dir="rtl" className={classes.label}>
            סיסמא:{" "}
          </label>
          <input
            dir="rtl"
            className={classes.input}
            type="password"
            placeholder="סיסמא"
            value={password}
            onChange={handlePasswordChange}
            required
          />{" "}
          {password.length < 6 && (
          <span className={classes.validationMessage}>
            סיסמא חייבת להכיל לפחות 6 תווים
          </span>
          )}
        </div>
        <div dir="rtl" className={classes.formGroup}>
          <label className={classes.label}>אמת את הסיסמא: </label>
          <input
            dir="rtl"
            className={classes.input}
            type="password"
            placeholder="אימות סיסמא"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
        </div>
        <div dir="rtl" className={classes.formGroup}>
          <label dir="rtl" className={classes.label}>
            סוג הרשאה:
          </label>
          <select
            dir="rtl"
            className={classes.select}
            value={userType}
            onChange={handleUserTypeChange}
            required
          >
            <option value="">בחר את סוג ההרשאות:</option>
            <option value="regular">הרשאות מוגבלות</option>
            <option value="admin">כל ההרשאות</option>
          </select>
        </div>
        <button className={classes.submitButton} type="submit">
          הוסף מנהל
        </button>
        <ToastContainer />
      </form>
    </div>
  );
}
