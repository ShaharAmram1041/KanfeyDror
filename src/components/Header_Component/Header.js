import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../Login_Button_Component/LoginButton";
import LogoutButton from "../Logout_Button_Component/Logout_button";
import logo from "../../photos/logo-Dror.png"; // import the logo image

export default function Header() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  return (
    <header className={styles.nav}>
      <nav>
        <ul>
          <li className={styles.logo}>
            <img src={logo} alt="Logo" />
          </li>
          <li>
            <NavLink to="/FollowSingleReportPage">מעקב אחרי דיווח</NavLink>
          </li>
          <li>
            <NavLink to="/">מסך הבית</NavLink>
          </li>

          {isAuthenticated ? (
            <>
              {/* <li>
                <NavLink to="/EditInformation">עריכת מידע</NavLink>
              </li> */}
              <li>
                <NavLink to="/ReportsTable">ניהול דיווחים</NavLink>
              </li>
            </>
          ) : null}
          <LoginButton />
          <LogoutButton />
        </ul>
      </nav>
    </header>
  );
}
