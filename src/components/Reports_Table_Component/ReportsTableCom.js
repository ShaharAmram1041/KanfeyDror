import React, { useMemo, useEffect, useState } from "react";
import { db } from "../../firebase_setup/firebase";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  getDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import LayersClearIcon from "@mui/icons-material/LayersClear";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { EmailForm } from "../Email_Cpomponent/EmailForm";
import MaterialReactTable from "material-react-table";
import { Box, IconButton, Button, Typography, Tooltip } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv"; //or use your library of choice here
import "./ReportsTableCom.css";
import classes from "./ReportTableCom.module.scss";
import Swal from "sweetalert2";

const ReportsTableCom = () => {
  const [data, setData] = useState([]);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [city, setCity] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [userAccess, setUserAccess] = useState(null);

  useEffect(() => {
    data.length > 0 ? setShowExport(true) : setShowExport(false);
  }, [data]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "uuid",
        header: "מזהה ייחודי",
        enableSorting: false, //disable sorting on this column
        align: "right",
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        enableEditing: false, //disable editing on this column
      },
      {
        accessorKey: "name",
        header: "שם",
        align: "right",
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        enableEditing: false, //disable editing on this column
      },
      {
        accessorKey: "city",
        header: "עיר",
        align: "right",
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        enableEditing: false, //disable editing on this column
      },
      {
        accessorKey: "date",
        header: "משך החרם",
        align: "right",
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        enableEditing: false, //disable editing on this column
      },
      {
        accessorKey: "email",
        header: "אימייל",
        align: "right",
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        enableEditing: false, //disable editing on this column
      },
      {
        accessorKey: "place",
        header: "מקום האירוע",
        align: "right",
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        enableEditing: false, //disable editing on this column
      },
      {
        accessorKey: "status",
        header: "סטטוס",
        align: "right",
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
      },
      {
        accessorKey: "urgency",
        header: "דחיפות",
        align: "right",
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
      },
      {
        accessorKey: "message",
        header: "תיאור המקרה",
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        enableEditing: false, //disable editing on this column
      },
      {
        accessorKey: "schoolName",
        header: "שם בית הספר",
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        enableEditing: false, //disable editing on this column
      },
      {
        accessorKey: "Class",
        header: "כיתה",
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        enableEditing: false, //disable editing on this column
      },
      {
        accessorKey: "youthName",
        header: "שם תנועת נוער",
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        enableEditing: false, //disable editing on this column
      },
      {
        accessorKey: "otherPlace",
        header: "מקום אחר",
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        enableEditing: false, //disable editing on this column
      },
      {
        accessorKey: "reportDate",
        header: "תאריך שליחת הדיווח",
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        enableEditing: false, //disable editing on this column
      },
      {
        accessorKey: "treatment",
        header: "הערות של העמותה",
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

  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  const handleExportRows = (rows) => {
    const csvExporter = new ExportToCsv(csvOptions);
    csvExporter.generateCsv(
      rows.map((item) => [
        item.original.uuid,
        item.original.name,
        item.original.city,
        item.original.date,
        item.original.email,
        item.original.place,
        item.original.status,
        item.original.urgency,
        item.original.message,
      ])
    );
  };

  const handleExportData = () => {
    const csvExporter = new ExportToCsv(csvOptions);
    csvExporter.generateCsv(
      data.map((item) => [
        item.uuid,
        item.name,
        item.city,
        item.date,
        item.email,
        item.place,
        item.status,
        item.urgency,
        item.message,
      ])
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Reports"));
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

  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      html:
        '<div dir="rtl">' +
        '<h1 dir="rtl">' +
        "האם אתה בטוח שברצונך למחוק את הדיווח?" +
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
        const reportCollectionRef = collection(db, "Reports");
        const querySnapshot = await getDocs(
          query(reportCollectionRef, where("uuid", "==", id))
        );

        if (!querySnapshot.empty) {
          let documentId = null;
          querySnapshot.forEach((docSnapshot) => {
            documentId = docSnapshot.id;
          });

          if (documentId !== null) {
            let city_to_newDb;
            let message_to_newDb;
            let name_to_newDb;
            let date_to_newDb;
            let treatment_to_newDb;
            const reportDocRef = doc(db, "Reports", documentId);
            await getDoc(reportDocRef).then((doc) => {
              if (doc.exists()) {
                const data = doc.data();
                city_to_newDb = data.city;
                message_to_newDb = data.message;
                name_to_newDb = data.name;
                date_to_newDb = data.date;
                treatment_to_newDb = data.treatment;
              }
            });
            await deleteDoc(reportDocRef);
            setData((prevData) => prevData.filter((item) => item.uuid !== id));

            // Write the deleted report to the other database
            const reportCollectionRef1 = collection(db, "DeletedInfo");

            // Data to be written
            const data = {
              city: city_to_newDb,
              message: message_to_newDb,
              name: name_to_newDb,
              date: date_to_newDb,
              treatment: treatment_to_newDb,
            };

            await addDoc(reportCollectionRef1, data);

            Swal.fire({
              html: '<div dir="rtl">' + '<h1 dir="rtl">נמחק!</h1>' + "</div>",
              icon: "success",
            });
          }
        }
      } catch (error) {
        console.error("Error deleting report: ", error);
      }
    }
  };

  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    try {
      const reportCollectionRef = collection(db, "Reports");
      const querySnapshot = await getDocs(query(reportCollectionRef));

      if (querySnapshot.size > 0) {
        const docSnapshot = querySnapshot.docs[row.index];
        const reportDocRef = doc(db, "Reports", docSnapshot.id);
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

  const emailClick = (row) => {
    setCity(row.original.city);
    setShowEmailForm(!showEmailForm);
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

  //history data the deleted
  const historyData = async () => {
    const reportCollectionRef1 = collection(db, "DeletedInfo");
    const querySnapshot = await getDocs(reportCollectionRef1);
    const newData = [];
    querySnapshot.forEach((doc) => {
      const documentData = doc.data();
      newData.push(documentData);
    });
    const data = newData;
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: true,
      title: "היסטוריית מחיקת דיווחים",
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      filename: "log", // Set the desired file name here
    };
    if(data.length === 0 ){
      Swal.fire({
        html: '<div dir="rtl">' + '<h1 dir="rtl">לא נמחק דבר!</h1>' + "</div>",
        icon: "error",
      });
      return;
    }
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(data);
  };

  const handleEmailFormClose = () => {
    setShowEmailForm(false);
  };

  return (
    <>
      <>
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
            columnVisibility: {
              city: false,
              message: false,
              place: false,
              email: false,
              date: false,
              schoolName: false,
              Class: false,
              youthName: false,
              otherPlace: false,
            },
          }}
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "5px" }}>
              <Tooltip title="שלח מייל">
                <IconButton color="primary" onClick={() => emailClick(row)}>
                  <EmailIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="עריכה">
                <IconButton
                  color="secondary"
                  onClick={() => table.setEditingRow(row)}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>

              <Tooltip
                title={
                  userAccess === "Admin" ? "מחיקה" : "אין לך הרשאה לגשת לכאן"
                }
                placement="top"
              >
                <span>
                  <IconButton
                    color="error"
                    disabled={userAccess !== "Admin"}
                    onClick={() => handleDelete(row.original.uuid)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          )}
          renderTopToolbarCustomActions={({ table }) => (
            <Box
              sx={{
                display: "flex",
                gap: "1rem",
                p: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              {showExport ? (
                <>
                  <Button
                    color="primary"
                    //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                    onClick={handleExportData}
                    startIcon={<FileDownloadIcon />}
                    variant="contained"
                  >
                    ייצא את כל הטבלה
                  </Button>

                  <Button
                    disabled={
                      !table.getIsSomeRowsSelected() &&
                      !table.getIsAllRowsSelected()
                    }
                    //only export selected rows
                    onClick={() =>
                      handleExportRows(table.getSelectedRowModel().rows)
                    }
                    startIcon={<FileDownloadIcon />}
                    variant="contained"
                  >
                    ייצא שורות נבחרות
                  </Button>
                </>
              ) : null}
            </Box>
          )}
          renderDetailPanel={({ row }) => (
            <Box
              sx={{
                display: "grid",
                margin: "auto",
                gridTemplateColumns: "1fr 1fr",
                width: "100%",
              }}
            >
              <Typography sx={{ textAlign: "right" }}>
                {row.original.message}
              </Typography>
            </Box>
          )}
        />

        {showEmailForm && (
          <EmailForm
            c={city}
            showEmailForm={showEmailForm}
            onClose={handleEmailFormClose}
          />
        )}
      </>
      <div className={classes.specialButtons}>
        <Link to="/DataGraphs">
          <button className={`graphs ${classes.graphs}`}>
            <AutoGraphIcon />
            דוח נתונים סטטיסטיים
          </button>
        </Link>

        <button className={classes.graphs} onClick={historyData}>
          <LayersClearIcon />
          היסטוריית מחיקת דיווחים
        </button>
      </div>
    </>
  );
};

export default ReportsTableCom;
