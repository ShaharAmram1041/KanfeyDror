// import ContactForm from "./Pages/components/contactForm/ContactForm";
import "./App.css";

// import Information from "./Pages/components/Information";
// import FollowReport from "./Pages/components/FollowReport";
// import SendReport from "./Pages/components/SendReport";
// import Header from "./Pages/components/Header/Header";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  // useNavigate,
} from "react-router-dom";
import Home from "./Pages/HomePage/Home";
import Login from "./Pages/LoginPage/Login";
import { auth } from "./firebase_setup/firebase";
import { signOut } from "firebase/auth";
import Information from "./Pages/HomePage/components/InformationField/Information";
import FollowReport from "./Pages/HomePage/components/FollowReportPage/FollowReport";

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/";
    });
  };
  return (
    <Router>
      <nav>
        {/* <img /> */}
        <Link to="/followReport"> מעקב אחר דיווח</Link>
        <Link to="/"> מסך הבית</Link>
        {!isAuth ? (
          <Link to="/login"> התחברות</Link>
        ) : (
          <>
            <Link to="/admin"> עריכת מידע</Link>
            <button className="blackButton" onClick={signUserOut}>
              Log out
            </button>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Home isAuth={isAuth} />} />
        <Route path="/admin" element={<Information isAuth={isAuth} />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/followReport" element={<FollowReport />} />
      </Routes>
    </Router>
  );
}

export default App;



