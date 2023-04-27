// import React from "react";

// function Information() {
//   return (
//     <main className="informationDiv">
//       {/* {" "} */}
//        ...היי, כאן יש מידע קצת על האפליקצייה ואיך היא עובדת בנוסף, חשוב גם
//       שלאדמין תהיה אופצייה לערוך את מה שכתוב כאן מהאתר
//     </main>
//   );
// }

// export default Information;
import React, { useEffect, useState } from "react";
import "./Information.css";
import { addDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { auth, db } from "../../../../firebase_setup/firebase";
import { useNavigate } from "react-router-dom";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Information({ isAuth }) {
  const [title, setTitle] = useState("");
  const [informationText, setInformationText] = useState("");

  const postsCollectionRef = collection(db, "Information");
  let navigate = useNavigate();

  const createPost = async () => {
    // Delete all previous posts from the "Information" collection
    const querySnapshot = await getDocs(postsCollectionRef);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });

    // Create a new post with the given title and text
    await addDoc(postsCollectionRef, {
      title,
      informationText,
      author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
    });

    navigate("/");
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="createPostPage">
      <div className="cpContainer">
        <h1>עריכת מידע</h1>
        <div className="inputGp">
          <label> :כותרת</label>
          <input
            dir="rtl"
            placeholder="כאן תופיע הכותרת של המידע על האתר..."
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div className="inputGp">
          <label> :תוכן</label>
          {/* <ReactQuill
            theme="snow"
            // dir="rtl"
            className="my-quill-editor"
            value={informationText}
            onChange={setInformationText}
            placeholder="כאן אתם תכתבו את התוכן החדש שתרצו שיופיע בעמוד. בגדול, מה שצריך להופיע כאן זה הסבר קצר על המערכת פניות הזו. מדוע כדאי לדווח?, על העובדה שהדיווח הוא אנונימי וכו'"
          /> */}

          <textarea
            dir="rtl"
            placeholder="כאן אתם תכתבו את התוכן החדש שתרצו שיופיע בעמוד. בגדול, מה שצריך להופיע כאן זה הסבר קצר על המערכת פניות הזו. מדוע כדאי לדווח?, על העובדה שהדיווח הוא אנונימי וכו'"
            onChange={(event) => {
              setInformationText(event.target.value);
            }}
          />
          <div style={{ width: 400, hight: 200 }}></div>
        </div>
        <button className="buttonSearch" onClick={createPost}>
          {/* {" "} */}
          עדכן את הדף
        </button>
      </div>
    </div>
  );
}
