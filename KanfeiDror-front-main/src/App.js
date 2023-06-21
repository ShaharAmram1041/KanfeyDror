import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeRgular from "./pages/HomePageRegularUser/HomeRegular";
import FollowSingleReportPage from "./pages/FollowSingleReportPage/FollowSingleReportPage";
import Login from "./pages/LoginPage/Login";
import ReportsTable from "./pages/ReportsTablePage/ReportsTable";
import DataGraphs from "./components/DataGraphs/DataGraphs";
import Signup from "./components/Signup_Component/Signup";
import Layout from "./components/Header_Component/Layout";
import { AuthContextProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AddAdministrator from "./pages/AddAdministratorPage/AddAdministrator";
import RemoveAdministrator from "./pages/RemoveAdministratorPage/RemoveAdministrator";
import AdminPanel from "./pages/Admin_Panel_Page/AdminPanel";
import ManageData from "./pages/ManageData/ManageData";
import Footer from "./components/Footer_Component/Footer";

function App() {
  return (
    <div className="App">
      <Layout>
        <AuthContextProvider>
          <Routes>
            {/* public routs */}
            <Route path="/" element={<HomeRgular />} />
            <Route
              path="/FollowSingleReportPage"
              element={<FollowSingleReportPage />}
            />
            <Route path="/Login" element={<Login />} />

            {/* we want to protect this routs */}
            <Route
              path="/ReportsTable"
              element={
                <ProtectedRoute>
                  {" "}
                  <ReportsTable />{" "}
                </ProtectedRoute>
              }
            />
            <Route
              path="/DataGraphs"
              element={
                <ProtectedRoute>
                  {" "}
                  <DataGraphs />{" "}
                </ProtectedRoute>
              }
            />
            <Route
              path="/Signup"
              element={
                <ProtectedRoute>
                  {" "}
                  <Signup />{" "}
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminPanel />
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/manageData"
              element={
                <ProtectedAdminRoute>
                  <ManageData />
                </ProtectedAdminRoute>
              }
            ></Route>

            {/* <Route path="/AddAdministrator" element={<ProtectedAdminRoute><AddAdministrator /></ProtectedAdminRoute>} />
          <Route path="/RemoveAdministrator" element={<ProtectedAdminRoute><RemoveAdministrator /></ProtectedAdminRoute>} /> */}

            {/* catch all */}
            <Route path="*" element={<h1>PAGE NOT FOUND</h1>} />
          </Routes>
        </AuthContextProvider>
        <Footer />
      </Layout>
    </div>
  );
}

export default App;
