import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeRgular from "./pages/HomePageRegularUser/HomeRegular";
import FollowSingleReportPage from "./pages/FollowSingleReportPage/FollowSingleReportPage";
import Login from "./pages/LoginPage/Login";
import ReportsTable from "./pages/ReportsTablePage/ReportsTable";
import DataGraphs from "./components/DataGraphs/DataGraphs";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "./firebase_setup/firebase";
import Layout from "./components/Header_Component/Layout";

function App() {
  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       // User is signed in, see docs for a list of available properties
  //       // https://firebase.google.com/docs/reference/js/firebase.User
  //       const uid = user.uid;
  //       // ...
  //       console.log("uid", uid);
  //     } else {
  //       // User is signed out
  //       // ...
  //       console.log("user is logged out");
  //     }
  //   });
  // }, []);
  // return (
  //   <div className="App">
  //     <Router>
  //       <Routes>
  //         {/* public routs */}
  //         <Route path="/" element={<HomeRgular />} />
  //         <Route
  //           path="/FollowSingleReportPage"
  //           element={<FollowSingleReportPage />}
  //         />

  //         {/* we want to protect this routs */}
  //         <Route path="ReportsTable" element={<ReportsTable />} />

  //         <Route path="/DataGraphs" element={<DataGraphs />} />

  //         {/* catch all */}
  //         <Route path="*" element={<h1>PAGE NOT FOUND</h1>} />
  //       </Routes>
  //     </Router>
  //   </div>
  // );

  return (
    <Router>
      <Layout>
        <Routes>
          {/* public routs */}
          <Route path="/" element={<HomeRgular />} />
          <Route
            path="/FollowSingleReportPage"
            element={<FollowSingleReportPage />}
          />

          {/* we want to protect this routs */}
          <Route path="ReportsTable" element={<ReportsTable />} />

          <Route path="/DataGraphs" element={<DataGraphs />} />

          {/* catch all */}
          <Route path="*" element={<h1>PAGE NOT FOUND</h1>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
