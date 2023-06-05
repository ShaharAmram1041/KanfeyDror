import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import pic1 from "../../photos/notPrivatePhoto.png"; // Tell webpack this JS file uses this image
import pic2 from "../../photos/privatePhoto.png"; // Tell webpack this JS file uses this image
import logo from "../../photos/logo-Dror.png";

export default function ReportFormPage() {
  return (
    <div className="square-component">
      <div className="top-text">!אני רוצה לדווח על חרם</div>
      <div className="photo-buttons">
        <Link to="/report-form/not-anonymous">
          <div className="photo-button">
            <img src={pic1} alt="First Photo" />
            {/* <div className="button-text">לא אנונימי</div> */}
          </div>
        </Link>
        <Link to="/report-form/anonymous">
          <div className="photo-button">
            <img src={pic2} alt="Second Photo" />
            {/* <div className="button-text">אנונימי</div> */}
          </div>
        </Link>
      </div>
      <div className="bottom-photo">
        <img src={logo} alt="Logo" />
      </div>
    </div>
  );
}