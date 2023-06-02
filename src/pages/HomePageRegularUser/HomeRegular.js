import React, { useEffect, useState } from "react";
import ReportForm from "../../components/Contact_Form_Component/ReportForm";
import Header from "../../components/Header_Component/Header";
import EditInformationComponent from "../../components/Edit_Information_Component/EditInformationComponent";
import { db, auth } from "../../firebase_setup/firebase";
import { collection, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import Footer from "../../components/Footer_Component/Footer";

export default function HomeRegular() {
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

    //Check if the logged-in user's email is in the "AdminUsers" collection
    const checkAdminStatus = async () => {
      const adminRef = doc(collection(db, "AdminUsers"), auth.currentUser.email);
      const adminDocSnapshot = await getDoc(adminRef);
      setIsAdmin(adminDocSnapshot.exists());
    };

    if (auth.currentUser) {
      checkAdminStatus();
    }
  }, []);

  return (
    <div>
      <div>
        <Header />

        {info.map((item) => (
          <div key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.informationText}</p>
            {/* Render the "delete" button only if the user is an admin */}
            {auth.currentUser && isAdmin && (
              <button onClick={() => handleDelete(item.id)}>delete</button>
            )}
          </div>
        ))}

        {auth.currentUser ? (
          <div>
            {isAdmin ? (
              <div>
                <button onClick={toggleReportForm}>
                  {showReportForm ? "הסתר עריכת מידע" : "עריכת המידע"}
                </button>
                {showReportForm && <EditInformationComponent />}
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            {/* Hide the "הגש דיווח" button for users that are not logged in */}
            {!auth.currentUser && (
              <div>
                <button onClick={toggleReportForm}>
                  {showReportForm ? "הסתר הגשת דיווח" : "הגש דיווח"}
                </button>
                {showReportForm && <ReportForm />}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}