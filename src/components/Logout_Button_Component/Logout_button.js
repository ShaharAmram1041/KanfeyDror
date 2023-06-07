// import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { auth } from "../../firebase_setup/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function LogoutButton({ onClick }) {
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      await signOut(auth);
      onClick();
      navigate("/");
    } catch (e) {
      console.log(e.code);
    }
  };

  // const { logout, isAuthenticated } = useAuth0();
  return <button onClick={logoutUser}>Logout</button>;
  /*isAuthenticated &&*/
  // <button onClick={() => logout()}>Sign Out</button>;
  // <></>;
}

export default LogoutButton;
