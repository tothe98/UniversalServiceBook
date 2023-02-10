import React, {Component, useEffect, useState} from 'react';
import {Box, Button, Card, CardActionArea, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Modal, styled, TextField, Typography, useMediaQuery} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Add } from '@mui/icons-material';
import { Stack } from '@mui/system';
import { useTheme } from '@emotion/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DataGrid } from '@mui/x-data-grid';
import {
    axiosInstance
} from "../lib/GlobalConfigs"
import { Languages, MessageStatusCodes, getFieldMessage } from "../config/MessageHandler";

const SubTitle = styled(Typography)(({theme}) => ({
    ...theme.typography.link,
    marginBottom: "2rem"
}))

const UserCard = styled(CardActionArea)(({theme}) => ({
    width: "200px",
    height: "100px",
    textAlign: "center",
    marginBottom: "1rem",
    "&:hover": {
        backgroundColor: theme.palette.common.orange,
        color: theme.palette.common.white
    }
}))

const MyTextField = styled(TextField)(({theme}) => ({
    marginBottom: "0.6rem"
}))

const CarDialog = styled(Dialog)(({theme}) => ({
    "& .MuiDialog-paper": {
        backgroundColor: "none",
        width: "100%"
    }
}))

const CarDialogText = styled(DialogContentText)(({theme}) => ({
}))


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

    /* main data table */
    const columns = [
        { field: 'id', headerName: 'Sorszám', width: 70 },
        { field: 'name', headerName: 'Műhely név', width: 200 },
        { field: 'country', headerName: 'Ország', width: 130 },
        { field: 'city', headerName: 'Város', width: 130 },
        { field: 'address', headerName: 'Cím', width: 130 },
        { field: 'employeesBtn', headerName: 'Alkalmazottak', width: 250,  },
        { field: 'delete', headerName: '', width: 130,  }
    ];
    const employeeColumns = [
        { field: 'id', headerName: 'Sorszám', width: 70 },
        { field: 'name', headerName: 'Név', width: 200 }
    ];

    const handleWorkshopAddition = async (e) => {
        setIsSent(true)
        setTimeout(() => {
            setIsSent(false);
        }, Number(process.env.REACT_APP_BUTTON_CLICK_TIMEOUT));

        if (!newWorkshopName) {
            toast.error(getFieldMessage(Languages.hu, "műhely név", MessageStatusCodes.error))
            return;
        }
        if (!newWorkshopCountry) {
            toast.error(getFieldMessage(Languages.hu, "ország", MessageStatusCodes.error))
            return;
        }
        if (!newWorkshopCity) {
            toast.error(getFieldMessage(Languages.hu, "város", MessageStatusCodes.error))
            return;
        }
        if (!newWorkshopAddress) {
            toast.error(getFieldMessage(Languages.hu, "utca", MessageStatusCodes.error))
            return;
        }
        if (!newWorkshopOwner) {
            toast.error(getFieldMessage(Languages.hu, "műhely tulajdonos", MessageStatusCodes.error))
            return;
        }
        
        await axiosInstance.post('/addNewWorkshop', {
            name: newWorkshopName,
            country: newWorkshopCountry,
            city: newWorkshopCity,
            address: newWorkshopAddress,
            owner: newWorkshopOwner,
            phone: newWorkshopPhone ? newWorkshopPhone : "",
            email: newWorkshopEmail ? newWorkshopEmail : ""
        }, { headers: { 'x-access-token': localStorage.getItem("token") }})
            .then(response => {
                toast.success("Sikeresen hozzáadtad a műhelyt!");
                setIsAdding(false);
                setModified(true);
            })
            .catch(err => {
                if (err.response.status == 422) {
                    toast.error("Az email mező nem lehet űres!")
                }
                else if (err.response.status == 404) {
                    toast.error("Ez a felhasználó nem található!")
                }
                else if (err.response.status == 409) {
                    toast.error("Ez a személy már dolgozik egy műhelynél!")
                }
            })
    }

    const getWorkshops = async (token) => {
        await axiosInstance.get("/getWorkshops", { headers: { "x-access-token": token } })
            .then((res) => {
                setWorkshops(res.data.data.workshops);
                setModified(false);
            })
            .catch(err => {
                
            })
    }

    /* This method handle the main data grid (it is not good for inner data tables.) */
    const handleTableDataClick = (e) => {
        const rowID = Number(e['id']);
        switch (e['field']) {
            /* when I clicked to the 'Megtekintem' button */
            case 'employeesBtn':
                for (let i = 0; i < workshops.length; i++) {
                    if (i == (rowID - 1)) {
                        setCurrentEditedWorkshop(workshops[i])
                        /* what kind of menu I want to show (employees of workshop menu) */
                        setIsWorkshopEmployeesEdit(true);
                        return;
                    }
                }
                break;
            case 'delete':
                for (let i = 0; i < workshops.length; i++) {
                    if (i == (rowID - 1)) {
                        setCurrentEditedWorkshop(workshops[i]);
                        /* what kind of menu I want to show (workshop delete) */
                        setIsWorkshopDelete(true);
                        return;
                    }
                }
                break;
        }
    }

    const handleDeleteWorkshop = async () => {
        await axiosInstance.delete(`/deleteWorkshop/${currentEditedWorkshop['_id']}`, { headers: { "x-access-token": localStorage.getItem("token") } })
                    .then(res => {
                        toast.success("Sikeresen eltávolítottad ezt a műhelyt!");
                        setCurrentEditedWorkshop({})
                        setIsWorkshopDelete(false);
                        setModified(true);
                    })
                    .catch(err => {
                        if (err?.response?.status) {
                            if (err.response.status == 422) {
                                toast.error("Hiba! Ez a műhely nem létezik!");
                            }
                        }
                    })
    }

    useEffect(() => {
        setIsLoading(true);
        let token = localStorage.getItem("token");
        getWorkshops(token);
        setIsLoading(false);
    }, [])

    useEffect(() => {
        if(modified) getWorkshops(localStorage.getItem("token"));
    }, [modified])

    return (<React.Fragment>
        <SubTitle variant='h3'>Műhely kezelő</SubTitle>    

        <Grid container direction='row' gap={2} justifyContent="center">
            <Card variant="contained">
                <UserCard onClick={e=>{setIsAdding(!isAdding); setCurrentEditedWorkshop("")}} >
                    <Stack flexDirection="column" justifyContent="center" alignItems="center">
                        <AddIcon />
                        <Typography>Műhely hozzáadása</Typography>
                    </Stack>
                </UserCard>
            </Card>
        </Grid>

        {
            isAdding && <Grid container direction="column" alignItems="flex-start" justifyContent="center" sx={{marginBottom: "1.5rem"}}>
                    <Grid item sx={{width: "100%"}}>
                        <MyTextField
                            fullWidth
                            id="outlined-disabled"
                            label="Műhely neve *"
                            type="text"
                            color='success'
                            value={newWorkshopName}
                            onChange={e=>setNewWorkshopName(e.target.value)}
                        />
                    </Grid>

                    <Grid item sx={{width: "100%"}}>
                        <MyTextField
                            fullWidth
                            id="outlined-disabled"
                            label="Ország *"
                            type="text"
                            color='success'
                            value={newWorkshopCountry}
                            onChange={e=>setNewWorkshopCountry(e.target.value)}
                        />
                    </Grid>

                    <Grid item sx={{width: "100%"}}>
                        <MyTextField
                            fullWidth
                            id="outlined-disabled"
                            label="Város *"
                            type="text"
                            color='success'
                            value={newWorkshopCity}
                            onChange={e=>setNewWorkshopCity(e.target.value)}
                        />
                    </Grid>

                    <Grid item sx={{width: "100%"}}>
                        <MyTextField
                            fullWidth
                            id="outlined-disabled"
                            label="Utca *"
                            type="text"
                            color='success'
                            value={newWorkshopAddress}
                            onChange={e=>setNewWorkshopAddress(e.target.value)}
                        />
                    </Grid>
                    
                    <Grid item sx={{width: "100%"}}>
                        <MyTextField
                            fullWidth
                            id="outlined-disabled"
                            label="Műhely tulajdonos (email címe) *"
                            type="text"
                            color='success'
                            value={newWorkshopOwner}
                            onChange={e=>setNewWorkshopOwner(e.target.value)}
                        />
                    </Grid>

                    <Grid item sx={{width: "100%"}}>
                        <MyTextField
                            fullWidth
                            id="outlined-disabled"
                            label="Telefonos elérhetőség"
                            type="text"
                            color='success'
                            value={newWorkshopPhone}
                            onChange={e=>setNewWorkshopPhone(e.target.value)}
                        />
                    </Grid>
                    
                    <Grid item sx={{width: "100%"}}>
                        <MyTextField
                            fullWidth
                            id="outlined-disabled"
                            label="Műhely email elérhetőség"
                            type="text"
                            color='success'
                            value={newWorkshopEmail}
                            onChange={e=>setNewWorkshopEmail(e.target.value)}
                        />
                    </Grid>

                    <Grid item>
                        {
                            isSent
                            ?
                            <Button variant="contained" color="success" startIcon={<AddIcon />} disabled>
                                Hozzáadás
                            </Button>
                            :
                            <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={e=>{handleWorkshopAddition(e); setIsAddingProcessing(true)}}>
                                Hozzáadás
                            </Button>
                        }
                    </Grid>
                </Grid>
        }

        <div style={{ height: "400px", display: "block", width: "100%" }}>
            <DataGrid
                rows={workshops.map((workshop, i) => {
                    workshop['id'] = i + 1;
                    workshop['delete'] = "Törlés";
                    workshop['employeesBtn'] = "Megtekintem";
                    return workshop;
                })}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                onCellClick={e=>handleTableDataClick(e)}
            />
        </div>

        {
            isWorkshopEmployeesEdit && <CarDialog
                    open={isWorkshopEmployeesEdit}
                    onClose={e=>setIsWorkshopEmployeesEdit(!isWorkshopEmployeesEdit)}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                    >
                    <DialogTitle id="alert-dialog-title">
                        <Typography variant="h2">{currentEditedWorkshop['name']}</Typography>
                        <Typography variant="h2">Alkalmazotti lista</Typography>
                    </DialogTitle>

                    <DialogContent>
                        <CarDialogText id="alert-dialog-description">
                            <div style={{ height: "400px", display: "block", width: "100%" }}>
                                <DataGrid
                                    rows={currentEditedWorkshop['employees'].map((employee, i) => {
                                        employee['id'] = i + 1;
                                        return employee;
                                    })}
                                    columns={employeeColumns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                />
                            </div>
                        </CarDialogText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={e=>{setIsWorkshopEmployeesEdit(false);}} variant="contained" color="success">Bezár</Button>
                    </DialogActions>
                </CarDialog>
        }

        {
            isWorkshopDelete && <CarDialog
                    open={isWorkshopDelete}
                    onClose={e=>setIsWorkshopDelete(!isWorkshopDelete)}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                    >
                    <DialogTitle id="alert-dialog-title">
                        <Typography variant="h2">Figyelmeztetés</Typography>
                    </DialogTitle>

                    <DialogContent>
                        <CarDialogText id="alert-dialog-description">
                            Biztosan törölni kívánja az alábbi műhelyt?
                            ( <b>{currentEditedWorkshop['name']}</b> )
                        </CarDialogText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={e=>{setIsWorkshopDelete(false); setCurrentEditedWorkshop({})}} variant="contained" color="success">Mégsem</Button>
                        <Button onClick={e=>handleDeleteWorkshop()} variant="contained" color="error" autoFocus>
                        Törlés
                        </Button>
                    </DialogActions>
                </CarDialog>
        }

    </React.Fragment>)
}

export default AdminPage;