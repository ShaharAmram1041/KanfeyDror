import React from "react";
import Footer from "./Footer";

import classes from "./Layout.module.scss";

const Footer__ = ({ children }) => {
  return (
    <>
      <div className={classes.container}>{children}</div>
      <Footer />
    </>
  );
};

export default  Footer__;
