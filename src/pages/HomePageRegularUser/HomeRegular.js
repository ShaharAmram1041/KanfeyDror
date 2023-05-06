import React, { useState } from "react";
import ReportForm from "../../components/Contact_Form_Component/ReportForm";
import Header from "../../components/Header_Component/Header";
import EditInformationComponent from "../../components/Edit_Information_Component/EditInformationComponent";
import { useAuth0 } from "@auth0/auth0-react";
export default function Home() {
  const [showReportForm, setShowReportForm] = useState(false);
  const { isAuthenticated } = useAuth0();

  const toggleReportForm = () => {
    setShowReportForm(!showReportForm);
  };

  return (
    <div>
      <Header />
      <div>
        <p>
          תופעות החרם וההדרה החברתית הפוגענית המתרחשת בבתי הספר ובחברות הילדים,
          מותירות צלקות עמוקות בנפשות הנפגעים, ומביאות מדי שנה גם לתופעות
          נוראיות של אובדנות בקרב ילדים ובוגרים. הן מתרחשות גם על רקע התעלמות
          חברת המבוגרים והקהילה, ו/או תפיסתן כתוצר בלתי נמנע של חברת הילדים
          במערכת החינוך מתוך תפיסה ש"אין מה לעשות…" "כנפי דרור" מבקשת להוביל
          מאבק עיקש בתופעות אלו ולחולל תיקון חברתי משמעותי כדי להציל חיים,
          כפשוטו. את העמותה הקימה משפחת אל עמי בשמו של בנם, דרור, צעיר נבון חכם
          ורגיש, שחווה פגיעה עמוקה של התעללות חברתית וחרם בילדותו, וידע במאמצים
          גדולים לצמוח משם ולהצליח בביה"ס, במכינה, בצבא, בלימודים, ובמשפחה. עד
          שצלקות הפגיעה הקשה מתקופת הילדות, שהותירו את חותמם העמוק בנפשו, שבו
          ונפתחו והכריעו אותו. "כי ילד שעשו עליו חרם, הוא אף פעם לא מחלים, הוא
          רק לובש בגדים של מבוגר" [נועם חורב]. "כנפי דרור" מכוונת לתיקון ושינוי
          משמעותי במציאות באמצעות פעולה בשני צירים מרכזיים: – הנעת שיח ציבורי
          וקהילתי משמעותי בנושא ההדרה החברתית הפוגענית, שינוי היחס והנורמה,
          וגיבוש תודעת אחריות אישית, משפחתית וקהילתית. – יצירת מוקדי התערבות
          וסיוע אינטגרטיביים במערכות הקהילה והחינוך, שידעו לפעול במשותף למניעה,
          להתמודדות בעת אירוע, ולליווי ילדים ומשפחות במצבי משבר. ייחוד אופן
          פעולת "כנפי דרור" הינו בפעולה המקבילה והמשלימה בשינוי השיח והתודעה מחד
          ובפיתוח המענה האורגני היישובי והקהילתי מאידך. וכן – ביכולת האינטגרציה
          בין מערכות החינוך והקהילה, הפורמליות והא-פורמליות. "כנפי דרור" תניע
          ותרתום את המערכת כולה להתמודדות מערכתית אפקטיבית עם האתגר, ואנו כבר
          בתהליכי חשיבה ועבודה עם החברה למתנסים, עיריית ירושלים וגופים נוספים,
          לקראת שנת הפעילות הראשונה.
        </p>
      </div>

      {isAuthenticated ? (
        <div>
          <button onClick={toggleReportForm}>
            {showReportForm ? "הסתר עריכת מידע" : "עריכת המידע"}
          </button>
          {showReportForm && <EditInformationComponent />}
        </div>
      ) : (
        <div>
          <button onClick={toggleReportForm}>
            {showReportForm ? "הסתר הגשת דיווח" : "הגש דיווח"}
          </button>
          {showReportForm && <ReportForm />}
        </div>
      )}
    </div>
  );
}
