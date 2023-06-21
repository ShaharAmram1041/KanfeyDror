import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase_setup/firebase";
import classes from "./Login.module.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";


export default function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const [loginPassword, setLoginPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, loginPassword);
      navigate("/");
    } catch (e) {
      Swal.fire({
        html: '<div dir="rtl">' + '<h1 dir="rtl">אחד מהפרטים המזהים שגוי!</h1>' + "</div>",
        icon: "error",
      });
    }
  };

  const forgetPassword = async () => {
    try {
      if (email === "") {
        Swal.fire({
          html: '<div dir="rtl">' + '<h1 dir="rtl">אנא הזן מייל!</h1>' + "</div>",
          icon: "error",
        });
        return;
      }
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      Swal.fire({
        html: '<div dir="rtl">' + '<h1 dir="rtl">המשתמש אינו קיים במערכת!</h1>' + "</div>",
        icon: "error",
      });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      login();
    }
  };

  return (
    <div className={classes.login}>
      <h3 className={classes.loginTitle}>התחברות למערכת</h3>
      <input
        className={classes.loginInput}
        type="email"
        placeholder="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        onKeyPress={handleKeyPress}
      ></input>
      <input
        className={classes.loginInput}
        type="password"
        placeholder="password"
        onChange={(e) => {
          setLoginPassword(e.target.value);
        }}
        onKeyPress={handleKeyPress}
      ></input>

      <button className={classes.loginButton} onClick={login}>
        התחבר
      </button>
      <button className={classes.forgotPasswordButton} onClick={forgetPassword}>
        שכחתי סיסמא
      </button>
      <ToastContainer />
    </div>
  );
}
