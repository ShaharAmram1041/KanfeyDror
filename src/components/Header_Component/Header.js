import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";
import LoginButton from "../Login_Button_Component/LoginButton";
import LogoutButton from "../Logout_Button_Component/Logout_button";
import logo from "../../photos/logo-Dror.png";
import { auth, db } from "../../firebase_setup/firebase";
import { collection, doc, getDoc } from "firebase/firestore";

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRegularUser, setIsRegularUser] = useState(false);

  useEffect(() => {
    const checkUserRoles = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const adminRef = doc(collection(db, "AdminUsers"), user.email);
          const adminDoc = await getDoc(adminRef);
          if (adminDoc.exists()) {
            console.log("You are admin!");
            setIsAdmin(true);
          } 
          else {
            //console.log("You are not adminUser.");
            setIsAdmin(false);
          }

          const regularRef = doc(collection(db, "RegularUsers"), user.email);
          const regularDoc = await getDoc(regularRef);
          if (regularDoc.exists()) {
            //console.log("You are a RegularUser!");
            setIsRegularUser(true);
          } 
          else {
            //console.log("You are not a regular user.");
            setIsRegularUser(false);
          }
        } 
        else {
          setIsAdmin(false);
          setIsRegularUser(false);
          //console.log("User not logged in. isAdmin:", isAdmin);
        }
      } catch (error) {
        console.error("Error checking user roles:", error);
      }
    };

    checkUserRoles();
  }, []);

  return (
    <header className={styles.nav}>
      <nav>
        <ul>
          {/* ... */}

          {isAdmin && (
            <li>
              <NavLink to="/ReportsTable">ניהול דיווחים</NavLink>
            </li>
          )}
          {isRegularUser && (
            <li>
              <NavLink to="/ReportsTable">ניהול דיווחים</NavLink>
            </li>
          )}
          {isAdmin && (
            <li>
              <NavLink to="/AddAdministrator">Add Administrator</NavLink>
              <NavLink to="/RemoveAdministrator">Remove Administrator</NavLink>
            </li>
          )}
          {auth.currentUser ? <LogoutButton /> : <LoginButton />}
        </ul>
      </nav>
    </header>
  );
}