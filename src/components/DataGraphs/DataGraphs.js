import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import cities from "../Contact_Form_Component/cities.json";
import classes from "./DataGraphs.module.scss";
import Select from "react-select";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function DataGraphs() {
  const [reports, setReports] = useState([]);
  const [year, setYear] = useState("");
  const [city, setCity] = useState("");
  const [inputCity, setInputCity] = useState("");
  const [schoolNum, setSchoolNum] = useState(0);
  const [youthNum, setYouthNum] = useState(0);
  const [otherNum, setOtherNum] = useState(0);
  const handleInputCityChange = (event) => {
    setInputCity(event.target.value);
  };


  const filteredCities = cities.filter((city) => city.name.includes(inputCity));
  const [config, setConfig] = useState({
    chart: {
      type: "line",
      plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
      options3d: {
        enabled: true,
        alpha: 10,
        beta: 25,
        depth: 50,
        viewDistance: 25,
      },
    },
    title: {
      display: true,
      text: "כמויות דיווחים לפי שנה, חודש ועיר",
      style: {
        fontSize: "40px", // Set the font size for the title
      },
    },
    xAxis: {
      title: {
        text: "חודשים",
      },
      categories: [
        "ינואר",
        "פברואר",
        "מרץ",
        "אפריל",
        "מאי",
        "יוני",
        "יולי",
        "אוגוסט",
        "ספטמבר",
        "אוקטובר",
        "נובמבר",
        "דצמבר",
      ],
    },
    yAxis: {
      title: {
        text: "כמות דיווחים",
      },
    },
    series: [
      {
        name: "דיווחים",
        data: [1, 5, 3, 4, 8, 8, 8, 8, 8, 8, 8, 8],
        color: "#007bff", 
        lineWidth: 1, 
      },
    ],
  });

  /* reading from firebase */
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Reports"));
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setReports(newData);
      } catch (error) {
        console.error("Error fetching reports: ", error);
      }
    };

    fetchReports();
  }, []);

  /*---------------------------------------------------------------------------------------*/
  /* by city */
  let places = [];
  places = reports
    .map((item) => item["city"])
    .filter(
      (value) => value !== null && value !== "" && !places.includes(value)
    );
  const placesCount = places.reduce((countMap, city) => {
    countMap[city] = (countMap[city] || 0) + 1;
    return countMap;
  }, {});

  const CityData = {
    labels: Object.keys(placesCount),
    datasets: [
      {
        data: Object.values(placesCount),
        backgroundColor: "rgba(108,47,212,0.58)",
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };

  /*---------------------------------------------------------------------------------------*/
  /* by urgency */
  const urgencyArr = reports
    .map((item) => item["urgency"])
    .filter((value) => value !== null && value !== "");
  const countUrgency = urgencyArr.filter(
    (urgency) => urgency === "דחוף"
  ).length;
  const countNotUrgency = urgencyArr.length - countUrgency;

  const UrgencyData = {
    labels: ["דחוף", "לא דחוף"],
    datasets: [
      {
        data: [countUrgency, countNotUrgency],
        backgroundColor: ["rgba(233, 31, 19, 1)", "rgba(15, 255, 11, 1)"],
        borderWidth: 1,
      },
    ],
  };

  /*---------------------------------------------------------------------------------------*/
  /* by year and city => months */
  /* when click on the search */
  function handleSearch(event) {
    if (city === "") {
      const filteredReports = reports.filter((item) => {
        const reportYear = new Date(item.reportDate).getFullYear();
        return reportYear.toString() === year.toString();
      });

      const monthlyCounts = Array(12).fill(0);
      filteredReports.forEach((item) => {
        const monthIndex = new Date(item.reportDate).getDate() - 1;
        monthlyCounts[monthIndex]++;
      });

      const updatedConfig = {
        ...config,
        series: [
          {
            data: monthlyCounts,
          },
        ],
      };

      setConfig(updatedConfig);
    } else {
      const filteredReports = reports.filter((item) => {
        const reportYear = new Date(item.reportDate).getFullYear();
        return (
          reportYear.toString() === year.toString() && item["city"] === city
        );
      });

      const monthlyCounts = Array(12).fill(0);
      filteredReports.forEach((item) => {
        const monthIndex = new Date(item.reportDate).getDate() - 1;
        monthlyCounts[monthIndex]++;
      });

      const updatedConfig = {
        ...config,
        series: [
          {
            data: monthlyCounts,
          },
        ],
      };
      setConfig(updatedConfig);
    }
  }

  /*----------------------------------------by places =>[school , Youth, other ]-----------------------------------*/

  Highcharts.setOptions({
    accessibility: {
      enabled: false,
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      const reportCollectionRef = collection(db, "Reports");
      const querySnapshot1 = await getDocs(
        query(reportCollectionRef, where("place", "==", "בית ספר"))
      );
      const querySnapshot2 = await getDocs(
        query(reportCollectionRef, where("place", "==", "תנועת נוער"))
      );
      const querySnapshot3 = await getDocs(
        query(reportCollectionRef, where("place", "==", "אחר"))
      );
      const allQuerySnapshot = await getDocs(query(reportCollectionRef));

      if (allQuerySnapshot.size !== 0) {
        const schoolPercentage =
          (querySnapshot1.size / allQuerySnapshot.size) * 100;
        const youthPercentage =
          (querySnapshot2.size / allQuerySnapshot.size) * 100;
        const otherPercentage =
          (querySnapshot3.size / allQuerySnapshot.size) * 100;

        setSchoolNum(schoolPercentage);
        setYouthNum(youthPercentage);
        setOtherNum(otherPercentage);
      }
    };

    fetchData();
  }, []);

  const config1 = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      text: "חלוקת מקומות שבהם נעשים חרמות",
      align: "center",
      style: {
        fontSize: "40px", // Set the font size for the title
      },
    },
    tooltip: {
      pointFormat: "{point.y}%",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: " {point.percentage:.1f}% : <b>{point.name}</b>",
        },
      },
    },
    series: [
      {
        colorByPoint: true,
        data: [
          {
            name: "בתי ספר",
            y: schoolNum,
            sliced: true,
            selected: true,
          },
          schoolNum !== 0 && {
            name: "תנועות נוער",
            y: youthNum,
          },
          otherNum !== 0 && {
            name: "אחר",
            y: otherNum,
          },
        ].filter(Boolean), // Remove any falsy values
      },
    ],
  };

  const handleCityChange = (selectedOption) => {
    setCity(selectedOption ? selectedOption.value : "");
  };

  const options = cities
    .filter((city) => city !== "")
    .map((city) => ({
      value: city.name,
      label: city.name,
    })).concat({ value: "", label: "--כל הערים--" });

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: 0,
      // border: "none",
      boxShadow: "none",
      minHeight: "1px",
    }),
  };

  const selectedOption = options.find((option) => option.value === city);

  return (
    <div>
      <div className={classes.bar_chart_container}>
        <Bar
          data={CityData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false,
                position: "top",
              },
              title: {
                display: true,
                text: "כמות דיווחים לפי ערים",
                font: {
                  size: 40, // Set the font size for the title
                },
              },
            },
          }}
        ></Bar>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <div className={classes.pie_chart_container} >
      <Pie
        data={UrgencyData}
        options={{
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              font: {
                size: 18, // Set the font size for the labels
              },
            },
          },
          title: {
            display: true,
            text: "חלוקה של פניות לפי סטטוס דחיפות",
            font: {
              size: 70, // Set the font size for the title
            },
          },
        },
       }}
      ></Pie>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <div>
        <div>
          <div className={classes.search_div}>
            <div>
              <button
                type="button"
                onClick={handleSearch}
                className={classes.search_button}
              >
                חפש
              </button>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "10px",
              }}
            >
              <Select
                defaultValue={selectedOption}
                className={classes.citySelect}
                value={selectedOption}
                onChange={handleCityChange}
                styles={customStyles}
                options={options}
                placeholder="בחר עיר"
                isRtl
                isSearchable
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="yearSelect" className={classes.year_select_label}>
                בחר שנה להצגה
              </label>
              <select
                id="yearSelect"
                style={{ height: "40px", marginBottom: "10px" }}
                onChange={(event) => setYear(event.target.value)}
              >
                <option value={parseInt(new Date().getFullYear()) - 5}>
                  {parseInt(new Date().getFullYear()) - 5}
                </option>
                <option value={parseInt(new Date().getFullYear()) - 4}>
                  {parseInt(new Date().getFullYear()) - 4}
                </option>
                <option value={parseInt(new Date().getFullYear()) - 3}>
                  {parseInt(new Date().getFullYear()) - 3}
                </option>
                <option value={parseInt(new Date().getFullYear()) - 2}>
                  {parseInt(new Date().getFullYear()) - 2}
                </option>
                <option value={parseInt(new Date().getFullYear()) - 1}>
                  {parseInt(new Date().getFullYear()) - 1}
                </option>
                <option value={parseInt(new Date().getFullYear())}>
                  {parseInt(new Date().getFullYear())}
                </option>
              </select>
            </div>
          </div>
        </div>
        <HighchartsReact highcharts={Highcharts} options={config} />
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <div>
        <HighchartsReact highcharts={Highcharts} options={config1} />
      </div>
    </div>
  );
}

export default DataGraphs;
