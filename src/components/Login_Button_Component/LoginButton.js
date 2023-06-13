// import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
// import { auth } from "../../firebase_setup/firebase";
import { useNavigate } from "react-router-dom";

function LoginButton({ onClick }) {
  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      onClick();
      navigate("/Login");
    } catch (e) {
      console.log(e.code);
      console.log("im here!");
    }
  };

  // const { logout, isAuthenticated } = useAuth0();
  return <button onClick={loginUser}>Login</button>;
  /*isAuthenticated &&*/
  // <button onClick={() => logout()}>Sign Out</button>;
  // <></>;
}

export default LoginButton;
