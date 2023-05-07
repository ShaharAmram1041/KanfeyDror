import { useAuth0 } from "@auth0/auth0-react";
import React, { useState } from "react";
import { db } from "../../firebase_setup/firebase";
import { uid } from "uid";
import { ref, set } from "firebase/database";

export default function EditInformationComponent() {
  const [title, setTitle] = useState("");
  const [informationText, setInformationText] = useState("");

  const writeReportToDB = (e) => {
    e.preventDefault();

    const uuid = uid();

    set(ref(db, `/${uuid}`), {
      title,
      informationText,
      uuid: "information",
    })
      .then(() => {
        setTitle("");
        setInformationText("");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  return (
    <div>
      <div>
        <h1>עריכת מידע</h1>
        <div>
          <label> :כותרת</label>
          <input
            dir="rtl"
            placeholder="כאן תופיע הכותרת של המידע על האתר..."
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div>
          <label> :תוכן</label>

          <textarea
            dir="rtl"
            placeholder="כאן אתם תכתבו את התוכן החדש שתרצו שיופיע בעמוד. בגדול, מה שצריך להופיע כאן זה הסבר קצר על המערכת פניות הזו. מדוע כדאי לדווח?, על העובדה שהדיווח הוא אנונימי וכו'"
            onChange={(event) => {
              setInformationText(event.target.value);
            }}
          />
        </div>
        <button onClick={writeReportToDB}>עדכן את הדף</button>
      </div>
    </div>
  );
}
