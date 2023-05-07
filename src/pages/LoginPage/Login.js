import React, { useState } from "react";
import Header from "../../components/Header_Component/Header";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const [loginPassword, setLoginPassword] = useState("");

  return (
    <div>
      <Header />
      <h3>התחברות למערכת</h3>
      <input
        placeholder="שם משתמש"
        onChange={(e) => {
          setUser(e.target.value);
        }}
      ></input>
      <input
        placeholder="סיסמא"
        onChange={(e) => {
          setLoginPassword(e.target.value);
        }}
      ></input>
      <button>התחבר</button>
    </div>
  );
}
