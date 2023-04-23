import React, { useState } from "react";
function SendReport() {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div>
      <button onClick={toggleModal}>מעקב אחרי דיווח</button>
      {showModal && <div>מספר הדיווח</div>}
    </div>
  );
}

export default SendReport;
