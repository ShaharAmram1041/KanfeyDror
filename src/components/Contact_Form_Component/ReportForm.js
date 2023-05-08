import React, { useState } from "react";
import { uid } from "uid";
import styles from "./ReportFormStyle.module..css";
import { db } from "../../firebase_setup/firebase";
import { addDoc, collection } from "firebase/firestore";
export default function ReportForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [city, setCity] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");

  const writeReportToDB = async (e) => {
    e.preventDefault();
    const uuid = uid();
    try {
      const docRef = await addDoc(collection(db, "Reports"), {
        name,
        email,
        message,
        city,
        place,
        date,
        urgency: "דחוף",
        status: "בטיפול",
        uuid,
      });
      // alert("Your ID is: ", docRef.id);
      alert("Your ID is: " + docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <form className={styles.form}>
      <h1 className={styles.title}>פרטים</h1>
      <div>
        <label className={styles.label}>שם</label>
        <input
          placeholder="שם"
          value={name}
          dir="rtl"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label>אימייל</label>
        <input
          placeholder="אימייל"
          value={email}
          dir="rtl"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label>עיר בה קרה המקרה *</label>
        <input
          placeholder="נא לבחור עיר"
          value={city}
          dir="rtl"
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      <div>
        <label>איפה *</label>
        <input
          placeholder="בית ספר/ חוג/ פארק"
          value={place}
          dir="rtl"
          onChange={(e) => setPlace(e.target.value)}
        />
      </div>

      <div>
        <label>התאריך בו קרה המקרה *</label>
        <input
          placeholder="מתי קרה האירוע"
          value={date}
          type="date"
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <label>תיאור המקרה *</label>
        <textarea
          placeholder="כתוב את התוכן כאן"
          value={message}
          dir="rtl"
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </div>

      <button onClick={writeReportToDB}>שליחת דיווח</button>
    </form>
  );
}
