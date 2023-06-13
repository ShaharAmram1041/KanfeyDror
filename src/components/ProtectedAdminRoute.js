import { Navigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase_setup/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const ProtectedAdminRoute = ({ children }) => {
  const [userAccess, setUserAccess] = useState(null);

  useEffect(() => {
    const fetchUserAccess = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (user) {
          const email = user.email;
          const adminUserDocRef = doc(db, "AdminUsers", email);
          const adminUserDocSnapshot = await getDoc(adminUserDocRef);
          
          if (adminUserDocSnapshot.exists()) {
            setUserAccess("Admin");
          } else {
            setUserAccess("Regular");
          }
        }
      } catch (error) {
        console.error("Error fetching user access: ", error);
      }
    };

    fetchUserAccess();
  }, []);


  if (!userAccess) {
    // Redirect to the home page if user access is not determined yet
    return null;
  }

  if (userAccess !== "Admin") {
    // Redirect to the home page if user is not an admin
    return <Navigate to='/' />;
  }

  // Allow access to all routes if the user is an admin
  return children;
};

export default ProtectedAdminRoute;
