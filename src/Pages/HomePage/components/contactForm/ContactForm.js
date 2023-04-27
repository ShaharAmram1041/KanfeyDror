// import React, { useRef, useState } from "react";
// import "../../App.css";
// import { addDoc, collection } from "@firebase/firestore";
// // import { firestore } from "../../../firebase_setup/firebase";

// const ContactForm = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [city, setCity] = useState("");
//   const [place, setPlace] = useState("");

//   const messageRef = useRef();
//   // const ref = collection(db, "messages");
//   const ref = collection(firestore, "test_data"); // Firebase creates this automatically

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     let data = {
//       name: name,
//       email: email,
//       city: city,
//       place: place,
//       message: message,
//     };

//     try {
//       addDoc(ref, data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   //     collection("contacts")
//   //       .add({
//   //         name: name,
//   //         email: email,
//   //         message: message,
//   //       })
//   //       .then(() => {
//   //         alert("Message has been sent");
//   //       })
//   //       .catch((err) => {
//   //         alert(err.message);
//   //       });
//   //     setName("");
//   //     setEmail("");
//   //     setMessage("");
//   //   };

//   return (
// <form className="form" onSubmit={handleSubmit}>
//   <h1>פרטים</h1>
//   <div>
//     <label>שם</label>
//     <input
//       placeholder="...שם"
//       value={name}
//       onChange={(e) => setName(e.target.value)}
//     />
//   </div>

//   <div>
//     <label>אימייל</label>
//     <input
//       placeholder="...אימייל"
//       value={email}
//       onChange={(e) => setEmail(e.target.value)}
//     />
//   </div>

//   <div>
//     <label>עיר </label>
//     <input
//       placeholder="נא לבחור עיר"
//       value={city}
//       onChange={(e) => setCity(e.target.value)}
//     />
//   </div>

//   <div>
//     <label>איפה </label>
//     <input
//       placeholder="בית ספר/ חוג/ פארק"
//       value={place}
//       onChange={(e) => setPlace(e.target.value)}
//     />
//   </div>

//   <div className="textareaDiv">
//     <label>תיאור המקרה</label>
//     <textarea
//       placeholder="...כתוב את התוכן כאן"
//       value={message}
//       onChange={(e) => setMessage(e.target.value)}
//     ></textarea>
//   </div>

//   <button type="submit">שליחת דיווח</button>
// </form>
//   );
// };

// export default ContactForm;

import React, { useState } from "react";
import "./ContactForm.css";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase_setup/firebase";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [city, setCity] = useState("");
  const [place, setPlace] = useState("");

  const reportDetails = collection(db, "Reports");

  const createReport = async () => {
    // Delete all previous posts from the "Information" collection
    const querySnapshot = await getDocs(reportDetails);

    // Create a new post with the given title and text
    await addDoc(reportDetails, {
      name,
      email,
      city,
      place,
      message,
    });
  };

  return (
    <form className="form">
      <h1>פרטים</h1>
      <div>
        <label>שם</label>
        <input
          placeholder="...שם"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label>אימייל</label>
        <input
          placeholder="...אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label>עיר </label>
        <input
          placeholder="נא לבחור עיר"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      <div>
        <label>איפה </label>
        <input
          placeholder="בית ספר/ חוג/ פארק"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
        />
      </div>

      <div className="textareaDiv">
        <label>תיאור המקרה</label>
        <textarea
          placeholder="...כתוב את התוכן כאן"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </div>

      <button onClick={createReport}>שליחת דיווח</button>
    </form>
  );
}
