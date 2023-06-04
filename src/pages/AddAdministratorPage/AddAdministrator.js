import React, { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";

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
      alert("Passwords do not match");
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
        alert("המנהל נוסף בהצלחה!");
      } else {
        console.error("Failed to create admin user");
      }

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUserType("");
    } catch (error) {
      console.error("Error adding administrator:", error);
    }
  };

  return (
    <div>
      <h1>כאן מנהלים יוכלו להוסיף משתמשים</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>:אימייל </label>
          <input
            type="email"
            placeholder="כתובת אימייל"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <span>סיסמא חייבת להכיל לפחות 6 תווים</span>
        </div>
        <div>
          <label>:סיסמא</label>
          <input
            type="password"
            placeholder="סיסמא"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div>
          <label>:אמת את הססמא </label>
          <input
            type="password"
            placeholder="אימות סיסמא"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
        </div>
        <div>
          <label>:סוג הרשאה </label>
          <select value={userType} onChange={handleUserTypeChange} required>
            <option value="">בחר את סוג ההרשאות:</option>
            <option value="regular">הרשאות מוגבלות</option>
            <option value="admin">כל ההרשאות</option>
          </select>
        </div>
        <button type="submit">הוסף מנהל</button>
      </form>
    </div>
  );
}