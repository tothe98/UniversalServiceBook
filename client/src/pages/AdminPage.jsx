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
  InputAdornment,
  Modal,
  styled,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Add } from "@mui/icons-material";
import { Stack } from "@mui/system";
import { useTheme } from "@emotion/react";
import axios from "axios";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { axiosInstance } from "../lib/GlobalConfigs";
import {
  Languages,
  MessageStatusCodes,
  getFieldMessage,
} from "../config/MessageHandler";
import { WarningImage } from "../lib/StyledComponents";
import { WarningIcon } from "../lib/GlobalIcons";

const SubTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.link,
  marginBottom: "2rem",
}));

const UserCard = styled(CardActionArea)(({ theme }) => ({
  width: "200px",
  height: "100px",
  textAlign: "center",
  marginBottom: "1rem",
  "&:hover": {
    backgroundColor: theme.palette.common.orange,
    color: theme.palette.common.white,
  },
}));

const MyTextField = styled(TextField)(({ theme }) => ({
  marginBottom: "0.6rem",
}));

const WorkshopFieldDetailField = styled(TextField)(({ theme }) => ({
  wordBreak: "break-all",
  maxWidth: "300px",
  width: "100%",
}));

const CarDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    backgroundColor: "none",
    width: "100%",
  },
}));

const CarDialogText = styled(DialogContentText)(({ theme }) => ({}));

