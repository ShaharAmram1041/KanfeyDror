import classes from "./Footer.module.scss";
import FacebookIcon from "@mui/icons-material/Facebook";
import WebIcon from "@mui/icons-material/Web";
const Footer = () => {
  return (
    <div className={classes.page_container}>
      <div className={classes.content}></div>
      <div className={classes.footer}>
        <div dir="rtl" className={classes.footer_content}>
          <h3>אנשי קשר רלוונטים</h3>
          <p>כנפי דרור: 02-5664144 </p>
          <p>מוקד: 105</p>
        </div>
        <div dir="rtl" className={classes.footer_social}>
          <h3>עיקבו אחרינו</h3>
          <ul>
            <li>
              <a href="https://www.facebook.com/kanfeydror/">
                <FacebookIcon />
              </a>
            </li>
            <li>
              <a href="https://kanfeydror.org/">
                <WebIcon />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
