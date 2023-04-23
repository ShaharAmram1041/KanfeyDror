import React, { useState } from "react";
import ContactForm from "./contactForm/ContactForm";
function FollowReport() {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div>
      <button onClick={toggleModal}>הגשת דיווח</button>
      {/* <textarea placeholder="...כתוב את התוכן כאן"></textarea> */}
      {showModal && <ContactForm />}
    </div>
  );
}

export default FollowReport;
