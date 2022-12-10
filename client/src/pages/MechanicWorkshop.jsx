import React, {useEffect, useRef, useState} from "react";
import {
    Avatar,
    Button,
    Card, CardActionArea,
    CardContent,
    CardHeader, Divider,
    FormControl,
    Grid,
    styled,
    TextField,
    Typography
} from "@mui/material";
import EnergySavingsLeafOutlinedIcon from "@mui/icons-material/EnergySavingsLeafOutlined";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DateIcon from '@mui/icons-material/DateRangeOutlined';
import {toast} from "react-toastify";
import DocumentsIcon from "@mui/icons-material/FilePresentOutlined";
import {Editor} from "@tinymce/tinymce-react";

const ContentBox = styled('div')(({theme}) => ({
    position: "relative",
    width: "100",
    height: "auto",
    border: `1px solid ${theme.palette.common.lightgray}`,
    borderRadius: "5px",
    margin: "11px 0",
    padding: "10px"
}))

const SubTitle = styled(Typography)(({theme}) => ({
    marginBottom: "2rem"
}))
const SubTitle2 = styled(Typography)(({theme}) => ({
    margin: "2rem 0"
}))

const MyTextField = styled(TextField)(({theme}) => ({
    marginBottom: "0.6rem"
}))
const MyFormControll = styled(FormControl)(({theme}) => ({
    marginBottom: "0.6rem"
}))

const MyCardHeader = styled(CardHeader)(({theme}) => ({
    "& .MuiCardHeader-title": {
        ...theme.typography.h3
    },
    "& .MuiCardHeader-subheader": {
        ...theme.typography.h4
    }
}))

const UploadButton = styled(Button)(({theme}) => ({
    margin: "2rem 0"
}))

function MechanicWorkshop({handleChangeTab}) {
    const [isLoading, setIsLoading] = useState(false);
    const [vehicles, setVehicles] = useState("");
    const [isFinded, setIsFinded] = useState(false);
    const [findedVehicle, setFindedVehicle] = useState({});
    const [vehicleVin, setVehicleVin] = useState("");

    /* new service message datas */
    let defaultDate = new Date()
    const [newServiceDate, setNewServiceDate] = useState(defaultDate.toLocaleDateString("en-CA"));
    const serviceMessageHTML = useRef(null);

    useEffect(() => {
        /* getting vehicles from the api */
        const vehicles = [
            {
                carId: "2e2zbahdb2a#",
                imageUrl: "https://img.jofogas.hu/620x620aspect/Honda_Accord_Tourer_2_0_Elegance__Automata__Xen____659692224244378.jpg",
                carName: "Honda Accord",
                chassisNumber: "JACUBS25DN7100010",
                licensePlateNumber: "AA AA 001",
                motorNumber: "Z14XEP19ET4682",
                registeredServices: 10,
                year: 2004,
                km: 200_422,
                le: 232
            },
            {
                carId: "2e2zbasdhdb2a#",
                imageUrl: "https://autosoldalak.hu/auto_kepek/10403/6799b9ecbfd2d79af5820fdadb30d4f6.jpg",
                carName: "SEAT Alhambra",
                chassisNumber: "JACUBS25DN7100010",
                licensePlateNumber: "CA AA 021",
                motorNumber: "Z14XEP19ET4682",
                registeredServices: 43,
                year: 2010,
                km: 130_422,
                le: 130
            },
            {
                carId: "2e2zbahdveeeb2a#",
                imageUrl: "https://file.joautok.hu/car-for-sale-images/500x375/auto/img-20210614-140459_7rac40yw.jpg",
                carName: "Honda Civic",
                chassisNumber: "JACUBS25DN7100010",
                licensePlateNumber: "AA AB 101",
                motorNumber: "Z14XEP19ET4682",
                registeredServices: 212,
                year: 1998,
                km: 400_001,
                le: 90
            }
        ]
        setVehicles(vehicles)
    }, []);

    const handleSearchVehicle = async (e) => {
        setIsFinded(false)
        setFindedVehicle({})

        if (!vehicleVin) {
            toast.error("Az alvázszám mező űres!");
            return;
        }

        if (vehicleVin.length > parseInt(process.env.REACT_APP_MAXIMUM_VIN_LENGTH)) {
            toast.error("Az alvázszám nem lehet hosszabb mint "+process.env.REACT_APP_MAXIMUM_VIN_LENGTH+" karakter.")
            setVehicleVin("")
            return;
        }

        Array.from(vehicles).forEach(vehicle => {
            if (vehicle.chassisNumber === vehicleVin) {
                setFindedVehicle(vehicle);
                setIsFinded(true);
            }
        })

        if (!findedVehicle) {
            toast.error("Nem található jármű ezzel az alvázszámmal!")
            return;
        }
    }

    const handleNewServiceMessage = async () => {
        /* it is a plain html text */
        let textEditorContent = serviceMessageHTML.current.getContent();
    }

    return <>
        <SubTitle variant='h3'>Jármű kiválasztása</SubTitle>

        <Grid container direction="column" alignItems="flex-start" justifyContent="center" sx={{marginBottom: "1.5rem"}}>
            <Grid item sx={{width: "100%"}}>
                <MyTextField
                    fullWidth
                    id="outlined-disabled"
                    label="Alvázszám"
                    type="text"
                    value={vehicleVin}
                    onChange={e=>setVehicleVin(e.target.value)}
                />
            </Grid>
            <Grid item>
                <Button variant="contained" color="warning" startIcon={<SearchOutlinedIcon />} onClick={e=>handleSearchVehicle(e)}>
                    Keresés
                </Button>
            </Grid>
        </Grid>

        {
            isFinded && <React.Fragment>
                <Card variant="outlined">
                    <CardActionArea>
                        <MyCardHeader
                            title={findedVehicle.carName}
                            subheader={findedVehicle.chassisNumber}
                        />

                        <CardContent>
                            <Typography variant="h4">Tulajdonos: <a href={"#"}>Tomas a Macska</a></Typography>
                            <Typography variant="h4">Bejegyzett szervízek: {findedVehicle.registeredServices}</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>

                <SubTitle2 variant='h3'>Új szervízbejegyzés hozzáadása!</SubTitle2>

                <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                    <Grid item xs={1}>
                        <Typography align="center">
                            <DateIcon />
                        </Typography>
                    </Grid>

                    <Grid item xs={11}>
                        <MyTextField
                            fullWidth
                            id="outlined"
                            value={newServiceDate}
                            default={newServiceDate}
                            type="date"
                            onChange={e=>{
                                let input = new Date(e.target.value);
                                setNewServiceDate(input)
                            }}
                        />
                    </Grid>
                </Grid>

                <Editor
                    onInit={ (evt, editor) => serviceMessageHTML.current = editor }
                    init={{
                        menubar: false
                    }}
                />

                <UploadButton variant="contained" color="success" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={e=>handleNewServiceMessage(e)}>
                    Feltöltés
                </UploadButton>
            </React.Fragment>
        }
    </>
}

export default MechanicWorkshop;