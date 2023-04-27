import React, { useState } from "react";
import ContactForm from "../contactForm/ContactForm.js";

function SendReport() {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div>
      <button onClick={toggleModal}>הגשת דיווח</button>
      {showModal && <ContactForm />}
    </div>
  );
}

export default SendReport;
