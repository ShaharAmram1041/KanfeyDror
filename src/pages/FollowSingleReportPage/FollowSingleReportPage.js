import React, { useState, useEffect } from "react";
import Header from "../../components/Header_Component/Header";
import { db } from "../../firebase_setup/firebase";
import { onValue, ref } from "firebase/database";

export default function FollowSingleReportPage() {
  const [searchPerId, setSearchPerId] = useState("");
  const [report, setReport] = useState(null);

  useEffect(() => {
    const reportsRef = ref(db);
    onValue(reportsRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const report = childSnapshot.val();
        if (childSnapshot.key === searchPerId) {
          setReport({
            id: childSnapshot.key,
            name: report.name,
            email: report.email,
            city: report.city,
            place: report.place,
            date: report.date,
            message: report.message,
            urgency: report.urgency,
            status: report.status,
          });
        }
      });
    });
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
      {report && (
        <div>
          <h1>ID: {report.id}</h1>
          <h3>status: {report.status}</h3>
          {/* Render other properties of the report as needed */}
        </div>
      )}
    </div>
  );
}
