import React, { useMemo, useEffect, useState } from "react";
import { db } from "../../firebase_setup/firebase";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
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
// import DataGraphs from "../DataGraphs/DataGraps";
import "./ReportsTableCom.css";

const ReportsTableCom = () => {
  const [data, setData] = useState([]);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [city, setCity] = useState("");
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    data.length > 0 ? setShowExport(true) : setShowExport(false);
  }, [data]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
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
        header: "תאריך",
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
        header: "הודעות",
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        enableEditing: false, //disable editing on this column
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
        item.original.id,
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
    console.log("data: ", data);

    const csvExporter = new ExportToCsv(csvOptions);
    csvExporter.generateCsv(
      data.map((item) => [
        item.id,
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
    // console.log(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Reports"));
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(newData);
      } catch (error) {
        console.error("Error fetching data from Firestore: ", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?"
    );
    if (confirmed) {
      try {
        const reportDocRef = doc(db, "Reports", id);
        await deleteDoc(reportDocRef);
        setData(data.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting report: ", error);
      }
    }
  };

  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    try {
      const reportDocRef = doc(db, "Reports", values.id);
      await updateDoc(reportDocRef, values);
      setData((prevData) => {
        const updatedData = [...prevData];
        updatedData[row.index] = values;
        return updatedData;
      });
    } catch (error) {
      console.error("Error saving report: ", error);
    }
    exitEditingMode(); // required to exit editing mode
  };

  const emailClick = (row) => {
    setCity(row.original.city);
    setShowEmailForm(!showEmailForm);
  };

  return (
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

            <Tooltip title="מחיקה">
              <IconButton
                color="error"
                onClick={() => handleDelete(row.original.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={({ table }) => (
          <Box
            sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}
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

      {showEmailForm && <EmailForm c={city} />}
      <Link to="/DataGraphs">
        <button className="graphs">דו"ח נתונים</button>
      </Link>
    </>
  );
};

export default ReportsTableCom;
