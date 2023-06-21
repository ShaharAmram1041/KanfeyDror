import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import cities from "../Contact_Form_Component/cities.json";
import classes from "./DataGraphs.module.scss";
import Select from "react-select";
import dayjs from 'dayjs';
// import Highcharts from 'highcharts'; // Import Highcharts library
// import HighchartsReact from 'highcharts-react-official'; // Import HighchartsReact wrapper
import highcharts3d from 'highcharts/highcharts-3d'; // Import the 3D module (if you're using 3D charts)


import { parse } from 'date-fns';
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
  const [acceptReports, setAcceptReports] = useState(0);
  const [treatmentReports, setTreatmentReports] = useState(0);
  const [finishReports, setFinishReports] = useState(0);

  const handleInputCityChange = (event) => {
    setInputCity(event.target.value);
  };
  highcharts3d(Highcharts); // Enable the 3D module

  const filteredCities = cities.filter((city) => city.name.includes(inputCity));
  const [config, setConfig] = useState({
    chart: {
      type: "line",
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
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
        let i = 0;
        for(i = item.reportDate.length - 1 ;i >= 0; i--){
          if(item.reportDate[i] === '/')
            break;
        }
        const reportYear = item.reportDate.substring(i + 1, item.reportDate.length);
        return reportYear.toString() === year.toString();
      });
      const monthlyCounts = Array(12).fill(0);
      filteredReports.forEach((item) => {
        let i, monthIndex;
        let j = null;
        for(i = 0; i < item.reportDate.length; i++){
          if(item.reportDate[i] === '/' && j === null){
             j = i;
             continue;
          }
          if(item.reportDate[i] === '/' && j !== null){
            monthIndex = item.reportDate.substring(j + 1, i);
            break;
          }
        }
        if(monthIndex[0] === '0')
          monthIndex = monthIndex[1];
        
        if(monthIndex > 0)
          monthlyCounts[monthIndex - 1]++;
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
        const reportDate = parse(item.reportDate, 'dd/MM/yyyy', new Date());
        let i = 0;
        for(i = item.reportDate.length - 1 ;i >= 0; i--){
          if(item.reportDate[i] === '/')
            break;
        }
        const reportYear = item.reportDate.substring(i + 1, item.reportDate.length);
        if(reportYear.toString() === year.toString() && item.city === city){
          return reportDate;
        }
      });
      const monthlyCounts = Array(12).fill(0);
      filteredReports.forEach((item) => {
        let i, monthIndex;
        let j = null;
        for(i = 0; i < item.reportDate.length; i++){
          if(item.reportDate[i] === '/' && j === null){
             j = i;
             continue;
          }
          if(item.reportDate[i] === '/' && j !== null){
            monthIndex = item.reportDate.substring(j + 1, i);
            break;
          }
        }
        if(monthIndex[0] === '0')
          monthIndex = monthIndex[1];
        
        if(monthIndex > 0)
          monthlyCounts[monthIndex - 1]++;
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

      const querySnapshot4 = await getDocs(
        query(reportCollectionRef, where("status", "==", "התקבל"))
      );
      const querySnapshot5 = await getDocs(
        query(reportCollectionRef, where("status", "==", "בטיפול"))
      );
      const querySnapshot6 = await getDocs(
        query(reportCollectionRef, where("status", "==", "הסתיים"))
      );
      setAcceptReports(querySnapshot4.size);
      setTreatmentReports(querySnapshot5.size);
      setFinishReports(querySnapshot6.size);
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

//************************************************** */

  const config2 = {
    chart: {
      type: 'pie',
      options3d: {
          enabled: true,
          alpha: 45
      },
      plotBorderWidth: 2,

    },
    title: {
      text: 'חלוקה לפי סטטוס טיפול',
      align: 'center'
  }, 
  plotOptions: {
      pie: {
          innerSize: 100,
          depth: 70,
          colors: ['#FFC107', '#2196F3', '#4CAF50'] // Custom colors for the pie slices
      }
  },
  series: [{
    name:'כמות פניות',
      data: [
          ['התקבל', acceptReports],
          ['בטיפול', treatmentReports],
          ['הסתיים', finishReports],
      ]
  }]
  };


  const seriesData = [
    {
      name: 'דחוף',
      y: countUrgency
    },
    {
      name: 'לא דחוף',
      y: countNotUrgency
    }
  ];
 

  const config3 = {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 2,
        marginTop: 43, // Adjust the marginTop value to move the title outside the border
    },
    title: {
      text: 'חלוקה לפי סטטוס דחיפות',
      align: 'center'
  },
    plotOptions: {
        pie: {
            dataLabels: {
                distance: -50,
                style: {
                    fontWeight: 'bold',
                    color: 'white'
                }
            },
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '75%'],
            size: '110%',
            colors: ['#ff0000', '#00FF00'] // Custom colors (darker red and green)
          }
    },
    series: [
          {
            type: 'pie',
            name: 'כמות',
            innerSize: '50%',
            data: seriesData
          }
        ]
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

      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 50%', minWidth: '300px' }}>
          <HighchartsReact highcharts={Highcharts} options={config2} />
        </div>
          <div className={classes.pie_chart_container} style={{ flex: '1 1 50%', minWidth: '300px' }}>
          <HighchartsReact highcharts={Highcharts} options={config3} />
          </div>
          
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
