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
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./HomeRegular.module.scss";
export default function Home() {
  const [showReportForm, setShowReportForm] = useState(false);
  const [info, setInfo] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "Information", id));
    fetchPost();
  };

  const handlePageUpdate = () => {
    fetchPost(); // Fetch the updated data when the page is updated
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
            {item && (
              <p
                dangerouslySetInnerHTML={{
                  __html: item.informationText.replace(/\n/g, "<br>"),
                }}
              ></p>
            )}
            {auth.currentUser && isAdmin && (
              <h2 className={styles.h2Explain}>
                כאן מופיע המידע שכולם רואים בעמוד הראשי, בתור אדמין תוכל לערוך
                אותו ישירות מכאן
              </h2>
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
                  {showReportForm ? (
                    <>
                      <CloseIcon />
                    </>
                  ) : (
                    <>
                      ערוך את המידע שמופיע בעמוד הראשי <EditIcon />
                    </>
                  )}
                </button>
                {showReportForm && (
                  <EditInformationComponent onUpdatePage={handlePageUpdate} />
                )}
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
