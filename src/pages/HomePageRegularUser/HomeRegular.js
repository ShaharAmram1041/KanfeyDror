import React, { useEffect, useState } from "react";
import ReportForm from "../../components/Contact_Form_Component/ReportForm";
import Header from "../../components/Header_Component/Header";
import EditInformationComponent from "../../components/Edit_Information_Component/EditInformationComponent";
import { useAuth0 } from "@auth0/auth0-react";
import { db } from "../../firebase_setup/firebase";
import { onValue, ref, remove } from "firebase/database";

export default function Home() {
  const [showReportForm, setShowReportForm] = useState(false);
  const { isAuthenticated } = useAuth0();
  const [info, setInfo] = useState([]);

  const handleDelete = (id) => {
    const info = ref(db, id);
    remove(info);
  };
  const toggleReportForm = () => {
    setShowReportForm(!showReportForm);
  };

  useEffect(() => {
    const infoRef = ref(db);
    onValue(infoRef, (snapshot) => {
      const reports = [];
      snapshot.forEach((childSnapshot) => {
        const info = childSnapshot.val();
        if (info.uuid === "information") {
          // exclude report with uuid equal to "information"
          reports.push({
            id: childSnapshot.key,
            title: info.title,
            informationText: info.informationText,
          });
        }
      });
      setInfo(reports);
    });
  }, []);

  return (
    <div>
      <Header />
      {info.map((item) => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.informationText}</p>
          {isAuthenticated ? (
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          ) : null}
        </div>
      ))}

      {isAuthenticated ? (
        <div>
          <button onClick={toggleReportForm}>
            {showReportForm ? "הסתר עריכת מידע" : "עריכת המידע"}
          </button>
          {showReportForm && <EditInformationComponent />}
        </div>
      ) : (
        <div>
          <button onClick={toggleReportForm}>
            {showReportForm ? "הסתר הגשת דיווח" : "הגש דיווח"}
          </button>
          {showReportForm && <ReportForm />}
        </div>
      )}
    </div>
  );
}
