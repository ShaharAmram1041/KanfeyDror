import React, { useState, useEffect } from "react";
import Header from "../../components/Header_Component/Header";
import { db } from "../../firebase_setup/firebase";
import { getDoc, doc } from "firebase/firestore";

export default function FollowSingleReportPage() {
  const [searchPerId, setSearchPerId] = useState("");
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (searchPerId) {
        const reportDoc = doc(db, "Reports", searchPerId);
        const reportSnapshot = await getDoc(reportDoc);
        if (reportSnapshot.exists()) {
          const reportData = reportSnapshot.data();
          setReport({
            id: searchPerId,
            name: reportData.name,
            email: reportData.email,
            city: reportData.city,
            place: reportData.place,
            date: reportData.date,
            message: reportData.message,
            urgency: reportData.urgency,
            status: reportData.status,
          });
        } else {
          setReport(null);
        }
      } else {
        setReport(null);
      }
    };

    fetchReport();
  }, [searchPerId]);

  return (
    <div>
      <Header />
      <form
        name="search"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          type="text"
          name="txt"
          readOnly={false}
          onChange={(event) => {
            setSearchPerId(event.target.value);
          }}
        ></input>
        <button type="submit">🔍</button>
      </form>
      {report ? (
        <div>
          <h1>ID: {report.id}</h1>
          <h3>status: {report.status}</h3>
          {/* Render other properties of the report as needed */}
        </div>
      ) : (
        <p>על מנת לברר את סטטוס הפנייה יש להקיש את הקוד הסודי שקיבלת </p>
      )}
    </div>
  );
}
