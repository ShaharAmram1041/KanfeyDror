import React, { useState, useEffect } from "react";
import { db } from "../../firebase_setup/firebase";
import { v4 as uuidv4 } from "uuid";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function EditInformationComponent() {
  const [title, setTitle] = useState("");
  const [informationText, setInformationText] = useState("");
  const userCollectionRef = "Information"; // Collection
  const navigate = useNavigate();

  useEffect(() => {
    // Checks if need to create new one, or append to exist doc
    const fetchData = async () => {
      const docRef = doc(db, userCollectionRef, "document_id"); // Replace "document_id" with the ID of the existing document
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setInformationText(data.informationText);
      }
    };

    fetchData();
  }, [userCollectionRef]);

  const writeReportToDB = (e) => {
    e.preventDefault();
    const uuid = uuidv4();

    const docRef = doc(db, userCollectionRef, "document_id"); // Replace "document_id" with the ID of the existing document

    const updatedData = {
      title,
      informationText, // Retain the existing informationText field value
      uuid,
    };

    setDoc(docRef, updatedData)
      .then(navigate("/"))
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
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div>
          <label> :תוכן</label>

          <textarea
            dir="rtl"
            placeholder="כאן אתם תכתבו את התוכן החדש שתרצו שיופיע בעמוד..."
            value={informationText}
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
