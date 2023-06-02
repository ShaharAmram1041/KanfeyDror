import React, { useState } from "react";
import { collection, doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";

const RemoveAdministrator = () => {
  const [deleteEmail, setDeleteEmail] = useState("");

  const handleDeleteEmailChange = (e) => {
    setDeleteEmail(e.target.value.toLowerCase());
  };

  const handleRemoveAdmin = async () => {
    if (!deleteEmail) {
      console.log("Please enter an email to remove from admin.");
      alert("אנא הזמן כתובת אימייל")
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
        console.log("User not found in any collection.");
        alert("לא קיים מנהל עם כתובת המייל שהזנת, נסה שנית.")
        return;
      }

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
        //console.log("Admin removed from authentic....!");
      } else {
        console.error("Failed to remove admin user from authentication");
      }

      // Remove user from the selected collection
      userDocRef = doc(db, selectedCollection, deleteEmail);
      await deleteDoc(userDocRef);

      //console.log("Admin removed from authenti... and collection!");
      alert("הפעולה בוצעה בהצלחה, המנהל הוסר!")
      setDeleteEmail("");
    } catch (error) {
      //console.error("Error removing admin:", error);
      alert("Error removing admin:", error);
    }
  };

  return (
    <div>
      <h2>Delete User</h2>
      <div>
        <label>Email to Delete:</label>
        <input
          type="email"
          placeholder="Email Address"
          value={deleteEmail}
          onChange={handleDeleteEmailChange}
          required
        />
      </div>
      <button onClick={handleRemoveAdmin}>Delete User</button>
    </div>
  );
};

export default RemoveAdministrator;