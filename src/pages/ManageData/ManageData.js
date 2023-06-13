import React, { useMemo, useEffect, useState, useRef } from "react";
import { db } from "../../firebase_setup/firebase";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import cities from "../../components/Contact_Form_Component/cities.json";
import { isValidPhoneNumber } from 'libphonenumber-js';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  query,
  where,
  addDoc,
} from "firebase/firestore";
// import { EmailForm } from "../Email_Cpomponent/EmailForm";
import MaterialReactTable from "material-react-table";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Swal from "sweetalert2";
import classes from "./ManageData.module.scss";
import {
  Box,
  IconButton,
  Button,
  Typography,
  Tooltip,
  Icon,
  TextField,
  Modal,
} from "@mui/material";
import { green } from "@mui/material/colors";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import { ExportToCsv } from "export-to-csv"; //or use your library of choice here
// import { Formik, Field, Form, ErrorMessage} from 'formik';
// import { Direction } from "react-toastify/dist/utils";

const ManageData = () => {
  const [data, setData] = useState([]);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [userAccess, setUserAccess] = useState(null);
  const tableRef = useRef(null); // Ref to access the table instance
  const [newCity, setNewCity] = useState("");
  const [newMail, setNewMail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [legal,setLegal] = useState(true);
  const [legalPhone, setLegalPhone] = useState(true);

  useEffect(() => {
    data.length > 0 ? setShowExport(true) : setShowExport(false);
  }, [data]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "role",
        header: "תפקיד",
        align: "right",
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        enableEditing: true, //disable editing on this column
      },
      {
        accessorKey: "phone",
        header: "מספר טלפון",
        align: "right",
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        enableEditing: true, //disable editing on this column
      },
      {
        accessorKey: "mail",
        header: "כתובת מייל",
        align: "right",
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        enableEditing: true, //disable editing on this column
      },
      {
        accessorKey: "city",
        header: "עיר",
        enableSorting: false, //disable sorting on this column
        align: "right",
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        enableEditing: true, //disable editing on this column
      },
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "DB"));
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setData(newData);
      } catch (error) {
        console.error("Error fetching data from Firestore: ", error);
      }
    };

    fetchData();
  }, []);

  //doto
  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    try {
      const reportCollectionRef = collection(db, "DB");
      const querySnapshot = await getDocs(query(reportCollectionRef));

      if (querySnapshot.size > 0) {
        const docSnapshot = querySnapshot.docs[row.index].id;
        const reportDocRef = doc(db, "DB", docSnapshot);
        await updateDoc(reportDocRef, values);
        setData((prevData) => {
          const updatedData = [...prevData];
          updatedData[row.index] = values;
          return updatedData;
        });
      }
    } catch (error) {
      console.error("Error saving report: ", error);
    }
    exitEditingMode(); // required to exit editing mode
  };

  useEffect(() => {
    const fetchUserAccess = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const email = user.email;
          const adminUserDocRef = doc(db, "AdminUsers", email);
          const adminUserDocSnapshot = await getDoc(adminUserDocRef);
          if (adminUserDocSnapshot.exists()) {
            setUserAccess("Admin");
          } else {
            setUserAccess("Regular");
          }
        }
      } catch (error) {
        console.error("Error fetching user access: ", error);
      }
    };

    fetchUserAccess();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newCity === "") return;
    if(newPhone === "" && newMail === ""){
        setLegal(false);
        return; // Abort adding the data
    }
    if(!isEmailValid || !legalPhone)
      return;
    try {
      // Check if the data already exists in the Firestore collection "DB"
        const querySnapshot = await getDocs(
          query(
            collection(db, "DB"),
            where("city", "==", newCity),
            where("mail", "==", newMail),
            where("phone", "==", newPhone),
            where("role", "==", newRole)
          )
        );     

      if (!querySnapshot.empty) {
        setShowEmailForm(false);
        Swal.fire({
          html: '<div dir="rtl">' + '<h1 dir="rtl">מידע כבר קיים במערכת!</h1>' + "</div>",
          icon: "success",
        });
        return; // Abort adding the data
      }

      // Add the new data to the Firestore collection "DB"
      const newData = {
        city: newCity,
        mail: newMail,
        phone: newPhone,
        role: newRole,
      };
      const docRef = await addDoc(collection(db, "DB"), newData);
      // Clear the form fields
      setNewCity("");
      setNewMail("");
      setNewPhone("");
      setNewRole("");
      setIsEmailValid(true);
      setLegal(true);
      // Update the data array with the new data
      setData((prevData) => [...prevData, newData]);
    } catch (error) {
      console.error("Error adding data to Firestore: ", error);
    }
    setShowEmailForm(false);
  };

  const handleAdd = async () => {
    setShowEmailForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      html:
        '<div dir="rtl">' +
        '<h1 dir="rtl">' +
        "האם אתה בטוח שברצונך למחוק מידע זה?" +
        "</h1>" +
        '<div dir="rtl">' +
        "זוהי פעולה שלא ניתנת לשחזר" +
        "</div>" +
        "</div>",

      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "כן",
      cancelButtonText: "לא",
    });

    if (confirmed.isConfirmed) {
      try {
        const reportCollectionRef = collection(db, "DB");
        const querySnapshot = await getDocs(query(reportCollectionRef));

        if (!querySnapshot.empty) {
          const documentId = querySnapshot.docs[id].id;
          const reportDocRef = doc(db, "DB", documentId);
          await deleteDoc(reportDocRef);
          const newData = [...data];
          newData.splice(id, 1);
          setData(newData);
        }
        Swal.fire({
          html: '<div dir="rtl">' + '<h1 dir="rtl">נמחק!</h1>' + "</div>",
          icon: "success",
        });
      } catch (error) {
        console.error("Error deleting report: ", error);
      }
    }
  };

  const handleNewEmailChange = (e) => {
    const str = e.target.value;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const emails = str.split(",").map((email) => email.trim());
    const isValid = emails.every((email) => emailRegex.test(email));
    setNewMail(str);
    if (str === "") setIsEmailValid(true);
    else setIsEmailValid(isValid);
    if(isEmailValid)
      setLegal(true)
  };

  return (
    <>
      <Modal open={showEmailForm} onClose={() => setShowEmailForm(false)}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <form onSubmit={handleSubmit}  dir="rtl">
            <div style={{ backgroundColor: "white", padding: "20px" }}>
              {/* Exit button */}
              <Button
                variant="text"
                color="inherit"
                margin="0"
                onClick={() => setShowEmailForm(false)}
              >
                <CancelIcon />
              </Button>
              {/* Form fields */}
            {/* <div className={classes.formControl}> */}
              <select
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  fontSize: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
              >
                <option value="" disabled>
                  בחר עיר
                </option>
                {cities
                  .filter((city) => city !== "")
                  .map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
              </select>
            {/* </div> */}
              <TextField
                dir="rtl"
                label="כתובת מייל"
                type="email"
                fullWidth
                margin="normal"
                value={newMail}
                onChange={handleNewEmailChange}
                error={!isEmailValid}
                helperText={!isEmailValid ? "כתובת מייל לא תקינה" : ""}
                sx={{
                  "& label": {
                    left: "unset",
                    right: "1.75rem",
                    transformOrigin: "right",
                    fontSize: "0.8rem",
                  },
                  "& legend": {
                    textAlign: "right",
                    fontSize: "0.6rem",
                  },
                }}
              />
              <TextField
                dir="rtl"
                name="phone"
                label="מספר טלפון"
                fullWidth
                margin="normal"
                onChange={(e) => {
                  setNewPhone(e.target.value);
                  setLegal(true);
                  if(e.target.value !== ""){
                    const cellPhoneRegex = /^(05\d|07\d)-?\d{7}$/;
                    const homePhoneRegex = /^0(2|3|4|8|9)-?\d{7}$/;
                    const isCellPhoneValid = cellPhoneRegex.test(e.target.value);
                    const isHomePhoneValid = homePhoneRegex.test(e.target.value);
                    const isPhoneNumberValid = isCellPhoneValid || isHomePhoneValid;
                    setLegalPhone(isPhoneNumberValid);
                  }
                  else
                    setLegalPhone(true);
                  
                }}
                error={!legalPhone}
                helperText={!legalPhone && "מספר טלפון לא תקין"}
                sx={{
                  "& label": {
                    left: "unset",
                    right: "1.75rem",
                    transformOrigin: "right",
                    fontSize: "0.8rem",
                  },
                  "& legend": {
                    textAlign: "right",
                    fontSize: "0.6rem",
                  },
                }}
              />
              <TextField
                required
                dir="rtl"
                name="phone"
                label="תפקיד"
                fullWidth
                margin="normal"
                onChange={(e) => setNewRole(e.target.value)}
                sx={{
                  "& label": {
                    left: "unset",
                    right: "1.75rem",
                    transformOrigin: "right",
                    fontSize: "0.8rem",
                  },
                  "& legend": {
                    textAlign: "right",
                    fontSize: "0.6rem",
                  },
                }}
              />
          {legal === false &&(
            <p style={{ color: "red" }}>אנא וודא כי מילאת לפחות אחד מהפרטים הבאים: כתובת דוא"ל או מספר טלפון</p>
            )}
              <button className={classes.myButton} type="submit">
                הוסף למאגר
              </button>
            </div>
          </form>
        </Box>
      </Modal>

      <MaterialReactTable
        columns={columns}
        data={data}
        mantineCopyButtonProps={{
          sx: { width: "100%" },
        }}
        muiTableBodyCellProps={{
          sx: {
            borderRight: "0.5px solid #e0e0e0", //add a border between columns
          },
        }}
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            borderRadius: "0",
            border: "1px dashed #e0e0e0",
          },
        }}
        muiTableHeadCellProps={{
          //no useTheme hook needed, just use the `sx` prop with the theme callback
          sx: (theme) => ({
            color: theme.palette.text.secondary,
          }),
        }}
        enableRowActions
        editingMode="modal"
        enableEditing={true}
        enableRowSelection
        positionToolbarAlertBanner="bottom"
        onEditingRowSave={handleSaveRow}
        enableGrouping
        initialState={{
          columnVisibility: {},
        }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "5px" }}>
            <Tooltip title="עריכה">
              <IconButton
                color="secondary"
                onClick={() => table.setEditingRow(row)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="מחיקה">
              <span>
                <IconButton color="error" onClick={() => handleDelete(row.id)}>
                  <DeleteIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        )}
      />

      <div className={classes.div_button}>
        <button className={classes.myButton} onClick={handleAdd}>
          <Icon
            sx={{
              fontSize: "1.2rem",
              marginRight: "0.5rem",
              color: "white",
            }}
          >
            <AddIcon />
          </Icon>
          <span
            style={{
              fontSize: "1rem",
              color: "white",
            }}
          >
            הוסף מידע חדש למאגר
          </span>
        </button>
      </div>
    </>
  );
};

export default ManageData;
