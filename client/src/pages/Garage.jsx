import React, {useEffect, useRef, useState} from "react";
import { useParams } from "react-router-dom";
import {
    Alert,
    alpha, Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider, FormControl,
    Grid,
    IconButton, InputAdornment,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Modal, OutlinedInput, Select,
    Snackbar, Stack,
    styled,
    TextField,
    Tooltip,
    Typography,
    useMediaQuery
} from "@mui/material";
import {Link} from "react-router-dom";
import theme from "../themes/theme";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import DiscountOutlinedIcon from '@mui/icons-material/DiscountOutlined';
import EnergySavingsLeafOutlinedIcon from '@mui/icons-material/EnergySavingsLeafOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import DateIcon from '@mui/icons-material/DateRangeOutlined';
import CarTypeIcon from '@mui/icons-material/RvHookupOutlined';
import KmIcon from '@mui/icons-material/SpeedOutlined';
import CarWeightIcon from '@mui/icons-material/FitnessCenterOutlined';
import FuelIcon from '@mui/icons-material/LocalGasStationOutlined';
import TankIcon from '@mui/icons-material/PropaneTankOutlined';
import PerformanceIcon from '@mui/icons-material/SpeedOutlined';
import WheelIcon from '@mui/icons-material/AttractionsOutlined';
import ChangeGearIcon from '@mui/icons-material/DisplaySettingsOutlined';
import DocumentsIcon from '@mui/icons-material/FilePresentOutlined';
import ValidityIcon from '@mui/icons-material/VerifiedOutlined';
import axios from "axios";
import {toast} from "react-toastify";
import {MyCardSkeleton, MyInputSkeleton} from "../lib/Skeletons";
import moment from "moment";
import useAuth from "../hooks/useAuth";

const CONTENT_BOX_MAX_HEIGHT = "200px";

const SubTitle = styled(Typography)(({theme}) => ({
    ...theme.typography.link,
    marginBottom: "2rem"
}))

const ContentBox = styled('div')(({theme}) => ({
    position: "relative",
    width: "100",
    height: "auto",
    border: `1px solid ${theme.palette.common.lightgray}`,
    borderRadius: "5px",
    margin: "11px 0",
    padding: "10px"
}))

const ContentBoxImage = styled('img')(({theme}) => ({
    width: "100%",
    maxHeight: CONTENT_BOX_MAX_HEIGHT,
    objectFit: "scale-down",
    height: "100%"
}))

const ViewButton = styled(Button)(({theme}) => ({
    ...theme.mixins.button,
    position: "relative"
}))

const CarCard = styled(Card)(({theme}) => ({
    padding: "0.2rem 1rem"
}))

const CarCardHeader = styled(CardHeader)(({theme}) => ({
    "& .MuiCardHeader-title": {
        ...theme.typography.h3
    },
    padding: 0
}))

/*
*
* Honda Accord
* ----- SPACE BETWEEN ..
* img
* license plate number: ...
* ----- SPACE BETWEEN ..
* 2110 le 2016 year
* */
const SPACE_BETWEEN_HEADER_AND_FOOTER = "0.9rem";

const CarCardMedia = styled(CardMedia)(({theme}) => ({
    maxHeight: "300px",
    maxWidth: "300px",
    height: "100%",
    width: "100%",
    objectFit: "cover",
    marginTop: SPACE_BETWEEN_HEADER_AND_FOOTER
}))

const CarCardContent = styled(CardContent)(({theme}) => ({

}))

const CarCardActions = styled(CardActions)(({theme}) => ({
    marginTop: SPACE_BETWEEN_HEADER_AND_FOOTER,
    padding: 0
}))

const CarOptionsMenu = styled(Menu)(({theme}) => ({
    "&	.MuiMenu-paper": {
        borderRadius: "5px",
        border: theme.palette.common.lightgray
    }
}))

const MenuText = styled(Typography)(({theme}) => ({
    color: theme.palette.common.darkblack
}))

const CopyToClipBoard = (url) => {
    navigator.clipboard.writeText(url);
}

const CarDialog = styled(Dialog)(({theme}) => ({
    "& .MuiDialog-paper": {
        backgroundColor: "none",
        width: "100%"
    }
}))

const CarDialogText = styled(DialogContentText)(({theme}) => ({
}))

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const AddCarSubTitle = styled(Typography)(({theme}) => ({
    marginBottom: "0.9rem"
}))

const MyTextField = styled(TextField)(({theme}) => ({
    margin: "0.7rem 0"
}))
const MyFormControll = styled(FormControl)(({theme}) => ({
    margin: "0.7rem 0"
}))

const GalleryImage = styled("img")(({theme}) => ({
    maxWidth: "200px",
    maxHeight: "200px",
    width: "100%",
    height: "auto",
    objectFit: "cover"
}))

