import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import LoginButton from "../Login_Button_Component/LoginButton";
import LogoutButton from "../Logout_Button_Component/Logout_button";
import { auth } from "../../firebase_setup/firebase";
import { onAuthStateChanged } from "firebase/auth";
import classes from "./Header.module.scss";

import { BiMenuAltRight } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [size, setSize] = useState({
    width: undefined,
    height: undefined,
  });

  const menuToggleHandler = () => {
    setMenuOpen((p) => !p);
  };

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (size.width > 768 && menuOpen) {
      setMenuOpen(false);
    }
  }, [size.width, menuOpen]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
      } else {
        console.log("user is logged out");
      }
    });
  }, []);
  return (
    <header className={classes.header}>
      <div className={classes.header__content}>
        <NavLink to="/" className={classes.header__content__logo}>
          כנפי
          <br />
          דרור
        </NavLink>
        <nav
          className={`${classes.header__content__nav} ${
            menuOpen && size.width < 768 ? classes.isMenu : ""
          }`}
        >
          <ul>
            <li>
              <NavLink to="/FollowSingleReportPage" onClick={menuToggleHandler}>
                מעקב אחרי דיווח
              </NavLink>
            </li>
            <li>
              <NavLink to="/" onClick={menuToggleHandler}>
                מסך הבית
              </NavLink>
            </li>

            {/* {auth.currentUser && ( */}
            <li>
              <NavLink to="/ReportsTable" onClick={menuToggleHandler}>
                ניהול דיווחים
              </NavLink>
            </li>
            <li>
              {auth.currentUser ? (
                <LogoutButton onClick={menuToggleHandler} />
              ) : (
                <LoginButton onClick={menuToggleHandler} />
              )}
            </li>
          </ul>
        </nav>
        <div className={classes.header__content__toggle}>
          {!menuOpen ? (
            <BiMenuAltRight onClick={menuToggleHandler} />
          ) : (
            <AiOutlineClose onClick={menuToggleHandler} />
          )}
        </div>
      </div>
    </header>
  );
}
