import React, { useState, useEffect } from "react";
import axios from "axios";
import { uid } from "uid";
import styles from "./ReportFormStyle.module..css";
import { db } from "../../firebase_setup/firebase";
import { addDoc, collection } from "firebase/firestore";

export default function ReportForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [city] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  
  const api_url = "https://data.gov.il/api/3/action/datastore_search";
  const cities_resource_id = "5c78e9fa-c2e2-4771-93ff-7f400a12f7ba";
  const city_name_key = "שם_ישוב";
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  const writeReportToDB = async (e) => {
    e.preventDefault();
    const uuid = uid();
    try {
      const docRef = await addDoc(collection(db, "Reports"), {
        name,
        email,
        message,
        city,
        place,
        date,
        urgency: "דחוף",
        status: "בטיפול",
        uuid,
      });
      alert("Your ID is: " + docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };


  useEffect(() => {
    populateDataList(cities_resource_id, city_name_key, setCities);
  }, []);

  const populateDataList = (resourceId, fieldName, setState) => {
    axios
      .get(api_url, {
        params: {
          resource_id: resourceId,
          limit: 32000,
        },
        responseType: "json",
      })
      .then((response) => {
        const records = response?.data?.result?.records || [];
        const dataList = records.map((record) => record[fieldName].trim());
        setState(dataList);
      })
      .catch((error) => {
        console.log("Couldn't get list for", fieldName, error);
      });
  };

  const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    setSelectedCity(selectedCity);
    populateDataList(
      { שם_ישוב: selectedCity },
      32000
    );
  };

  return (
    <form className={styles.form}>
      <h1 className={styles.title}>פרטים</h1>
      <div>
        <label className={styles.label}>שם</label>
        <input
          placeholder="שם"
          value={name}
          dir="rtl"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label>אימייל</label>
        <input 
          placeholder="אימייל"
          value={email}
          dir="rtl"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      
      <div>
        <label>עיר בה קרה המקרה *</label>
        <div className="city-dropdown-container">
          <input
            list="cities"
            value={selectedCity}
            onChange={handleCityChange}
            dir="rtl"
          />
          <datalist id="cities">
            {cities
              .filter((city) => city !== "לא רשום") // Filter out the "לא רשום" option
              .map((city) => (
                <option key={city} value={city} />
              ))}
          </datalist>
        </div>
      </div>
  

      <div>
        <label>איפה *</label>
        <input
          placeholder="בית ספר/ חוג/ פארק"
          value={place}
          dir="rtl"
          onChange={(e) => setPlace(e.target.value)}
        />
      </div>

      <div>
        <label>התאריך בו קרה המקרה *</label>
        <input
          placeholder="מתי קרה האירוע"
          value={date}
          type="date"
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <label>תיאור המקרה *</label>
        <textarea
          placeholder="כתוב את התוכן כאן"
          value={message}
          dir="rtl"
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </div>

      <button onClick={writeReportToDB}>שליחת דיווח</button>
    </form>
  );
}