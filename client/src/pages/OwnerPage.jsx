import React, { Component, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Modal,
  styled,
  TextField,
  Typography,
  useMediaQuery,
  theme,
  axios,
  toast,
  InputAdornment,
  Tooltip,
} from "../lib/GlobalImports";
import {
  AddCircleOutlineOutlinedIcon,
  SearchOutlinedIcon,
  WarningIcon,
} from "../lib/GlobalIcons";
import { axiosInstance } from "../lib/GlobalConfigs";
import {
  SubTitle,
  UserCard,
  CarDialog,
  CarDialogText,
  MyTextField2,
  WarningImage,
} from "../lib/StyledComponents";
import { Stack } from "@mui/system";
import { useTheme } from "@emotion/react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Languages,
  MessageStatusCodes,
  getFieldMessage,
} from "../config/MessageHandler";

const WorkshopFieldDetailField = styled(Typography)(({ theme }) => ({
  wordBreak: "break-all",
  maxWidth: "800px",
  width: "100%",
  fontWeight: "bold",
}));

function OwnerPage() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSent, setIsSent] = useState(false);
  const [isErrorWorkerAdd, setIsErrorWorkerAdd] = useState(false);
  const underSmall = useMediaQuery(theme.breakpoints.down("sm"));

  /* datas */
  // If I delete a user a set the modified to true to reload the content of the data table and afterwards I set its value to false.
  const [modified, setModified] = useState(false);
  const [employeeWorkshop, setEmployeeWorkshop] = useState({});
  const [employees, setEmployees] = useState([]);
  const [currentEditedEmployee, setCurrentEditedEmployee] = useState({});
  const [isEmployeeEdit, setIsEmployeeEdit] = useState(false);

  /* for input areas */
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingProcessing, setIsAddingProcessing] = useState(false);

  /* employeeID = email */
  const [employeeID, setEmployeeID] = useState("");

  const columns = [
    { field: "id", headerName: "Sorszám", width: 70 },
    { field: "fName", headerName: "Keresztnév", width: 130 },
    { field: "lName", headerName: "Vezetéknév", width: 130 },
    { field: "email", headerName: "E-mail cím", width: 130 },
    { field: "phone", headerName: "Telefonszám", width: 130 },
    { field: "delete", headerName: "", width: 130 },
  ];

  const handleEmployeeAddition = async (e) => {
    if (isErrorWorkerAdd) {
      toast.error("Hiba! Hibásan töltötte ki a dolgozó e-mail cím mezőjét!");
      return;
    }

    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
    }, Number(process.env.REACT_APP_BUTTON_CLICK_TIMEOUT));

    if (!employeeID) {
      toast.error(
        getFieldMessage(
          Languages.hu,
          "dolgozó azonosító",
          MessageStatusCodes.error
        )
      );
      return;
    }

    await axiosInstance
      .post(
        "/addEmployee",
        { email: employeeID },
        { headers: { "x-access-token": localStorage.getItem("token") } }
      )
      .then((response) => {
        toast.success("Sikeresen hozzáadott egy új felhasználót!");
        setEmployeeID("");
        setModified(true);
      })
      .catch((err) => {
        if (err.response.status == 422) {
          toast.error("Az email mező nem lehet üres!");
        } else if (err.response.status == 404) {
          toast.error("Ez a felhasználó nem található!");
        } else if (err.response.status == 409) {
          toast.error("Ez a személy már dolgozik egy műhelynél!");
        }
        setIsAddingProcessing(false);
      });
  };

  const getEmployees = async (token) => {
    await axiosInstance
      .get("/getEmployees", { headers: { "x-access-token": token } })
      .then((res) => {
        setEmployees(res.data.data.employees);
        setModified(false);
      })
      .catch((err) => {});
  };

  const getWorkshopData = async (token) => {
    await axiosInstance
      .get("/getMyWorkshop", { headers: { "x-access-token": token } })
      .then((res) => {
        setEmployeeWorkshop(res.data.data.workshop);
      })
      .catch((err) => {});
  };

  const handleTableDataClick = (e) => {
    const rowID = Number(e["id"]);

    if (e["field"] == "delete") {
      for (let i = 0; i < employees.length; i++) {
        if (i == rowID - 1) {
          setCurrentEditedEmployee(employees[i]);
          setIsEmployeeEdit(true);
          return;
        }
      }
    }
  };

  const handleDeleteEmployee = async () => {
    await axiosInstance
      .delete(`/deleteEmployee/${currentEditedEmployee["_id"]}`, {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((res) => {
        toast.success("Sikeresen eltávolítottad ezt a személyt!");
        setCurrentEditedEmployee({});
        setIsEmployeeEdit(false);
        setModified(true);
      })
      .catch((err) => {
        if (err?.response?.status) {
          if (err.response.status == 404) {
            toast.error("Hiba! Nincs műhelyed!");
          }
        }
      });
  };

  useEffect(() => {
    setIsLoading(true);
    let token = localStorage.getItem("token");
    getEmployees(token);
    getWorkshopData(token);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (modified) getEmployees(localStorage.getItem("token"));
  }, [modified]);

  return (
    <React.Fragment>
      <SubTitle variant="h3">Műhely adatlap</SubTitle>

      {underSmall ? (
        <>
          <WorkshopFieldDetailField variant="h4">
            Műhely neve: <strong>{employeeWorkshop["name"]}</strong>
          </WorkshopFieldDetailField>
          <WorkshopFieldDetailField variant="h4">
            Műhely címe:{" "}
            <strong>
              {employeeWorkshop["address"]}, {employeeWorkshop["city"]}
            </strong>
          </WorkshopFieldDetailField>
          <WorkshopFieldDetailField variant="h4">
            Ország: <strong>{employeeWorkshop["country"]}</strong>
          </WorkshopFieldDetailField>
          <WorkshopFieldDetailField variant="h4">
            Tulajdonos: <strong>{employeeWorkshop["owner"]}</strong>
          </WorkshopFieldDetailField>
          <WorkshopFieldDetailField variant="h4">
            E-mail cím: <strong>{employeeWorkshop["email"]}</strong>
          </WorkshopFieldDetailField>
          <WorkshopFieldDetailField variant="h4">
            Telefonszám: <strong>{employeeWorkshop["phone"]}</strong>
          </WorkshopFieldDetailField>
        </>
      ) : (
        <dl>
          <dd>
            <WorkshopFieldDetailField variant="h4">
              Műhely neve: <strong>{employeeWorkshop["name"]}</strong>
            </WorkshopFieldDetailField>
            <WorkshopFieldDetailField variant="h4">
              Műhely címe:{" "}
              <strong>
                {employeeWorkshop["address"]}, {employeeWorkshop["city"]}
              </strong>
            </WorkshopFieldDetailField>
            <WorkshopFieldDetailField variant="h4">
              Ország: <strong>{employeeWorkshop["country"]}</strong>
            </WorkshopFieldDetailField>
            <WorkshopFieldDetailField variant="h4">
              Tulajdonos: <strong>{employeeWorkshop["owner"]}</strong>
            </WorkshopFieldDetailField>
            <WorkshopFieldDetailField variant="h4">
              E-mail cím: <strong>{employeeWorkshop["email"]}</strong>
            </WorkshopFieldDetailField>
            <Typography variant="h4">
              Telefonszám: <strong>{employeeWorkshop["phone"]}</strong>
            </Typography>
          </dd>
        </dl>
      )}

      <SubTitle variant="h3">Alkalmazottak kezelése</SubTitle>

      <Grid container direction="row" gap={2} justifyContent="center">
        <Card variant="contained">
          <UserCard
            onClick={(e) => {
              setIsAdding(!isAdding);
              setEmployeeID("");
            }}
          >
            <Stack
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <AddCircleOutlineOutlinedIcon />
              <Typography>Dolgozó hozzáadása</Typography>
            </Stack>
          </UserCard>
        </Card>
      </Grid>

      {isAdding && (
        <Grid
          container
          direction="column"
          alignItems="flex-start"
          justifyContent="center"
          sx={{ marginBottom: "1.5rem" }}
        >
          <Grid item sx={{ width: "100%" }}>
            <MyTextField2
              fullWidth
              id="outlined-disabled"
              label="Dolgozó e-mail címe"
              type="text"
              color="success"
              value={employeeID}
              InputProps={
                isErrorWorkerAdd
                  ? {
                      endAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Hibás értéket adott meg!">
                            <WarningImage src={WarningIcon} />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }
                  : undefined
              }
              onChange={(e) => {
                if (e.target.value.length > 75) {
                  setIsErrorWorkerAdd(true);
                  return;
                }

                setIsErrorWorkerAdd(false);
                setEmployeeID(e.target.value);
              }}
            />
          </Grid>
          <Grid item sx={{ marginTop: "0.1em" }}>
            {isSent ? (
              <Button
                size="small"
                variant="contained"
                color="success"
                startIcon={<AddCircleOutlineOutlinedIcon />}
                disabled
              >
                Hozzáadás
              </Button>
            ) : (
              <Button
                size="small"
                variant="contained"
                color="success"
                startIcon={<AddCircleOutlineOutlinedIcon />}
                onClick={(e) => {
                  handleEmployeeAddition(e);
                  setIsAddingProcessing(true);
                }}
              >
                Hozzáadás
              </Button>
            )}
          </Grid>
        </Grid>
      )}

      <div style={{ height: "400px", display: "block", width: "100%" }}>
        <DataGrid
          rows={employees.map((employee, i) => {
            employee["id"] = i + 1;
            employee["delete"] = "Törlés";
            return employee;
          })}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          onCellClick={(e) => handleTableDataClick(e)}
        />
      </div>

      {isEmployeeEdit && (
        <CarDialog
          open={isEmployeeEdit}
          onClose={(e) => setIsEmployeeEdit(!isEmployeeEdit)}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <DialogTitle id="alert-dialog-title">
            <Typography variant="h2">Figyelmeztetés</Typography>
          </DialogTitle>

          <DialogContent>
            <CarDialogText id="alert-dialog-description">
              Biztosan törölni kívánja az alábbi személyt? ({" "}
              <b>
                {currentEditedEmployee["fName"]}{" "}
                {currentEditedEmployee["lName"]}
              </b>{" "}
              )
            </CarDialogText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={(e) => {
                setIsEmployeeEdit(false);
                setCurrentEditedEmployee({});
              }}
              variant="contained"
              color="success"
            >
              Mégsem
            </Button>
            <Button
              onClick={(e) => handleDeleteEmployee()}
              variant="contained"
              color="error"
              autoFocus
            >
              Törlés
            </Button>
          </DialogActions>
        </CarDialog>
      )}
    </React.Fragment>
  );
}

export default OwnerPage;
