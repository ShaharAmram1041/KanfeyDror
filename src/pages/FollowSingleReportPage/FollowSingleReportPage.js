import React, { useState, useEffect } from "react";
import { db } from "../../firebase_setup/firebase";
import { getDoc, doc } from "firebase/firestore";
import classes from "./FollowSingleReportPage.module.scss";

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
    <div className={classes.main_container}>
      <form
        className={classes.form_container}
        name="search"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          type="text"
          name="txt"
          readOnly={false}
          className={classes.input}
          onChange={(event) => {
            setSearchPerId(event.target.value);
          }}
        />
        <button type="submit" className={classes.submit_button}>
          🔍
        </button>
        {report ? (
          <div>
            <h1 className={classes.report_id}>ID: {report.id}</h1>
            <h3 className={classes.report_status}>status: {report.status}</h3>
            {/* Render other properties of the report as needed */}
          </div>
        ) : (
          <p className={classes.error_message}>
            על מנת לברר את סטטוס הפנייה יש להקיש את הקוד הסודי שקיבלת
          </p>
        )}
      </form>
    </div>
  );
}
