import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase_setup/firebase";
import classes from "./RemoveAdministratorPage.module.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const RemoveAdministrator = () => {
  const [emails, setEmails] = useState([]);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [userRoles, setUserRoles] = useState({});
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  useEffect(() => {
    const getEmails = async () => {
      try {
        const regularUsersSnapshot = await getDocs(
          collection(db, "RegularUsers")
        );
        const adminUsersSnapshot = await getDocs(collection(db, "AdminUsers"));

        const regularUserEmails = regularUsersSnapshot.docs.map((doc) => ({
          email: doc.id,
          role: "(רגיל)",
        }));
        const adminUserEmails = adminUsersSnapshot.docs.map((doc) => ({
          email: doc.id,
          role: "(בכיר)",
        }));

        const allEmails = [...regularUserEmails, ...adminUserEmails];
        setEmails(allEmails);
        setUserRoles(
          allEmails.reduce((acc, { email, role }) => {
            acc[email] = role;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error("Error retrieving emails:", error);
      }
    };

    getEmails();

    // Check for the currently logged-in user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      } else {
        setCurrentUserEmail("");
      }
    });

    // Cleanup the subscription
    return () => unsubscribe();
  }, []);

  const handleDeleteEmailChange = (e) => {
    setDeleteEmail(e.target.value.toLowerCase());
  };

  const handleRemoveAdmin = async () => {
    if (!deleteEmail) {
      toast.error("יש לבחור כתובת מייל מהרשימה", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    const confirmed = await Swal.fire({
      html:
        '<div dir="rtl">' +
        "<h1>האם אתה בטוח שברצונך למחוק את מנהל זה?</h1>" +
        "<div>בעת לחיצה על אישור, משתמש זה לא יוכל לגשת למערכת יותר</div>" +
        "</div>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "כן",
      cancelButtonText: "לא",
    });

    if (!confirmed.isConfirmed) {
      return;
    } else {
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
          return;
        }

        userDocRef = doc(db, selectedCollection, deleteEmail);
        await deleteDoc(userDocRef);

        Swal.fire({
          html:
            '<div dir="rtl">' +
            '<h1 dir="rtl">המחיקה בוצעה בהצלחה!</h1>' +
            "</div>",
          icon: "success",
        });
        const response = await fetch(
          "http://localhost:3001/RemoveAdministrator",
          {
            // const response = await fetch(
            //   "https://kanfeidrorneww.netlify.app/RemoveAdministrator",
            //   {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: deleteEmail }),
          }
        );

        if (response.ok) {
          setEmails((prevEmails) =>
            prevEmails.filter((email) => email.email !== deleteEmail)
          );
        } else {
          toast.error("מחיקת המנהל נכשלה, נסה שנית", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }

        setDeleteEmail("");
      } catch (error) {
        console.error("שגיאה:", error);
      }
    }
  };

  return (
    <div dir="rtl" className={classes.container}>
      <h2 dir="rtl" className={classes.title}>
        כאן המנהל יכול למחוק כל משתמש שקיים במערכת
      </h2>

      <div className={classes.managerContainer}>
        <label dir="rtl" className={classes.label}>
          המייל של המשתמש אותו תרצה למחוק
        </label>{" "}
        <br></br>
        <select
          value={deleteEmail}
          onChange={handleDeleteEmailChange}
          className={classes.select}
        >
          <option dir="rtl" value="">
            בחר אימייל
          </option>
          {emails.map((email) => {
            if (email.email === currentUserEmail) {
              return null; // Don't show the currently logged-in user in the list
            }
            return (
              <option key={email.email} value={email.email}>
                {email.email} - {userRoles[email.email]}
              </option>
            );
          })}
        </select>
        <button onClick={handleRemoveAdmin} className={classes.button}>
          מחק מנהל
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RemoveAdministrator;
