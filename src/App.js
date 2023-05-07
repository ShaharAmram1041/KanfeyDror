import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeRgular from "./pages/HomePageRegularUser/HomeRegular";
import FollowSingleReportPage from "./pages/FollowSingleReportPage/FollowSingleReportPage";
import Login from "./pages/LoginPage/Login";
import ReportsTable from "./pages/ReportsTablePage/ReportsTable";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* public routs */}
          <Route path="/" element={<HomeRgular />} />
          <Route
            path="/FollowSingleReportPage"
            element={<FollowSingleReportPage />}
          />
          <Route path="/Login" element={<Login />} />

          {/* we want to protect this routs */}
          <Route path="ReportsTable" element={<ReportsTable />} />

          {/* catch all */}
          <Route path="*" element={<h1>PAGE NOT FOUND</h1>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
