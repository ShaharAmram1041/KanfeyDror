import React, { useState } from "react";
import ContactForm from "../contactForm/ContactForm";
import "./FollowReport.css";

function FollowReport() {
  // const [showModal, setShowModal] = useState(false);
  // const toggleModal = () => {
  //   setShowModal(!showModal);
  // };

  const [searchPerId, setSearchPerId] = useState("");
  console.log(searchPerId);
  return (
    <div>
      <div class="box">
        <form name="search">
          <input
            type="text"
            // dir="rtl"
            class="input"
            name="txt"
            readOnly={false}
            onmouseout="this.value = ''; this.blur();"
            onChange={(event) => {
              setSearchPerId(event.target.value);
            }}
          ></input>
          <button className="search-btn"> 🔍</button>
        </form>
      </div>

      {/* <label> :תוכן</label>
      <textarea
        dir="rtl"
        placeholder="הדבק את מספר הפנייה שלך כאן"
        onChange={(event) => {
          setSearchPerId(event.target.value);
        }}
      /> */}
      {/* <button onClick={toggleModal}>הגשת דיווח</button> */}
      {/* <textarea placeholder="...כתוב את התוכן כאן"></textarea> */}
      {/* {showModal && <ContactForm />} */}
    </div>
  );
}

export default FollowReport;
