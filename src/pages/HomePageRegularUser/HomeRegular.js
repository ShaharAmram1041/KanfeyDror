import React, { useEffect, useState } from "react";
import ReportFormPage from "../ReportFormPage/ReportFormPage";
import Header from "../../components/Header_Component/Header";
import EditInformationComponent from "../../components/Edit_Information_Component/EditInformationComponent";
// import { useAuth0 } from "@auth0/auth0-react";
import { db, auth } from "../../firebase_setup/firebase";
// import { onValue, ref, remove } from "firebase/database";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import './ChooseType.scss';

export default function Home() {
  const [showReportForm, setShowReportForm] = useState(false);
  const [info, setInfo] = useState([]);

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
  }, []);

  return (
    <div>
      <div>

        {info.map((item) => (
          <div key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.informationText}</p>
            {/* Render the "delete" button only if there is a logged-in user */}
            {auth.currentUser && (
              <button onClick={() => handleDelete(item.id)}>delete</button>
            )}{" "}
          </div>
        ))}
        {/* {isAuthenticated ? ( */}
        {auth.currentUser ? (
          <div>
            <button onClick={toggleReportForm}>
              {showReportForm ? "הסתר עריכת מידע" : "עריכת המידע"}
            </button>
            {showReportForm && <EditInformationComponent />}
          </div>
        ) : (
          <div className="ReportFormPage">
            {/* <FollowReport /> */}
            <ReportFormPage />
          </div>
          // <div>
          //   <button onClick={toggleReportForm}>
          //     {showReportForm ? "הסתר הגשת דיווח" : "הגש דיווח"}
          //   </button>
          //   {showReportForm && <ReportForm />}
          // </div>
        )}
      </div>
      {/* <Footer /> */}
    </div>
  );
}
