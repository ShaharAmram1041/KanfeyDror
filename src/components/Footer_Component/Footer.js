import classes from "./Footer.module.scss";
import FacebookIcon from "@mui/icons-material/Facebook";
import WebIcon from "@mui/icons-material/Web";

const Footer = () => {
  return (
    <div className={classes.page_container}>
      <div className={classes.content}></div>
      <div className={classes.footer}>
        <div dir="rtl" className={classes.footer_social}>
          <br />

          <a href="https://www.facebook.com/kanfeydror/">
            <FacebookIcon style={{ fontSize: 40 }} />
          </a>

          <a href="https://kanfeydror.org/">
            <WebIcon style={{ fontSize: 40 }} />
          </a>
        </div>
        <div dir="rtl" className={classes.footer_content}>
          <h3>צור קשר:</h3>
          <h4>כנפי דרור- תמיכה וסיוע לילדים במצבי חרם והדרה חברתית</h4>
          <p>טלפון: 02-5664144</p>
          <p>מוקד: 105</p>
          <p>מייל: kanfeidror@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
