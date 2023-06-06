import React, { useMemo, useEffect, useState, useRef } from "react";
import { db } from "../../firebase_setup/firebase";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
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

import {
  Box,
  IconButton,
  Button,
  Typography,
  Tooltip,
  Icon,
  TextField,
} from "@mui/material";
import { green } from "@mui/material/colors";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv"; //or use your library of choice here

const ManageData = () => {
  const [data, setData] = useState([]);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [userAccess, setUserAccess] = useState(null);
  const tableRef = useRef(null); // Ref to access the table instance
  const [newCity, setNewCity] = useState("");
  const [newMails, setNewMails] = useState([]);
  const [newPhones, setNewPhones] = useState([]);
  const [isEmailValid, setIsEmailValid] = useState(true);

  useEffect(() => {
    data.length > 0 ? setShowExport(true) : setShowExport(false);
  }, [data]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "phones",
        header: "מספרי טלפון הקשורים לעיר",
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
        accessorKey: "mails",
        header: "מיילים",
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
    try {
      // Add the new data to the Firestore collection "DB"
      const newData = {
        city: newCity,
        mails: newMails,
        phones: newPhones,
      };
      const docRef = await addDoc(collection(db, "DB"), newData);
      // Clear the form fields
      setNewCity("");
      setNewMails([]);
      setNewPhones([]);
      // Update the data array with the new data
      setData((prevData) => [...prevData, newData]);
      console.log("succeed!");
    } catch (error) {
      console.error("Error adding data to Firestore: ", error);
    }
    setShowEmailForm(false);
  };

  const handleAdd = async () => {
    setShowEmailForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?"
    );
    if (confirmed) {
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

    setNewMails(str);
    setIsEmailValid(isValid);
  };

  return (
    <>
      {showEmailForm && (
        <div>
          <form onSubmit={handleSubmit}>
            <TextField
              required
              type="text"
              placeholder="עיר"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
            />
            <TextField
              type="text"
              placeholder="מיילים"
              value={newMails}
              onChange={(e) => {
                handleNewEmailChange(e);
                // setNewMails(e.target.value);
              }}
              error={!isEmailValid}
              helperText={!isEmailValid ? "כתובת מייל לא תקינה" : ""}
            />

            <TextField
              type="text"
              placeholder="מספרי טלפון"
              value={newPhones}
              onChange={(e) => setNewPhones(e.target.value)}
            />
            <button type="submit" disabled={!isEmailValid}>
              הוסף למאגר
            </button>
          </form>
        </div>
      )}

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

      <div>
        <Button onClick={handleAdd}>
          <Icon>
            <AddCircleIcon />
          </Icon>
          הוסף מידע חדש למאגר
        </Button>
      </div>
    </>
  );
};

export default ManageData;
