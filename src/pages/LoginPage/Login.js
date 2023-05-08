import React, { useState } from "react";
import Header from "../../components/Header_Component/Header";
import { useNavigate } from "react-router-dom";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase_setup/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const [loginPassword, setLoginPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, loginPassword);
      navigate("/");
    } catch (e) {
      console.log(e.code);
    }
  };

  const forgetPassword = async () => {
    try {
      if (email === "") alert("Don't forgent email address");
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      console.log(e.code);
    }
  };

  return (
    <div>
      <Header />
      <h3>התחברות למערכת</h3>
      <input
        type="email"
        placeholder="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      ></input>
      <input
        type="password"
        placeholder="password"
        onChange={(e) => {
          setLoginPassword(e.target.value);
        }}
      ></input>

      <button onClick={login}>התחבר</button>
      <button onClick={forgetPassword}>שכחתי סיסמא</button>
    </div>
  );
}
