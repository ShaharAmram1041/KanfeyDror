import React, { useEffect, useState } from "react";
import ReportForm from "../../components/Contact_Form_Component/ReportForm";
import EditInformationComponent from "../../components/Edit_Information_Component/EditInformationComponent";
import { db, auth } from "../../firebase_setup/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";

import styles from "./HomeRegular.module.scss";
export default function Home() {
  const [showReportForm, setShowReportForm] = useState(false);
  const [info, setInfo] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "Information", id));
    fetchPost();
  };

  const toggleReportForm = () => {
    setShowReportForm(!showReportForm);
  };

  const fetchPost = async () => {
    await getDocs(collection(db, "Information")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setInfo(newData);
    });
  };

  useEffect(() => {
    fetchPost();

    const checkAdminStatus = async () => {
      const adminRef = doc(
        collection(db, "AdminUsers"),
        auth.currentUser.email
      );
      const adminDocSnapshot = await getDoc(adminRef);
      setIsAdmin(adminDocSnapshot.exists());
    };

    if (auth.currentUser) {
      checkAdminStatus();
    }
  }, []);

  return (
    <div>
      <div dir="rtl" className={styles.container}>
        {info.map((item) => (
          <div key={item.id} className={styles.infoContainer}>
            <h3>{item.title}</h3>
            <p>{item.informationText}</p>
            {auth.currentUser && isAdmin && (
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}

        {auth.currentUser ? (
          <div>
            {isAdmin ? (
              <div className={styles.editContainer}>
                <button
                  className={styles.editButton}
                  onClick={toggleReportForm}
                >
                  {showReportForm
                    ? "Hide Edit Information"
                    : "Edit Information"}
                </button>
                {showReportForm && <EditInformationComponent />}
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <ReportForm />
          </div>
        )}
      </div>
    </div>
  );
}

// const styles = {
//   container: {
//     maxWidth: "800px",
//     margin: "0 auto",
//     padding: "20px",
//   },
//   infoContainer: {
//     marginBottom: "20px",
//     padding: "10px",
//     border: "1px solid #ccc",
//   },
//   deleteButton: {
//     backgroundColor: "#dc3545",
//     color: "#fff",
//     border: "none",
//     borderRadius: "4px",
//     padding: "8px 12px",
//     cursor: "pointer",
//   },
//   editContainer: {
//     marginTop: "20px",
//   },
//   editButton: {
//     backgroundColor: "#007bff",
//     color: "#fff",
//     border: "none",
//     borderRadius: "4px",
//     padding: "8px 12px",
//     cursor: "pointer",
//     marginRight: "10px",
//   },
// };
