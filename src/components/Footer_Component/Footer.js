import React from 'react';
import './footer.scss';
import pic1 from "../../photos/instagram-logo.png"; // Tell webpack this JS file uses this image
import pic2 from "../../photos/facebook-logo.png";
import pic3 from "../../photos/logo-Dror.png";
const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="social-media">
          <img src={pic3} alt="" />
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
           <img src={pic1} alt="Instagram" />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <img src={pic2} alt="Facebook" />
          </a>
        </div>
        <div className="contact-info">
          <p>Phone: 02-5664144</p>
          <p>Email: example@gmail.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
