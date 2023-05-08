import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase_setup/firebase";
import { deleteDoc, doc } from "firebase/firestore";

function ReportsTableCom() {
  const [reports, setReports] = useState([]);

  const handleDelete = async (id) => {
    try {
      const reportDocRef = doc(db, "Reports", id);
      await deleteDoc(reportDocRef);
      setReports(reports.filter((report) => report.id !== id));
    } catch (error) {
      console.error("Error deleting report: ", error);
    }
  };

  const fetchReports = async () => {
    await getDocs(collection(db, "Reports")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setReports(newData);
    });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (!auth.currentUser) {
    return <div>אינך מורשה לצפות בדף זה. אנא התחבר כדי לצפות בו.</div>;
  }

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
                <button style={{ margin: "5px" }}>עריכה</button>
                <button onClick={() => handleDelete(report.id)}>מחיקה</button>
              </td>
              <td>
                <input type="email" placeholder="אימייל"></input>
                <button>שלח</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportsTableCom;
