import React, { useEffect, useState } from "react";
import { db } from "../../firebase_setup/firebase";
import { onValue, ref, remove } from "firebase/database";

function ReportsTableCom() {
  const [reports, setReports] = useState([]);

  const handleDelete = (id) => {
    const reportRef = ref(db, id);
    remove(reportRef);
  };

  useEffect(() => {
    const reportsRef = ref(db);
    onValue(reportsRef, (snapshot) => {
      const reports = [];
      snapshot.forEach((childSnapshot) => {
        const report = childSnapshot.val();
        reports.push({
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
      });
      setReports(reports);
    });
  }, []);

  return (
    <div>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <th style={{ padding: "12px 15px", textAlign: "left" }}>ID</th>
            <th style={{ padding: "12px 15px", textAlign: "left" }}>שם</th>
            <th style={{ padding: "12px 15px", textAlign: "left" }}>אימייל</th>
            <th style={{ padding: "12px 15px", textAlign: "left" }}>עיר</th>
            <th style={{ padding: "12px 15px", textAlign: "left" }}>מקום</th>
            <th style={{ padding: "12px 15px", textAlign: "left" }}>תאריך</th>
            <th style={{ padding: "12px 15px", textAlign: "left" }}>
              תוכן ההודעה
            </th>
            <th style={{ padding: "12px 15px", textAlign: "left" }}>
              רמת דחיפות
            </th>
            <th style={{ padding: "12px 15px", textAlign: "left" }}>סטטוס</th>
            <th style={{ padding: "12px 15px", textAlign: "left" }}>
              ביצוע פעולה
            </th>
            <th style={{ padding: "12px 15px", textAlign: "left" }}>הפצה</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr
              key={report.id}
              style={{
                borderBottom: "1px solid #ddd",
                backgroundColor:
                  report.urgency === "דחוף" ? "Red" : "lightGreen",
              }}
            >
              <td style={{ padding: "12px 15px" }}>{report.id}</td>
              <td style={{ padding: "12px 15px" }}>{report.name}</td>
              <td style={{ padding: "12px 15px" }}>{report.email}</td>
              <td style={{ padding: "12px 15px" }}>{report.city}</td>
              <td style={{ padding: "12px 15px" }}>{report.place}</td>
              <td style={{ padding: "12px 15px" }}>{report.date}</td>
              <td style={{ padding: "12px 15px" }}>{report.message}</td>
              <td style={{ padding: "12px 15px" }}>{report.urgency}</td>
              <td style={{ padding: "12px 15px" }}>{report.status}</td>

              <td style={{ padding: "12px 15px" }}>
                <button style={{ margin: "5px" }}>Update</button>
                <button onClick={() => handleDelete(report.id)}>Delete</button>
              </td>
              <td>
                <input type="email" placeholder="אימייל"></input>
                <button>Send</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportsTableCom;
