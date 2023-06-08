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

export default function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const [loginPassword, setLoginPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, loginPassword);
      navigate("/");
    } catch (e) {
      toast.error("אחד מהפרטים המזהים שגוי", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const forgetPassword = async () => {
    try {
      if (email === "") {
        toast.error("אנא הקש מייל", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      console.log(e.code);
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
