import React from "react";
import AddAdministrator from "../AddAdministratorPage/AddAdministrator";
import RemoveAdministrator from "../RemoveAdministratorPage/RemoveAdministrator";

export default function AdminPanel() {
  return (
    <div className="">
      <h2>ניהול משתמשים</h2>
      <AddAdministrator />
      <RemoveAdministrator />
    </div>
  );
}
