import React, { useState, useEffect } from "react";
import { db } from "../../firebase_setup/firebase";
import { v4 as uuidv4 } from "uuid";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import classes from "./EditInformationComponent.module.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditInformationComponent({ onUpdatePage }) {
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

  const writeReportToDB = async (e) => {
    e.preventDefault();
    const uuid = uuidv4();
    const confirmed = window.confirm(
      "השינויים שתבצע יופיע ישירות אצל כל המשתמשים באתר, האם אתה בטוח שברצונך לבצע אותם?"
    );
    if (confirmed) {
      const docRef = doc(db, userCollectionRef, "document_id");

      const updatedData = {
        title,
        informationText,
        uuid,
      };

      try {
        await setDoc(docRef, updatedData);
        toast.success("הנתונים עודכנו בהצלחה", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        onUpdatePage(); // Call the callback function passed from the parent component
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    }
  };

  return (
    <div className={classes.edit_information}>
      <div className={classes.container}>
        <h1 className={classes.edit_information__title}>עריכת מידע</h1>
        <div className={classes.edit_information__field}>
          <label className={classes.edit_information__label}>כותרת:</label>
          <input
            className={classes.edit_information__input}
            dir="rtl"
            placeholder="כאן תופיע הכותרת של המידע על האתר..."
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div className={classes.edit_information__field}>
          <label className={classes.edit_information__label}>תוכן:</label>
          <textarea
            className={classes.edit_information__textarea}
            dir="rtl"
            placeholder="כאן אתם תכתבו את התוכן החדש שתרצו שיופיע בעמוד..."
            value={informationText}
            onChange={(event) => {
              setInformationText(event.target.value);
            }}
          />
        </div>
        <button
          className={classes.edit_information__button}
          onClick={writeReportToDB}
        >
          עדכן את הדף
        </button>
        <ToastContainer />
      </div>
    </div>
  );
}
