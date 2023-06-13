import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LoginButton from "../Login_Button_Component/LoginButton";
import LogoutButton from "../Logout_Button_Component/Logout_button";
import { auth, db } from "../../firebase_setup/firebase";
import { onAuthStateChanged } from "firebase/auth";
import classes from "./Header.module.scss";
import { collection, doc, getDoc } from "firebase/firestore";
import { BiMenuAltRight } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import logoKanfeiDror from "../../photos/logoKanfeiDror.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRegularUser, setIsRegularUser] = useState(false);
  const navigate = useNavigate();

  const checkUserRoles = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const adminRef = doc(collection(db, "AdminUsers"), user.email);
        const adminDoc = await getDoc(adminRef);
        if (adminDoc.exists()) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

        const regularRef = doc(collection(db, "RegularUsers"), user.email);
        const regularDoc = await getDoc(regularRef);
        if (regularDoc.exists()) {
          setIsRegularUser(true);
        } else {
          setIsRegularUser(false);
        }
      } else {
        setIsAdmin(false);
        setIsRegularUser(false);
      }
    } catch (error) {
      console.error("Error checking user roles:", error);
    }
  };

  useEffect(() => {
    checkUserRoles();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        checkUserRoles();
      }
    });

    return () => unsubscribe();
  }, []);

  const [size, setSize] = useState({
    width: undefined,
    height: undefined,
  });

  const menuToggleHandler = () => {
    setMenuOpen((p) => !p);
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const handleLogout = () => {
    setMenuOpen(false);
    navigate("/");
  };

  const handleLogin = () => {
    setMenuOpen(false);
    navigate("/");
  };

  const manageData = () => {
    setMenuOpen((p) => !p);
    navigate("/manageData");
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
        // console.log("user is logged out");
      }
    });
  }, []);

  return (
    <header className={classes.header}>
      <div className={classes.header__content}>
        <NavLink to="/" className={classes.header__content__logo}>
          <img src={logoKanfeiDror} alt="Logo" />
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

            {isAdmin && auth.currentUser && (
              <>
                <li>
                  <NavLink to="/manageData" onClick={manageData}>
                    ניהול מאגר מידע
                  </NavLink>
                </li>
              </>
            )}

            {auth.currentUser && (
              <li>
                <NavLink to="/ReportsTable" onClick={menuToggleHandler}>
                  ניהול דיווחים
                </NavLink>
              </li>
            )}

            {isAdmin && auth.currentUser && (
              <>
                <li>
                  <NavLink to="/admin" onClick={menuToggleHandler}>
                    ניהול משתמשים
                  </NavLink>
                </li>
              </>
            )}

            <li>
              <NavLink to="/" onClick={menuToggleHandler}>
                מסך הבית
              </NavLink>
            </li>

            <li>
              {auth.currentUser ? (
                <LogoutButton onClick={handleLogout} />
              ) : (
                <LoginButton onClick={handleLogin} />
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