function AdminPage() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSent, setIsSent] = useState(false);
  const underSmall = useMediaQuery(theme.breakpoints.down("sm"));

  /* datas */
  // If I delete a workshop a set the modified to true to reload the content of the data table and afterwards I set its value to false.
  const [modified, setModified] = useState(false);
  const [newWorkshopName, setNewWorkshopName] = useState("");
  const [newWorkshopCountry, setNewWorkshopCountry] = useState("");
  const [newWorkshopCity, setNewWorkshopCity] = useState("");
  const [newWorkshopAddress, setNewWorkshopAddress] = useState("");
  const [newWorkshopOwner, setNewWorkshopOwner] = useState("");
  const [newWorkshopPhone, setNewWorkshopPhone] = useState("");
  const [newWorkshopEmail, setNewWorkshopEmail] = useState("");

  const [workshops, setWorkshops] = useState([]);
  const [currentEditedWorkshop, setCurrentEditedWorkshop] = useState({});
  /* menus */
  const [isWorkshopDelete, setIsWorkshopDelete] = useState(false);
  const [isWorkshopEmployeesEdit, setIsWorkshopEmployeesEdit] = useState(false);

  /* for input areas */
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingProcessing, setIsAddingProcessing] = useState(false);
  const [isErrorWorkshopName, setIsErrorWorkshopName] = useState(false);
  const [isErrorWorkshopCountry, setIsErrorWorkshopCountry] = useState(false);
  const [isErrorWorkshopCity, setIsErrorWorkshopCity] = useState(false);
  const [isErrorWorkshopStreet, setIsErrorWorkshopStreet] = useState(false);
  const [isErrorWorkshopOwnerEmail, setIsErrorWorkshopOwnerEmail] =
    useState(false);
  const [isErrorWorkshopPhoneContact, setIsErrorWorkshopPhoneContact] =
    useState(false);
  const [isErrorWorkshopEmailContact, setIsErrorWorkshopEmailContact] =
    useState(false);

  /* main data table */
  const columns = [
    { field: "id", headerName: "Sorsz??m", width: 70 },
    { field: "name", headerName: "M??hely n??v", width: 200 },
    { field: "country", headerName: "Orsz??g", width: 130 },
    { field: "city", headerName: "V??ros", width: 130 },
    { field: "address", headerName: "C??m", width: 130 },
    { field: "employeesBtn", headerName: "Alkalmazottak", width: 250 },
    { field: "delete", headerName: "", width: 130 },
  ];
  const employeeColumns = [
    { field: "id", headerName: "Sorsz??m", width: 70 },
    { field: "name", headerName: "N??v", width: 200 },
  ];

  const handleWorkshopAddition = async (e) => {
    if (
      isErrorWorkshopName ||
      isErrorWorkshopCountry ||
      isErrorWorkshopCity ||
      isErrorWorkshopStreet ||
      isErrorWorkshopOwnerEmail ||
      isErrorWorkshopPhoneContact ||
      isErrorWorkshopEmailContact
    ) {
      toast.error("Hiba! Valamelyik mez??t nem/ vagy hib??san t??lt??tte ki!");
      return;
    }

    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
    }, Number(process.env.REACT_APP_BUTTON_CLICK_TIMEOUT));

    if (!newWorkshopName) {
      toast.error(
        getFieldMessage(Languages.hu, "m??hely n??v", MessageStatusCodes.error)
      );
      return;
    }
    if (!newWorkshopCountry) {
      toast.error(
        getFieldMessage(Languages.hu, "orsz??g", MessageStatusCodes.error)
      );
      return;
    }
    if (!newWorkshopCity) {
      toast.error(
        getFieldMessage(Languages.hu, "v??ros", MessageStatusCodes.error)
      );
      return;
    }
    if (!newWorkshopAddress) {
      toast.error(
        getFieldMessage(Languages.hu, "utca", MessageStatusCodes.error)
      );
      return;
    }
    if (!newWorkshopOwner) {
      toast.error(
        getFieldMessage(
          Languages.hu,
          "m??hely tulajdonos",
          MessageStatusCodes.error
        )
      );
      return;
    }

    await axiosInstance
      .post(
        "/addNewWorkshop",
        {
          name: newWorkshopName,
          country: newWorkshopCountry,
          city: newWorkshopCity,
          address: newWorkshopAddress,
          owner: newWorkshopOwner,
          phone: newWorkshopPhone ? newWorkshopPhone : "",
          email: newWorkshopEmail ? newWorkshopEmail : "",
        },
        { headers: { "x-access-token": localStorage.getItem("token") } }
      )
      .then((response) => {
        toast.success("Sikeresen hozz??adtad a m??helyt!");
        setIsAdding(false);
        setModified(true);
      })
      .catch((err) => {
        if (err.response.status == 422) {
          toast.error("Az email mez?? nem lehet ??res!");
        } else if (err.response.status == 404) {
          toast.error("Ez a felhaszn??l?? nem tal??lhat??!");
        } else if (err.response.status == 409) {
          toast.error("Ez a szem??ly m??r dolgozik egy m??helyn??l!");
        }
      });
  };

  const getWorkshops = async (token) => {
    await axiosInstance
      .get("/getWorkshops", { headers: { "x-access-token": token } })
      .then((res) => {
        setWorkshops(res.data.data.workshops);
        setModified(false);
      })
      .catch((err) => {});
  };

  /* This method handle the main data grid (it is not good for inner data tables.) */
  const handleTableDataClick = (e) => {
    const rowID = Number(e["id"]);
    switch (e["field"]) {
      /* when I clicked to the 'Megtekintem' button */
      case "employeesBtn":
        for (let i = 0; i < workshops.length; i++) {
          if (i == rowID - 1) {
            setCurrentEditedWorkshop(workshops[i]);
            /* what kind of menu I want to show (employees of workshop menu) */
            setIsWorkshopEmployeesEdit(true);
            return;
          }
        }
        break;
      case "delete":
        for (let i = 0; i < workshops.length; i++) {
          if (i == rowID - 1) {
            setCurrentEditedWorkshop(workshops[i]);
            /* what kind of menu I want to show (workshop delete) */
            setIsWorkshopDelete(true);
            return;
          }
        }
        break;
    }
  };

  const handleDeleteWorkshop = async () => {
    await axiosInstance
      .delete(`/deleteWorkshop/${currentEditedWorkshop["_id"]}`, {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((res) => {
        toast.success("Sikeresen elt??vol??tottad ezt a m??helyt!");
        setCurrentEditedWorkshop({});
        setIsWorkshopDelete(false);
        setModified(true);
      })
      .catch((err) => {
        if (err?.response?.status) {
          if (err.response.status == 422) {
            toast.error("Hiba! Ez a m??hely nem l??tezik!");
          }
        }
      });
  };

  useEffect(() => {
    setIsLoading(true);
    let token = localStorage.getItem("token");
    getWorkshops(token);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (modified) getWorkshops(localStorage.getItem("token"));
  }, [modified]);

  return (
    <React.Fragment>
      <SubTitle variant="h3">M??hely-kezel??</SubTitle>

      <Grid container direction="row" gap={2} justifyContent="center">
        <Card variant="contained">
          <UserCard
            onClick={(e) => {
              setIsAdding(!isAdding);
              setCurrentEditedWorkshop("");
            }}
          >
            <Stack
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <AddIcon />
              <Typography>M??hely hozz??ad??sa</Typography>
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
            <MyTextField
              fullWidth
              id="outlined-disabled"
              label="M??hely neve *"
              type="text"
              color="success"
              value={newWorkshopName}
              InputProps={
                isErrorWorkshopName
                  ? {
                      endAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Hib??s ??rt??ket adott meg!">
                            <WarningImage src={WarningIcon} />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }
                  : undefined
              }
              onChange={(e) => {
                if (e.target.value.length > 100) {
                  setIsErrorWorkshopName(true);
                  return;
                }

                setNewWorkshopName(e.target.value);
                setIsErrorWorkshopName(false);
              }}
            />
          </Grid>

          <Grid item sx={{ width: "100%" }}>
            <MyTextField
              fullWidth
              id="outlined-disabled"
              label="Orsz??g *"
              type="text"
              color="success"
              value={newWorkshopCountry}
              InputProps={
                isErrorWorkshopCountry
                  ? {
                      endAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Hib??s ??rt??ket adott meg!">
                            <WarningImage src={WarningIcon} />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }
                  : undefined
              }
              onChange={(e) => {
                if (e.target.value.length > 56) {
                  setIsErrorWorkshopCountry(true);
                  return;
                }

                setIsErrorWorkshopCountry(false);
                setNewWorkshopCountry(e.target.value);
              }}
            />
          </Grid>

          <Grid item sx={{ width: "100%" }}>
            <MyTextField
              fullWidth
              id="outlined-disabled"
              label="V??ros *"
              type="text"
              color="success"
              value={newWorkshopCity}
              InputProps={
                isErrorWorkshopCity
                  ? {
                      endAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Hib??s ??rt??ket adott meg!">
                            <WarningImage src={WarningIcon} />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }
                  : undefined
              }
              onChange={(e) => {
                if (e.target.value.length > 40) {
                  setIsErrorWorkshopCity(true);
                  return;
                }

                setNewWorkshopCity(e.target.value);
                setIsErrorWorkshopCity(false);
              }}
            />
          </Grid>

          <Grid item sx={{ width: "100%" }}>
            <MyTextField
              fullWidth
              id="outlined-disabled"
              label="Utca *"
              type="text"
              color="success"
              InputProps={
                isErrorWorkshopStreet
                  ? {
                      endAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Hib??s ??rt??ket adott meg!">
                            <WarningImage src={WarningIcon} />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }
                  : undefined
              }
              value={newWorkshopAddress}
              onChange={(e) => {
                if (e.target.value.length > 50) {
                  setIsErrorWorkshopStreet(true);
                  return;
                }

                setNewWorkshopAddress(e.target.value);
                setIsErrorWorkshopStreet(false);
              }}
            />
          </Grid>

          <Grid item sx={{ width: "100%" }}>
            <MyTextField
              fullWidth
              id="outlined-disabled"
              label="M??helytulajdonos (e-mail c??me) *"
              type="text"
              color="success"
              value={newWorkshopOwner}
              InputProps={
                isErrorWorkshopOwnerEmail
                  ? {
                      endAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Hib??s ??rt??ket adott meg!">
                            <WarningImage src={WarningIcon} />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }
                  : undefined
              }
              onChange={(e) => {
                if (e.target.value.length > 75) {
                  setIsErrorWorkshopOwnerEmail(true);
                  return;
                }

                setNewWorkshopOwner(e.target.value);
              }}
            />
          </Grid>

          <Grid item sx={{ width: "100%" }}>
            <MyTextField
              fullWidth
              id="outlined-disabled"
              label="Telefonos el??rhet??s??g"
              type="text"
              color="success"
              value={newWorkshopPhone}
              InputProps={
                isErrorWorkshopPhoneContact
                  ? {
                      endAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Hib??s ??rt??ket adott meg!">
                            <WarningImage src={WarningIcon} />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }
                  : undefined
              }
              onChange={(e) => {
                if (e.target.value.length > 15) {
                  setIsErrorWorkshopPhoneContact(true);
                  return;
                }

                setNewWorkshopPhone(e.target.value);
              }}
            />
          </Grid>

          <Grid item sx={{ width: "100%" }}>
            <MyTextField
              fullWidth
              id="outlined-disabled"
              label="M??hely e-mail el??rhet??s??g"
              type="text"
              color="success"
              InputProps={
                isErrorWorkshopEmailContact
                  ? {
                      endAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Hib??s ??rt??ket adott meg!">
                            <WarningImage src={WarningIcon} />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }
                  : undefined
              }
              value={newWorkshopEmail}
              onChange={(e) => {
                if (e.target.value.length > 75) {
                  setIsErrorWorkshopEmailContact(true);
                  return;
                }

                setNewWorkshopEmail(e.target.value);
              }}
            />
          </Grid>

          <Grid item>
            {isSent ? (
              <Button
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                disabled
              >
                Hozz??ad??s
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                onClick={(e) => {
                  handleWorkshopAddition(e);
                  setIsAddingProcessing(true);
                }}
              >
                Hozz??ad??s
              </Button>
            )}
          </Grid>
        </Grid>
      )}

      <div style={{ height: "400px", display: "block", width: "100%" }}>
        <DataGrid
          rows={workshops.map((workshop, i) => {
            workshop["id"] = i + 1;
            workshop["delete"] = "T??rl??s";
            workshop["employeesBtn"] = "Megtekintem";
            return workshop;
          })}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          onCellClick={(e) => handleTableDataClick(e)}
        />
      </div>

      {isWorkshopEmployeesEdit && (
        <CarDialog
          open={isWorkshopEmployeesEdit}
          onClose={(e) => setIsWorkshopEmployeesEdit(!isWorkshopEmployeesEdit)}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <DialogTitle id="alert-dialog-title">
            <Typography variant="h2">
              {currentEditedWorkshop["name"]}
            </Typography>
            <Typography variant="h2">Alkalmazotti lista</Typography>
          </DialogTitle>

          <DialogContent>
            <CarDialogText id="alert-dialog-description">
              <div style={{ height: "400px", display: "block", width: "100%" }}>
                <DataGrid
                  rows={currentEditedWorkshop["employees"].map(
                    (employee, i) => {
                      employee["id"] = i + 1;
                      return employee;
                    }
                  )}
                  columns={employeeColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                />
              </div>
            </CarDialogText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={(e) => {
                setIsWorkshopEmployeesEdit(false);
              }}
              variant="contained"
              color="success"
            >
              Bez??r
            </Button>
          </DialogActions>
        </CarDialog>
      )}

      {isWorkshopDelete && (
        <CarDialog
          open={isWorkshopDelete}
          onClose={(e) => setIsWorkshopDelete(!isWorkshopDelete)}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <DialogTitle id="alert-dialog-title">
            <Typography variant="h2">Figyelmeztet??s</Typography>
          </DialogTitle>

          <DialogContent>
            <CarDialogText id="alert-dialog-description">
              Biztosan t??r??lni k??v??nja az al??bbi m??helyt? ({" "}
              <b>{currentEditedWorkshop["name"]}</b> )
            </CarDialogText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={(e) => {
                setIsWorkshopDelete(false);
                setCurrentEditedWorkshop({});
              }}
              variant="contained"
              color="success"
            >
              M??gsem
            </Button>
            <Button
              onClick={(e) => handleDeleteWorkshop()}
              variant="contained"
              color="error"
              autoFocus
            >
              T??rl??s
            </Button>
          </DialogActions>
        </CarDialog>
      )}
    </React.Fragment>
  );
}

export default AdminPage;
