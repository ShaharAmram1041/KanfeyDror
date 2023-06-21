import React, { useState } from "react";
import AddAdministrator from "../AddAdministratorPage/AddAdministrator";
import RemoveAdministrator from "../RemoveAdministratorPage/RemoveAdministrator";
import classes from "./AdminPanel.module.scss";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
export default function AdminPanel() {
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [isRemoveAdminOpen, setIsRemoveAdminOpen] = useState(false);

  const toggleAddAdmin = () => {
    setIsAddAdminOpen((prevIsOpen) => !prevIsOpen);
    setIsRemoveAdminOpen(false); // Close the remove admin button
  };

  const toggleRemoveAdmin = () => {
    setIsRemoveAdminOpen((prevIsOpen) => !prevIsOpen);
    setIsAddAdminOpen(false); // Close the add admin button
  };

  return (
    <div className={`${classes.container} ${classes.center}`}>
      <h2 className={classes.title}>ניהול משתמשים</h2>
      <button className={classes.removeAdminButton} onClick={toggleRemoveAdmin}>
        {isRemoveAdminOpen ? (
          <React.Fragment>
            <PersonRemoveIcon />
            מחיקת מנהל
          </React.Fragment>
        ) : (
          <React.Fragment>
            <PersonRemoveIcon />
            מחיקת מנהל
          </React.Fragment>
        )}
      </button>
      <button className={classes.addAdminButton} onClick={toggleAddAdmin}>
        {isAddAdminOpen ? (
          <React.Fragment>
            <PersonAddAlt1Icon />
            הוספת מנהל
          </React.Fragment>
        ) : (
          <React.Fragment>
            <PersonAddAlt1Icon />
            הוספת מנהל
          </React.Fragment>
        )}
      </button>

      {isAddAdminOpen && <AddAdministrator />}

      {isRemoveAdminOpen && <RemoveAdministrator />}
    </div>
  );
}
