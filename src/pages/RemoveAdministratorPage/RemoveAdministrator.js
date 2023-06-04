import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";

const RemoveAdministrator = () => {
  const [emails, setEmails] = useState([]);
  const [deleteEmail, setDeleteEmail] = useState("");

  useEffect(() => {
    const getEmails = async () => {
      try {
        const regularUsersSnapshot = await getDocs(
          collection(db, "RegularUsers")
        );
        const adminUsersSnapshot = await getDocs(collection(db, "AdminUsers"));

        const regularUserEmails = regularUsersSnapshot.docs.map(
          (doc) => doc.id
        );
        const adminUserEmails = adminUsersSnapshot.docs.map((doc) => doc.id);

        const allEmails = [...regularUserEmails, ...adminUserEmails];
        setEmails(allEmails);
      } catch (error) {
        console.error("Error retrieving emails:", error);
      }
    };

    getEmails();
  }, []);

  const handleDeleteEmailChange = (e) => {
    setDeleteEmail(e.target.value.toLowerCase());
  };

  const handleRemoveAdmin = async () => {
    if (!deleteEmail) {
      alert("אנא בחר כתובת אימייל מהרשימה!");
      return;
    }

    // Show confirmation alert
    const confirmDelete = window.confirm("האם אתה בטוח שברצונך למחוק מנהל זה?");

    if (!confirmDelete) {
      return;
    }

    try {
      let selectedCollection = "";
      let userDocRef = doc(db, "AdminUsers", deleteEmail);
      let userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        selectedCollection = "AdminUsers";
      } else {
        userDocRef = doc(db, "RegularUsers", deleteEmail);
        userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          selectedCollection = "RegularUsers";
        }
      }

      if (!selectedCollection) {
        console.log("מנהל זה לא קיים במערכת!");
        return;
      }

      // Remove user from the selected collection
      userDocRef = doc(db, selectedCollection, deleteEmail);
      await deleteDoc(userDocRef);

      alert("הכתובת נמחקה בהצלחה!", deleteEmail);

      // Remove user from authentication
      const response = await fetch(
        "http://localhost:3001/RemoveAdministrator",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: deleteEmail }),
        }
      );

      if (response.ok) {
        console.log("User removed from authentication:", deleteEmail);

        // Remove email from the dropdown box
        setEmails((prevEmails) =>
          prevEmails.filter((email) => email !== deleteEmail)
        );
      } else {
        console.error("מחיקת המנהל נכשלה, נסה שנית!");
      }

      setDeleteEmail("");
    } catch (error) {
      console.error("שגיאה:", error);
    }
  };

  return (
    <div>
      <h2>כאן המנהל יכול למחוק כל משתמש שקיים במערכת</h2>

      <div>
        <label>המייל של המשתמש אותו תרצה למחוק</label>
        <select value={deleteEmail} onChange={handleDeleteEmailChange}>
          <option value="">בחר אימייל</option>
          {emails.map((email) => (
            <option key={email} value={email}>
              {email}
            </option>
          ))}
        </select>
        <button onClick={handleRemoveAdmin}>מחק מנהל</button>
      </div>
    </div>
  );
};

export default RemoveAdministrator;
