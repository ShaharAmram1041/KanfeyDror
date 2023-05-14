import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase_setup/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { EmailForm } from "../Email_Cpomponent/EmailForm";
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function ReportsTableCom() {
  const [reports, setReports] = useState([]);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const toggleEmailForm = () => {
    setShowEmailForm(!showEmailForm);
  };

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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: "80vh", }}>
      <TableContainer style={{
        width: '80%', height: '80%', overflow: 'auto', border:
          '1px solid black', borderRadius: '15px', background: 'white'
      }}>
        <Table>
          <TableHead> 
            <TableRow style={{ backgroundColor: 'black' }}>
              <TableCell align="right" style={{ color: 'white' }}>שם</TableCell>
              <TableCell align="right" style={{ color: 'white' }}>ID</TableCell>
              <TableCell align="right" style={{ color: 'white' }}>אימייל</TableCell>
              <TableCell align="right" style={{ color: 'white' }}>עיר</TableCell>
              <TableCell align="right" style={{ color: 'white' }}>מקום</TableCell>
              <TableCell align="right" style={{ color: 'white' }}>תאריך</TableCell>
              <TableCell align="right" style={{ color: 'white' }}>תוכן הודעה</TableCell>
              <TableCell align="right" style={{ color: 'white' }}>רמת דחיפות</TableCell>
              <TableCell align="right" style={{ color: 'white' }}>ביצוע פעולה</TableCell>
              <TableCell align="right" style={{ color: 'white' }}>עריכה</TableCell>
              <TableCell align="right" style={{ color: 'white' }}>עריכה</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow
                key={report.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {report.name}
                </TableCell>
                <TableCell align="right">{report.id}</TableCell>
                <TableCell align="right">{report.email}</TableCell>
                <TableCell align="right">{report.city}</TableCell>
                <TableCell align="right">{report.place}</TableCell>
                <TableCell align="right">{report.date}</TableCell>
                <TableCell align="right">{report.message}</TableCell>
                <TableCell align="right">
                  <div style={{
                    backgroundColor: report.urgency === "דחוף" ? "red" : "lightGreen",
                    width: '50px',
                    borderRadius: '15px',
                    padding: '20px',
                    margin: '0',
                  }}>
                    <span style={{ color: '#000000', fontWeight: 'bold', }}>{report.urgency}</span>
                  </div>
                </TableCell>

                <TableCell align="right">{report.status}</TableCell>
                <TableCell align="right">
                  <button align={{ margin: "8px" }}>עריכה</button>
                  <button onClick={() => handleDelete(report.id)}>מחיקה</button>
                </TableCell>
                <TableCell>
                  {/* <input type="email" placeholder="אימייל"></input> */}
                  <button onClick={toggleEmailForm}>שלח מייל</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ReportsTableCom;



