import React, { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";
import classes from "./AddAdministrator.module.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddAdministrator() {
  const [email, setEmail] = useState("");
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

    if (password !== confirmPassword) {
      toast.error("הסיסמאות אינן תואמות", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
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
        console.log("Admin user created successfully!");
        toast.success("!המידע עודכן בהצלחה", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error("המשתמש כבר קיים במערכת", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUserType("");
    } catch (error) {
      toast.error("לא ניתן להוסיף משתמש זה", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
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
          <span className={classes.validationMessage}>
            סיסמא חייבת להכיל לפחות 6 תווים
          </span>
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