/* multiple select field values */
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function Garage({handleChangeTab}) {
    const { auth } = useAuth();

    /* variables that used for cars */
    const [currentDeletedVehicleId, setCurrentDeletedVehicleID] = useState("");
    const [currentDeletedVehicleName, setCurrentDeletedVehicleName] = useState("");
    const [openCarOptions, changeCarOptions] = useState(false);
    const [carAnchorEl, setCarAnchorEL] = useState(null);
    const [carModal, setCarModal] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [visibleVehicles, setVisibleVehicles] = useState([]);
    const [openCopyToolTip, setOpenCopyToolTip] = useState(false);
    /* end of car variables */

    /* searching variables */
    const [isSearchEmpty, setIsSearchEmpty] = useState(false);
    const [searchText, setSearchText] = useState("");

    /* screen variables */
    const [isLoading, setIsLoading] = useState(true);
    const [isModified, setIsModified] = useState(false);
    const underMD = useMediaQuery(theme.breakpoints.down("md"));
    const underS = useMediaQuery(theme.breakpoints.down("sm"));
    /* end of screen variables */

    /* network settings */
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_BACKEND_URL
    })
    /* end of network settings */

    /* for dialog menu */
    const [deleteVehicleName, setDeleteVehicleName] = useState('');
    const [deleteVehicleID, setDeleteVehicleID] = useState('');
    const [successVehicleDelete, setSuccessVehicleDelete] = useState(false);

    /* for snackbar*/
    const [isSnackOpen, setIsSnackOpen] = useState(false);

    /* new vehicle datas */
    /* these variables stores the new car datas */
    const [isAdding, setIsAdding] = useState(false);
    const [newVehicleWallpaperInBase64, setNewVehicleWallpaperInBase64] = useState("");
    const [newVehicleWallpaper, setNewVehicleWallpaper] = useState("");
    const [newVehicleVin, setNewVehicleVin] = useState("");
    const [newVehicleLicenseNum, setNewVehicleLicenseNum] = useState("");
    const [newVehicleCategory, setNewVehicleCategory] = useState("637e08068850125b86f2ad69");
    const [newVehicleManufacture, setNewVehicleManufacture] = useState("");
    const [newVehicleDesignType, setNewVehicleDesignType] = useState("");
    const [newVehicleModel, setNewVehicleModel] = useState("");
    const [newVehicleVintage, setNewVehicleVintage] = useState(0);
    const [newVehicleKm, setNewVehicleKm] = useState("");
    const [newVehicleOwnWeight, setNewVehicleOwnWeight] = useState("");
    const [newVehicleMaxWeight, setNewVehicleMaxWeight] = useState("");
    const [newVehicleFuel, setNewVehicleFuel] = useState("");
    const [newVehicleCylinderCapacity, setNewVehicleCylinderCapacity] = useState("");
    const [newVehiclePerformance, setNewVehiclePerformance] = useState("");
    const [newVehicleDriveType, setNewVehicleDriveType] = useState("");
    const [newVehicleTransmission, setNewVehicleTransmission] = useState("");
    const [newVehicleDocument, setNewVehicleDocument] = useState("");
    const [newVehicleDocumentValidity, setNewVehicleDocumentValidity] = useState(moment().format("YYYY-MM-DD"));
    const [newVehicleGallery, setNewVehicleGallery] = useState([]);
    const [newVehicleGalleryImageLoading, setNewVehicleGalleryImageLoading] = useState(false);

    /* We use it for add error message to the new car component. */
    const [AddCarErrorMessageBox, setAddCarErrorMessageBox] = useState("");
    const setErrorMessageDuringCarAdd = (field, message) => {
        let firstLetter = field.charAt(0)+"";
        firstLetter = firstLetter.toUpperCase();
        let newField = firstLetter+""+field.substring(1, field.length);

        setAddCarErrorMessageBox(`${newField} -> ${message}`)
        setTimeout(() => {
            setAddCarErrorMessageBox("");
        }, 10000)
    }

    /* add new car form datas */
    /* these variables store the selectable contents of the new car form */
    const [vehicleVintages, setVehicleVintages] = useState([]);
    const [vehicleFuels, setVehicleFuels] = useState([]);
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [vehicleDesignTypes, setVehicleDesignTypes] = useState([]);
    const [vehicleDriveTypes, setVehicleDriveTypes] = useState([]);
    const [vehicleManufacturers, setVehicleManufacturers] = useState([]);
    const [vehicleTransmissions, setVehicleTransmissions] = useState([]);
    const [vehicleModels, setVehicleModels] = useState([]);

    /* handle add new car */
    const handleNewVehicle = async () => {
        const body = {
            manufacture: newVehicleManufacture,
            model: newVehicleModel,
            fuel: newVehicleFuel,
            driveType: newVehicleDriveType,
            designType: newVehicleDesignType,
            transmission: newVehicleTransmission,
            licenseNumber: newVehicleLicenseNum,
            vin: newVehicleVin,
            vintage: newVehicleVintage,
            ownMass: newVehicleOwnWeight,
            fullMass: newVehicleMaxWeight,
            cylinderCapacity: newVehicleCylinderCapacity,
            performance: newVehiclePerformance,
            mot: `${newVehicleDocumentValidity}`,
            nod: newVehicleDocument,
            mileage: newVehicleKm
        }
        const formData = new FormData();
        formData.append("preview", newVehicleWallpaper);
        for (let i = 0; i < newVehicleGallery.length; i++) {
            formData.append("picture", newVehicleGallery[i].file);
        }
        formData.append("manufacture", body.manufacture);
        formData.append("model", body.model);
        formData.append("fuel", body.fuel);
        formData.append("designType", body.designType);
        formData.append("driveType", body.driveType);
        formData.append("transmission", body.transmission);
        formData.append("vin", body.vin);
        formData.append("vintage", body.vintage);
        formData.append("ownMass", body.ownMass);
        formData.append("fullMass", body.fullMass);
        formData.append("cylinderCapacity", body.cylinderCapacity);
        formData.append("performance", body.performance);
        formData.append("nod", body.nod);
        formData.append("mot", body.mot);
        formData.append("mileage", body.mileage);
        formData.append("licenseNumber", body.licenseNumber);

        const headers = {
            'Content-Type': 'multipart/form-data',
            'x-access-token': localStorage.getItem("token")
        }
        const response = await axiosInstance.post("/addVehicle", formData, { headers })
                        .then((response) => {
                            toast.success("Sikeresen hozzáadtál egy új járművet!");
                            setIsAdding(false);
                            setIsModified(true);
                        })
                        .catch((error) => {
                            if (error.response.status == 422) {
                                toast.warning("Hiba! Nem töltöttél ki minden mezőt!");
                                return;
                            }

                            if (error.response.status == 409) {
                                toast.warning("Hiba! Ilyen alvázszámmal már létezik jármű!");
                                return;
                            }
                        });
    }

    /* vehicle search method(s) */
    const handleVehicleSearch = (e) => {
        setSearchText(e.target.value)
    }

    /* file upload methods */
    const handleVehiclePreviewChange = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        setNewVehicleWallpaperInBase64(base64);
        setNewVehicleWallpaper(file)
    }
    const handleNewVehicleGalleryImageDelete = (e, id) => {
        setNewVehicleGalleryImageLoading(true);
        const newAttachments = [...newVehicleGallery];

        for (let index = 0; index < newAttachments.length; index++) {
            const element = newAttachments[index];
            if (element.base64 == id) {
                element.deleted = true;
            }
        }

        setNewVehicleGallery(newAttachments);
        setNewVehicleGalleryImageLoading(false);
    }
    const handleNewVehicleGalleryUpload = async (e) => {
        setNewVehicleGalleryImageLoading(true);
        const attachments = [...newVehicleGallery];

        for (const file of e.target.files) {
            const base64 = await convertBase64(file);

            attachments.push({
                file: file,
                base64: base64,
                deleted: false
            })
        }

        setNewVehicleGallery(attachments);
        setNewVehicleGalleryImageLoading(false);
    }
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }
    /* end of file upload methods */

    /* data request methods */
    const getVehicles = async (token) => {
        const response = await axiosInstance.get("getVehicles",
            {
                headers: {
                    "x-access-token": token
                }
            });
        const data = await response.data;
        const vehicles = JSON.parse(JSON.stringify(data.data.vehicles))
        setVehicles(vehicles);

        /* When I am searching I search in the visiblevehicles and after I back up datas from vehicles */
        setVisibleVehicles(vehicles);
        setIsModified(false);
    }
    const getVehicleFuelTypes = async (token) => {
        const response = await axiosInstance.post("getFuels", {}, {
            headers: {
                "x-access-token": token
            }
        });
        const data = await JSON.parse(JSON.stringify(response.data.data.fuels));
        const fuels = []
        Array.from(data).forEach(fuelData => fuels.push({ id: fuelData._id, type: fuelData.fuel }))
        setVehicleFuels(fuels);
    }
    const getVehicleTypes = async (token) => {
        const response = await axiosInstance.post("getCategories", {}, {
            headers: {
                "x-access-token": token
            }
        });

        const data = await response.data;
        const categories = JSON.parse(JSON.stringify(data.data.categories))
        const arr = []
        Array.from(categories).forEach(x => arr.push({ id: x._id, type: x.vehicleType }))
        setVehicleTypes(arr);
    }

    /* dependent methods (vehicleType) */
    const getVehicleManufacturers = async (token, vehicleType) => {
        const response = await axiosInstance.post("getManufactures", {
                category: vehicleType
            },
            {
                headers: {
                    "x-access-token": token
                }
            });
        const data = await response.data;
        const manufactures = JSON.parse(JSON.stringify(data.data.manufacture))
        const arr = []
        Array.from(manufactures).forEach(x => arr.push({ id: x._id, manufacture: x.manufacture }))
        setVehicleManufacturers(arr);
    }
    const getVehicleDesignTypes = async (token, vehicleCategory) => {
        const response = await axiosInstance.post("getDesignTypes", {
                vehicleType: vehicleCategory
            },
            {
                headers: {
                    "x-access-token": token
                }
            });
        const data = await response.data;
        const types = JSON.parse(JSON.stringify(data.data.designTypes))
        const arr = []
        Array.from(types).forEach(x => arr.push({ id: x._id, type: x.designType }))
        setVehicleDesignTypes(arr);
    }
    const getVehicleTransmissions = async (token, vehicleCategory) => {
        const response = await axiosInstance.post("getTransmissions", {
                vehicleType: vehicleCategory
            },
            {
                headers: {
                    "x-access-token": token
                }
            });
        const data = await response.data;
        const types = JSON.parse(JSON.stringify(data.data.transmissions))
        const arr = []
        Array.from(types).forEach(x => arr.push({ id: x._id, transmission: x.transmission }))
        setVehicleTransmissions(arr);
    }
    const getVehicleDriveTypes = async (token, vehicleCategory) => {
        const response = await axiosInstance.post("getDriveTypes", {
                vehicleType: vehicleCategory
            },
            {
                headers: {
                    "x-access-token": token
                }
            });
        const data = await response.data;
        const types = JSON.parse(JSON.stringify(data.data.driveTypes))
        const arr = []
        Array.from(types).forEach(x => arr.push({ id: x._id, type: x.driveType }))
        setVehicleDriveTypes(arr);
    }
    const getVehicleModels = async (token, vehicleManufacture) => {
        const response = await axiosInstance.post("getModels", {
                manufacture: vehicleManufacture
            },
            {
                headers: {
                    "x-access-token": token
                }
            });
        const data = await response.data;
        const types = JSON.parse(JSON.stringify(data.data.models))
        const arr = []
        Array.from(types).forEach(x => arr.push({ id: x._id, model: x.model }))
        setVehicleModels(arr);
    }
    /* end data request methods */

    /* helper methods for car delete */
    const findVehicleNameById = (id) => {
        let vehicleName = "";
        visibleVehicles.forEach(x => {
            if (x.id == id) {
                vehicleName = `${x['manufacture'] + " " + x['model']}`;
                return;
            }
        })
        setCurrentDeletedVehicleName(vehicleName);
    }
    const deleteVehicle = async (id) => {
        if (!id) return;

        axiosInstance.delete(`/deleteVehicle/${id}`, {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            })
            .then((response) => {
                if (response.status == 202) {
                    setSuccessVehicleDelete(true);

                    // remove vehicle from vehicles and afterwards from the visiblevehicles
                    const newVehicles = [...vehicles].map((x) => (x.id !== id));
                    setVehicles(newVehicles);
                    setVisibleVehicles(newVehicles);
                }
            })
            .catch((err) => {
                setSuccessVehicleDelete(false);
            })
    }

    /* handle searching... */
    useEffect(() => {
        let filteredVehicles = [];
        let carName = "";
        vehicles.forEach(vehicle => {
            carName = vehicle.manufacture+" "+vehicle.model;
            if ((carName.toLowerCase()).startsWith(searchText.toLowerCase())) {
                filteredVehicles.push(vehicle)
            }
        })

        if (filteredVehicles.length === 0) {
            setIsSearchEmpty(true);
            setVisibleVehicles([])
        }
        else
        {
            setVisibleVehicles(filteredVehicles);
            setIsSearchEmpty(false);
        }
    }, [searchText]);


    /* rendering base datas (fuel types, vehicle types, vehicles) */
    useEffect(() => {
        /* fixing search field bugg */
        setIsSearchEmpty(false);

        /* fill car helper variables */
        let date = new Date();
        let carCache = []
        // y = year
        for (let y = date.getFullYear(); y >= 1950; y--) {
            carCache.push(y)
        }
        setVehicleVintages(carCache);

        /* getting datas from server */
        const token = localStorage.getItem("token");

        /* method execution order is very important! First is always the getvehicletypes */
        getVehicleFuelTypes(token);
        getVehicleTypes(token);
        getVehicles(token);

        /* end loading screen */
        setIsLoading(false)
    }, []);

    /* handle vehicle type change */
    useEffect(() => {
        if (newVehicleCategory == null) return;

        /*  clear old states */
        setNewVehicleDesignType("")
        setNewVehicleManufacture("")
        setNewVehicleModel("")

        const token = localStorage.getItem("token");
        getVehicleManufacturers(token, newVehicleCategory);
        getVehicleDesignTypes(token, newVehicleCategory);
        getVehicleTransmissions(token, newVehicleCategory);
        getVehicleDriveTypes(token, newVehicleCategory);

    }, [newVehicleCategory])

    /* handle vehicle manufacture change */
    useEffect(() => {
        if (!newVehicleManufacture) return;

        const token = localStorage.getItem("token");
        getVehicleModels(token, newVehicleManufacture);
    }, [newVehicleManufacture]);

    /* handle add car state variable change */
    useEffect(() => {
        let today = new Date();
        if (newVehicleVintage < 0) setNewVehicleVintage(0);
        if (newVehicleVintage < 1950) setNewVehicleVintage(0);
        if (newVehicleVintage > today.getFullYear()) setNewVehicleVintage(today.getFullYear())

    }, [newVehicleVintage]);

    useEffect(() => {
        /* The modified variable is true when I upload a new vehicle */
        if (isModified) {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            /* method execution order is very important! First is always the getvehicletypes */
            getVehicles(token);
            setIsLoading(false);
        }
    }, [isModified])

    /* loading screen */
    if (isLoading) {
        return (<React.Fragment>
            <Grid container direction="row" alignItems="center" justifyContent="flex-end">
                <Grid item>
                    <MyInputSkeleton />
                </Grid>

                <Grid item>
                    <MyInputSkeleton />
                </Grid>
            </Grid>

            <MyCardSkeleton />
            <MyCardSkeleton />
            <MyCardSkeleton />
        </React.Fragment>)
    }

    /* original screen */
    return (<React.Fragment>
        <Grid container direction="row" alignItems="center" justifyContent="flex-end">
            <Grid item>
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Keresés…"
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={e=>handleVehicleSearch(e)}
                    />
                </Search>
            </Grid>

            <Grid item>
                <Button sx={{boxShadow: "0px 0px 0px rgb(0 0 0 / 25%)"}} variant="contained" color="warning" startIcon={ isAdding ? <DoNotDisturbOnOutlinedIcon /> : <AddCircleOutlineOutlinedIcon />} onClick={e=>setIsAdding(!isAdding)}>
                    Hozzáadás
                </Button>
            </Grid>
        </Grid>

        { /* search field texts */ }
        {
            isSearchEmpty && (<SubTitle variant="h3">Nincs ilyen jármű!</SubTitle>)
        }

        { /* start create new car section */ }
        {
            isAdding && <>
                <SubTitle variant="h3">Új jármű rögzítése</SubTitle>

                <ContentBox>
                    <Grid container direction="column">
                        <Grid item>
                            <CarCard>
                                <Grid container direction={underMD ? "column" : "row"}
                                      alignItems={underMD ? "center" : "flex-start"}
                                      justifyContent={underMD && "center"}>
                                    <Grid item>
                                        <CarCardMedia
                                            component="img"
                                            image={newVehicleWallpaperInBase64 ? newVehicleWallpaperInBase64 : "https://t3.ftcdn.net/jpg/04/21/50/96/360_F_421509616_AW4LfRfbYST8T2ZT9gFGxGWfrCwr4qm4.jpg"}
                                            alt="new-wallpaper"
                                        />
                                    </Grid>

                                    <Grid item>
                                        <CarCardContent>
                                            <AddCarSubTitle variant="h4">
                                                Háttérkép feltöltése
                                            </AddCarSubTitle>

                                            <MyTextField onChange={e=>handleVehiclePreviewChange(e)} inputProps={{ accept: 'image/*' }} fullWidth name="wallpaper" placeholder="Kép kiválasztása..."
                                                       type="file" />
                                        </CarCardContent>
                                    </Grid>
                                </Grid>

                                <CarCardContent>
                                    { /* általános adatok */ }
                                    <AddCarSubTitle variant="h4">
                                        Általános Adatok
                                    </AddCarSubTitle>

                                    <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                                        <Grid item xs={1}>
                                            <Typography align="center">
                                                <EnergySavingsLeafOutlinedIcon />
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={11}>
                                            <MyTextField
                                                fullWidth
                                                id="outlined-disabled"
                                                label="Alvázszám"
                                                type="text"
                                                onChange={e=>{
                                                    if (newVehicleVin.length <= parseInt(process.env.REACT_APP_MAXIMUM_VIN_LENGTH)) {
                                                        setNewVehicleVin(e.target.value+"".toUpperCase())
                                                    } else if (newVehicleVin.length > parseInt(process.env.REACT_APP_MAXIMUM_VIN_LENGTH)) {
                                                        setErrorMessageDuringCarAdd("alvázszám", "Az alvázszám nem lehet hosszabb mint 18 karakter!")
                                                        setNewVehicleVin("")
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                                        <Grid item xs={1}>
                                            <Typography align="center">
                                                <TextsmsOutlinedIcon />
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={11}>
                                            <MyTextField
                                                fullWidth
                                                id="outlined-disabled"
                                                label="Rendszám"
                                                type="text"
                                                onChange={e=>{
                                                    if (newVehicleLicenseNum.length <= parseInt(process.env.REACT_APP_MAXIMUM_LICENSE_PLATE_NUMBER_LENGTH)) {
                                                        setNewVehicleLicenseNum(e.target.value+"".toUpperCase())
                                                    } else if (newVehicleLicenseNum.length > parseInt(process.env.REACT_APP_MAXIMUM_LICENSE_PLATE_NUMBER_LENGTH)) {
                                                        setErrorMessageDuringCarAdd("rendszám", "A rendszám nem lehet hosszabb mint 18 karakter!")
                                                        setNewVehicleLicenseNum("");
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                                        <Grid item xs={1}>
                                            <Typography align="center">
                                                <DirectionsCarFilledOutlinedIcon />
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={11}>
                                            <MyFormControll fullWidth>
                                                <InputLabel id="demo-simple-select-label">Jármű kategória</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Jármű kategória"
                                                    onChange={e => setNewVehicleCategory(e.target.value)
                                                    }
                                                    value={newVehicleCategory}
                                                    defaultValue={vehicleTypes[0].id}
                                                >
                                                    {
                                                        vehicleTypes.map((x, i) => {
                                                            return <MenuItem key={x+i} value={`${x.id}`}>{x.type}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                            </MyFormControll>
                                        </Grid>
                                    </Grid>

                                    <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                                        <Grid item xs={1}>
                                            <Typography align="center">
                                                <DiscountOutlinedIcon />
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={11}>
                                            <MyFormControll fullWidth>
                                                <InputLabel id="demo-simple-select-label">Jármű márkája</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Jármű márkája"
                                                    onChange={e => setNewVehicleManufacture(e.target.value)}
                                                    value={newVehicleManufacture}
                                                    MenuProps={MenuProps}
                                                >
                                                    {
                                                        vehicleManufacturers.map((x,i) => {
                                                            return <MenuItem key={x+i} value={`${x.id}`}>{x.manufacture}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                            </MyFormControll>
                                        </Grid>
                                    </Grid>

                                    <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                                        <Grid item xs={1}>
                                            <Typography align="center">
                                                <AccountTreeOutlinedIcon />
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={11}>
                                            <MyFormControll fullWidth>
                                                <InputLabel id="demo-simple-select-label">Jármű modell</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Jármű modell"
                                                    onChange={e => setNewVehicleModel(e.target.value)}
                                                    value={newVehicleModel}
                                                    MenuProps={MenuProps}
                                                >
                                                    {
                                                        vehicleModels.map((x,i) => {
                                                            return <MenuItem key={x+i} value={`${x.id}`}>{x.model}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                            </MyFormControll>
                                        </Grid>
                                    </Grid>

                                    <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                                        <Grid item xs={1}>
                                            <Typography align="center">
                                                <CarTypeIcon />
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={11}>
                                            <MyFormControll fullWidth>
                                                <InputLabel id="demo-simple-select-label">Kivitel</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Kivitel"
                                                    onChange={e => setNewVehicleDesignType(e.target.value)}
                                                    value={newVehicleDesignType}
                                                    MenuProps={MenuProps}
                                                >
                                                    {vehicleDesignTypes.map((x, i) => {
                                                        return <MenuItem
                                                            key={x + i}
                                                            value={x.id}
                                                        >
                                                            {x.type}
                                                        </MenuItem>
                                                    })}
                                                </Select>
                                            </MyFormControll>
                                        </Grid>
                                    </Grid>

                                    <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                                        <Grid item xs={1}>
                                            <Typography align="center">
                                                <DateIcon />
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={11}>
                                            <MyFormControll fullWidth>
                                                <InputLabel id="demo-simple-select-label">Évjárat</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Évjárat"
                                                    onChange={e => setNewVehicleVintage(e.target.value)}
                                                    value={newVehicleVintage}
                                                    defaultValue={newVehicleVintage}
                                                    MenuProps={MenuProps}
                                                >
                                                    {
                                                        Array.from(vehicleVintages).map((year, i) => {
                                                            return <MenuItem value={`${year+""}`}>{year + " "}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                            </MyFormControll>
                                        </Grid>
                                    </Grid>
                                    { /* ----- általános adatok */ }

                                    { /* Jármű adatok */ }
                                    <AddCarSubTitle variant="h4">
                                        Jármű adatok
                                    </AddCarSubTitle>

                                    <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                                        <Grid item xs={1}>
                                            <Typography align="center">
                                                <KmIcon />
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={11}>
                                            <MyTextField
                                                fullWidth
                                                id="outlined-disabled"
                                                label="Km. óra állás"
                                                type="number"
                                                onChange={e=>{
                                                    let kmInput = parseInt(e.target.value+"")

                                                    if (kmInput < 0)
                                                    {
                                                        setErrorMessageDuringCarAdd("km", "Ez a mező nem lehet kisebb mint 0!");
                                                        return;
                                                    }
                                                    else if (kmInput >= parseInt(process.env.REACT_APP_MAXIMUM_KM))
                                                    {
                                                        setErrorMessageDuringCarAdd("km", `Ez a mező nem lehet nagyobb mint ${process.env.REACT_APP_MAXIMUM_KM} km!`);
                                                        return;
                                                    }
                                                    setNewVehicleKm(kmInput)
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                                        <Grid item xs={1}>
                                            <Typography align="center">
                                                <CarWeightIcon />
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={11}>
                                            <MyTextField
                                                fullWidth
                                                id="outlined-disabled"
                                                label="Saját tömeg (kg)"
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="start">kg</InputAdornment>,
                                                }}
                                                default={0}
                                                type="number"
                                                onChange={e=>{
                                                    let weight = parseInt(e.target.value);
                                                    if (weight < 0)
                                                    {
                                                        setErrorMessageDuringCarAdd("önsúly", "Ez a mező nem lehet kisebb mint 0!");
                                                        return;
                                                    }
                                                    else if (weight > parseInt(process.env.REACT_APP_MAXIMUM_WEIGHT)) {
                                                        if (weight < 0)
                                                        {
                                                            setErrorMessageDuringCarAdd("önsúly", `Ez a mező nem lehet nagyobb mint ${parseInt(process.env.REACT_APP_MAXIMUM_WEIGHT)} kg!`);
                                                            return;
                                                        }
                                                    }

                                                    setNewVehicleOwnWeight(weight)
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                                        <Grid item xs={1}>
                                            <Typography align="center">
                                                <CarWeightIcon />
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={11}>
                                            <MyTextField
                                                fullWidth
                                                id="outlined-disabled"
                                                label="Teljes tömeg"
                                                default={0}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="start">kg</InputAdornment>,
                                                }}
                                                type="number"
                                                onChange={e=>{
                                                    let weight = parseInt(e.target.value);
                                                    if (weight < 0)
                                                    {
                                                        setErrorMessageDuringCarAdd("teljes tömeg", "Ez a mező nem lehet kisebb mint 0!");
                                                        return;
                                                    }
                                                    else if (weight > parseInt(process.env.REACT_APP_MAXIMUM_WEIGHT)) {
                                                        if (weight < 0)
                                                        {
                                                            setErrorMessageDuringCarAdd("teljes tömeg", `Ez a mező nem lehet nagyobb mint ${process.env.REACT_APP_MAXIMUM_WEIGHT} kg!`);
                                                            return;
                                                        }
                                                    }

                                                    setNewVehicleMaxWeight(weight)
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    { /* ----- Jármű adatok */ }

                                    { /* Motor adatok */ }
                                    <AddCarSubTitle variant="h4">
                                        Motor adatok
                                    </AddCarSubTitle>

                                    <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                                        <Grid item xs={1}>
                                            <Typography align="center">
                                                <FuelIcon />
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={11}>
                                            <MyFormControll fullWidth>
                                                <InputLabel id="demo-simple-select-label">Üzemanyag</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Üzemanyag"
                                                    onChange={e =>setNewVehicleFuel(e.target.value)}
                                                    value={newVehicleFuel}
                                                    MenuProps={MenuProps}
                                                >
                                                    {
                                                        vehicleFuels.map((x,i) => {
                                                            return <MenuItem key={i+"asdsad"} value={x.id}>{x.type}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                            </MyFormControll>
                                        </Grid>
                                    </Grid>

                                    <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                                        <Grid item xs={1}>
                                            <Typography align="center">
                                                <TankIcon />
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={11}>
                                            <MyTextField
                                                fullWidth
                                                id="outlined-disabled"
                                                label="Hengerűrtartalom"
                                                type="number"
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="start">cm<sup>3</sup></InputAdornment>,
                                                }}
                                                default={500}
                                                onChange={e=>{
                                                    let amount = parseInt(e.target.value);
                                                    if (amount < 0)
                                                    {
                                                        setErrorMessageDuringCarAdd("hengerűrtartalom", "Ez a mező nem lehet kisebb mint 0!");
                                                        return;
                                                    }
                                                    else if (amount > parseInt(process.env.REACT_APP_MAXIMUM_CYLINDER_CAPACITY)) {
                                                        if (amount < 0)
                                                        {
                                                            setErrorMessageDuringCarAdd("hengerűrtartalom", `Ez a mező nem lehet nagyobb mint ${process.env.REACT_APP_MAXIMUM_CYLINDER_CAPACITY}!`);
                                                            return;
                                                        }
                                                    }

                                                    setNewVehicleCylinderCapacity(amount)
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                                        <Grid item xs={1}>
                                            <Typography align="center">
                                                <PerformanceIcon />
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={11}>
                                            <Grid container direction="row">
                                                <Grid item xs>
                                                    <MyTextField
                                                        fullWidth
                                                        id="outlined-disabled"
                                                        label="Teljesítmény"
                                                        InputProps={{
                                                            endAdornment: <InputAdornment position="start">LE</InputAdornment>,
                                                        }}
                                                        default={0}
                                                        type="number"
                                                        onChange={e=>{
                                                            let amount = parseInt(e.target.value);
                                                            if (amount < 0)
                                                            {
                                                                setErrorMessageDuringCarAdd("teljesítmény (le)", "Ez a mező nem lehet kisebb mint 0!");
                                                                return;
                                                            }
                                                            else if (amount > parseInt(process.env.REACT_APP_MAXIMUM_PERFORMANCE_LE)) {
                                                                if (amount < 0)
                                                                {
                                                                    setErrorMessageDuringCarAdd("teljesítmény (le)", `Ez a mező nem lehet nagyobb mint ${process.env.REACT_APP_MAXIMUM_PERFORMANCE_LE}!`);
                                                                    return;
                                                                }
                                                            }

                                                            setNewVehiclePerformance(amount)
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                                        <Grid item xs={1}>
                                            <Typography align="center">
                                                <WheelIcon />
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={11}>
                                            <MyFormControll fullWidth>
                                                <InputLabel id="demo-simple-select-label">Hajtás</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Hajtás"
                                                    onChange={e =>setNewVehicleDriveType(e.target.value)}
                                                    value={newVehicleDriveType}
                                                    defaultValue={"hatso"}
                                                    MenuProps={MenuProps}
                                                >
                                                    {
                                                        vehicleDriveTypes.map((x, i) => {
                                                            return <MenuItem key={i+"xasda2"} value={x.id}>{x.type}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                            </MyFormControll>
                                        </Grid>
                                    </Grid>

                                    <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                                        <Grid item xs={1}>
                                            <Typography align="center">
                                                <ChangeGearIcon />
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={11}>
                                            <MyFormControll fullWidth>
                                                <InputLabel id="demo-simple-select-label">Sebességváltó</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Sebességváltó"
                                                    onChange={e =>setNewVehicleTransmission(e.target.value)}
                                                    value={newVehicleTransmission}
                                                    MenuProps={MenuProps}
                                                >
                                                    {
                                                        vehicleTransmissions.map((x, i) => {
                                                            return <MenuItem key={i+"xasda2"} value={x.id}>{x.transmission}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                            </MyFormControll>
                                        </Grid>
                                    </Grid>
                                    { /* ----- Motor adatok */ }

                                    <AddCarSubTitle variant="h4">
                                        Okmányok
                                    </AddCarSubTitle>

                                    { /* Okmányok */ }
                                    <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                                        <Grid item xs={1}>
                                            <Typography align="center">
                                                <DocumentsIcon />
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={11}>
                                            <MyTextField
                                                fullWidth
                                                id="outlined-disabled"
                                                label="Okmányok jellege"
                                                type="text"
                                                onChange={e =>setNewVehicleDocument(e.target.value)}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                                        <Grid item xs={1}>
                                            <Typography align="center">
                                                <DocumentsIcon />
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={11}>
                                            <MyTextField
                                                fullWidth
                                                id="outlined-disabled"
                                                default={new Date().toLocaleDateString("en-CA")}
                                                value={newVehicleDocumentValidity}
                                                type="date"
                                                onChange={e=>{
                                                    setNewVehicleDocumentValidity(moment(e.target.value).format("YYYY-MM-DD"))
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    { /* ----- end of Okmányok */ }

                                    <AddCarSubTitle variant="h4">
                                        Kép Galléria
                                    </AddCarSubTitle>

                                    { /* TODO: I can't delete the gallery image. */ }

                                    <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                                        <Grid item xs={1}>
                                            <Typography align="center">
                                                <DocumentsIcon />
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={11}>
                                            <MyTextField
                                                fullWidth
                                                id="outlined-disabled"
                                                default={2010}
                                                type="file"
                                                multiple={true}
                                                onChange={e=>handleNewVehicleGalleryUpload(e)}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container
                                        direction="row"
                                        wrap="wrap"
                                        justifyContent="center"
                                        gap={2}
                                    >
                                        {
                                            !newVehicleGalleryImageLoading && Array.from(newVehicleGallery).map((obj, i) => {
                                                return !obj.deleted && <Grid item>
                                                    <Grid container direction="column" gap={2} justifyContent="center" alignItems="center">
                                                        <Grid item>
                                                            <GalleryImage
                                                                key={obj+"asd"+i}
                                                                src={`${obj.base64}`}
                                                                loading="lazy"
                                                            />
                                                        </Grid>

                                                        <Grid item>
                                                            <IconButton onClick={e=>handleNewVehicleGalleryImageDelete(e, obj.base64)}>
                                                                <RemoveCircleOutlineOutlinedIcon color="error" />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            })}
                                    </Grid>

                                </CarCardContent>

                                <CarCardActions>
                                    <Button sx={{marginLeft: "auto"}} variant="contained" color="warning" onClick={e=>setIsAdding(false)}>Mégsem</Button>
                                    <Button variant="contained" color="success" onClick={e=>handleNewVehicle(e)}>Mentés</Button>
                                </CarCardActions>
                            </CarCard>
                        </Grid>
                    </Grid>

                    {
                        AddCarErrorMessageBox && (<ContentBox>
                            <Typography variant="h4" color="error">{AddCarErrorMessageBox}</Typography>
                        </ContentBox>)
                    }
                </ContentBox>
            </>
        }
        { /* end of create new car */ }

        {
            visibleVehicles.length == 0 && !isSearchEmpty && <Typography variant="h4">Jelenleg nincs járműved!</Typography>
        }

        {
            visibleVehicles.length > 0 && visibleVehicles.map((vehicle,i) => {
                return <ContentBox key={vehicle+i}>
                    <Grid container direction="column">
                        <Grid item>
                            <CarCard>
                                <CarCardHeader
                                    title={`${vehicle.manufacture} ${vehicle.model}`}
                                    action={
                                        <IconButton aria-label="settings" onClick={e => {
                                            changeCarOptions(true);
                                            setCarAnchorEL(e.target)
                                        }}>
                                            <MoreVertIcon/>
                                        </IconButton>
                                    }
                                >
                                </CarCardHeader>

                                <Grid container direction={underMD ? "column" : "center"}
                                      alignItems={underMD ? "center" : "flex-start"}
                                      justifyContent={underMD && "center"}>
                                    <Grid item>
                                        <CarCardMedia
                                            component="img"
                                            image={`${vehicle['preview']}`}
                                            alt={vehicle.manufacture+" "+vehicle.model}
                                        />
                                    </Grid>

                                    <Grid item>
                                        <CarCardContent>
                                            <Grid container direction="column" justifyContent="center">
                                                <Grid container direction="row" spacing={2}>
                                                    <Grid item><Typography variant="h4">Alvázszám:</Typography></Grid>
                                                    <Grid item><Typography
                                                        variant="h4">{vehicle.vin}</Typography></Grid>
                                                </Grid>

                                                <Grid container direction="row" spacing={2}>
                                                    <Grid item><Typography variant="h4">Rendszám:</Typography></Grid>
                                                    <Grid item><Typography
                                                        variant="h4">{vehicle.licenseNumber}</Typography></Grid>
                                                </Grid>

                                                { vehicle.serviceEntries && <Grid container direction="row" spacing={2}>
                                                    <Grid item><Typography variant="h4">Bejegyzett
                                                        szervízek:</Typography></Grid>
                                                    <Grid item><Typography
                                                        variant="h4">{vehicle.serviceEntries.length}</Typography></Grid>
                                                </Grid> }
                                            </Grid>
                                        </CarCardContent>
                                    </Grid>
                                </Grid>

                                <CarCardActions>
                                    {
                                        underMD
                                            ?
                                            <Chip label={moment(vehicle.vintage).format("YYYY")} variant="outlined"/>
                                            :
                                            <><Chip label={moment(vehicle.vintage).format("YYYY")} variant="outlined"/>
                                                <Chip label={`${vehicle.mileage} km`} variant="outlined"/>
                                                <Chip label={`${vehicle.performanceLE} LE`} variant="outlined"/></>
                                    }
                                    <ViewButton sx={{marginLeft: "auto"}} component={Link}
                                                to={`/jarmuveim/${vehicle.id}`} onClick={e => {
                                        if (!localStorage.getItem("last_viewed")) {
                                            localStorage.setItem("last_viewed", JSON.stringify([]));
                                        }

                                        let exists = false;
                                        let ids = Array.from(JSON.parse(localStorage.getItem("last_viewed")));

                                        for (let i = 0; i < ids.length; i++) {
                                            if (ids[i] == vehicle.id) {
                                                exists = true;
                                            }
                                        }

                                        if (!exists) {
                                            /* remove old ids from localStorage because I want to handle the array everytime */
                                            localStorage.removeItem("last_viewed");

                                            const maxActivities = process.env.REACT_APP_MAXIMUM_ACTIVITIES;
                                            if (ids.length > maxActivities) {
                                                ids = ids.map((x, i) => {
                                                    if (i < maxActivities) {
                                                        return x;
                                                    }
                                                })
                                            }
                                            else
                                            {
                                                ids.unshift(vehicle.id);
                                            }

                                            localStorage.setItem("last_viewed", JSON.stringify(ids));
                                        }
                                        handleChangeTab(1)
                                    }}>Megtekintem</ViewButton>
                                </CarCardActions>
                            </CarCard>
                        </Grid>
                    </Grid>

                    <CarOptionsMenu
                        id="basic-menu"
                        anchorEl={carAnchorEl}
                        open={openCarOptions}
                        onClose={e => changeCarOptions(!openCarOptions)}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <Divider/>
                        <Button startIcon={<DoNotDisturbOnOutlinedIcon sx={{color: "red"}}/>}>
                            <MenuText variant="h4" onClick={async (e) => {
                                setCarModal(true);
                                changeCarOptions(false)
                                setCurrentDeletedVehicleID(vehicle.id+"");
                                findVehicleNameById(vehicle.id);
                            }}>Törlés</MenuText>
                        </Button>
                        <Divider/>
                        <Tooltip
                            PopperProps={{
                                disablePortal: true,
                            }}
                            open={openCopyToolTip}
                            onClick={e => setOpenCopyToolTip(!openCopyToolTip)}
                            onClose={e => setOpenCopyToolTip(!openCopyToolTip)}
                            title="Másolva a vágólapodra!"
                        >
                            <Button startIcon={<ShareOutlinedIcon/>}>
                                <MenuText variant="h4"
                                          onClick={e => CopyToClipBoard(`${process.env.REACT_APP_CLIENT_URL}/jarmuveim/${vehicle.id}`)}>Megosztás</MenuText>
                            </Button>
                        </Tooltip>
                    </CarOptionsMenu>
                </ContentBox>
            })
        }
        <CarDialog
            open={carModal}
            onClose={e=>setCarModal(!carModal)}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
            >
            <DialogTitle id="alert-dialog-title">
                <Typography variant="h2">Figyelmeztetés</Typography>
            </DialogTitle>

            <DialogContent>
                <CarDialogText id="alert-dialog-description">
                    Biztosan törölni kívánja az alábbi elemet?
                    ( <b>{currentDeletedVehicleName}</b> )
                </CarDialogText>
            </DialogContent>

            <DialogActions>
                <Button onClick={e=>setCarModal(!carModal)} variant="contained" color="success">Mégsem</Button>
                <Button onClick={e=>{deleteVehicle(currentDeletedVehicleId); setCarModal(!carModal); setIsSnackOpen(!isSnackOpen)}} variant="contained" color="error" autoFocus>
                Törlés
                </Button>
            </DialogActions>
        </CarDialog>

        <Snackbar open={isSnackOpen} autoHideDuration={6000} onClose={e=>setIsSnackOpen(!isSnackOpen)}>
            <Alert onClose={e=>setIsSnackOpen(!isSnackOpen)} severity={ successVehicleDelete ? "success" : "error" } sx={{ width: '100%' }}>
                { successVehicleDelete ? `Sikeresen törölted az alábbi elemet (${currentDeletedVehicleName})!` : `Az alábbi elem
                ${currentDeletedVehicleName} törlése sikertelen volt!` }
            </Alert>
        </Snackbar>
    </React.Fragment>)
}

export default Garage;