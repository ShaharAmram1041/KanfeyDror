import React, { useState, useEffect } from "react";
import { db } from "../../firebase_setup/firebase";
import { getDocs, doc, query, collection, where } from "firebase/firestore";
import classes from "./FollowSingleReportPage.module.scss";

export default function FollowSingleReportPage() {
  const [searchPerId, setSearchPerId] = useState("");
  const [report, setReport] = useState(null);

  const fetchReport = async () => {
    if (searchPerId) {
      const reportCollectionRef = collection(db, "Reports");
      const querySnapshot = await getDocs(
        query(reportCollectionRef, where("uuid", "==", searchPerId))
      );
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const reportData = doc.data();
          setReport({
            uuid: reportData.uuid, // Use the "uuid" field from Firestore
            name: reportData.name,
            email: reportData.email,
            city: reportData.city,
            place: reportData.place,
            date: reportData.date,
            message: reportData.message,
            urgency: reportData.urgency,
            status: reportData.status,
          });
        });
      }
    } else {
      setReport(null);
    }
  };

  const handleSubmit = async () => {
    await fetchReport();
  };

  return (
    <div className={classes.main_container}>
      <form
        className={classes.form_container}
        name="search"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className={classes.input_wrapper}>
          <input
            type="text"
            name="txt"
            readOnly={false}
            className={classes.input}
            onChange={(event) => {
              setSearchPerId(event.target.value);
            }}
          />
          <button
            type="submit"
            className={classes.submit_button}
            onClick={(e) => {
              handleSubmit();
            }}
          >
            🔍
          </button>
        </div>
        {report ? (
          <div>
            <h1 style={{ direction: "rtl" }} className={classes.report_id}>
              קוד סודי : {report.uuid}
            </h1>
            <h2 style={{ direction: "rtl" }} className={classes.report_status}>
              סטטוס : {report.status}
            </h2>
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
