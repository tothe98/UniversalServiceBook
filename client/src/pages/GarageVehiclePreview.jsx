import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Button,
    Grid,
    styled,
    Typography,
    useMediaQuery
} from "@mui/material";
import {Link} from "react-router-dom";
import theme from "../themes/theme";
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import {LoadingButton} from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DOMPurify from "isomorphic-dompurify";

const CONTENT_BOX_MAX_HEIGHT = "200px";
const CAR_NAME_BOX_MAX_HEIGHT = "80px";
const CAR_DETAiL_SPACING = 2;
const CAR_DETAIL_GRID_ITEM_SPACE = "1em";

const SubTitle = styled(Typography)(({theme}) => ({
    ...theme.typography.link,
    marginBottom: "2rem",
    fontWeight: 800
}))

const ContentBox = styled('div')(({theme}) => ({
    position: "relative",
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

const NameBox = styled('div')(({theme}) => ({
    maxHeight: CAR_NAME_BOX_MAX_HEIGHT,
    height: "auto",
    background: theme.palette.common.white,
    boxShadow: theme.shadows[25],
    margin: "23px 0",
    padding: "10px"
}))

const BackToCarsButton = styled(Button)(({theme}) => ({
    color: theme.palette.common.darkblack,
    textTransform: "none",
    borderColor: `#D0D7DE`,
    borderRadius: "5px"
}))

const CarWallPaperImage = styled("img")(({theme}) => ({
    objectFit: "cover",
    width: "100%",
    height: "100%"
}))

const CarGalleryImage = styled("img")(({theme}) => ({
    maxWidth: "97px",
    objectFit: "cover",
    width: "100%",
    height: "auto",
    "&:hover": {
        opacity: 0.7
    }
}))

const CarDetailsTitle = styled(Typography)(({theme}) => ({
    fontWeight: 800
}))

const CarDetailGridItem = styled(Grid)(({theme}) => ({
    marginBottom: CAR_DETAIL_GRID_ITEM_SPACE
}))

const CarDetailValue = styled(Typography)(({theme}) => ({
    fontWeight: 390
}))

const MyAccordion = styled(Accordion)(({theme}) => ({
    border: `1px solid ${theme.palette.common.lightgray}`,
    marginBottom: "0.5em"
}))

const MyAccordionImage = styled("img")(({theme}) => ({
    maxWidth: "300px",
    width: "100%",
    height: "100%",
    objectFit: "cover"
}))

function GarageVehiclePreview({handleChangeTab}) {
    const underMD = useMediaQuery(theme.breakpoints.down("md"));
    const underS = useMediaQuery(theme.breakpoints.down("sm"));
    const [car, setCar] = useState({});
    const [expanded, setExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    useEffect(() => {
        // TODO: axios request to the api (getting the specified car)
        const car = {
            carId: "2e2zbahdb2a#",
            imageUrl: "https://hasznaltauto.medija.hu/2202975/18830119_1.jpg?v=1668441109", // https://hasznaltauto.medija.hu/2700439/18711995_1.jpg?v=1665186628
            carName: "Honda Accord",
            chassisNumber: "JACUBS25DN7100010",
            licensePlateNumber: "AA AA 001",
            motorNumber: "Z14XEP19ET4682",
            registeredServices: 10,
            gallery: [
                "https://hasznaltauto.medija.hu/2202975/18830119_2.jpg?v=1668441109",
                "https://hasznaltauto.medija.hu/2202975/18830119_3.jpg?v=1668441109",
                "https://hasznaltauto.medija.hu/2202975/18830119_4.jpg?v=1668441109",
                "https://hasznaltauto.medija.hu/2202975/18830119_5.jpg?v=1668441109",
                "https://hasznaltauto.medija.hu/2202975/18830119_6.jpg?v=1668441109",
                "https://hasznaltauto.medija.hu/2202975/18830119_7.jpg?v=1668441109",
                "https://hasznaltauto.medija.hu/2202975/18830119_8.jpg?v=1668441109",
                "https://hasznaltauto.medija.hu/2202975/18830119_9.jpg?v=1668441109",
                "https://hasznaltauto.medija.hu/2202975/18830119_10.jpg?v=1668441109"
            ],
            services: [
                {
                    id: "12312xa2132",
                    date: new Date(),
                    message: "Figyelem az ön Honda Accord gépjárműve (alvz.szm: JACUBS25DN7100010)\n" +
                        "2023.01.13-án kötelező szervízen kell résztvennie!",
                    images: [
                        "https://bontoplaza.hu/pic.php?guid=0FACD49A-E9D1-4B94-B142-299679E55EBE"
                    ],
                    kmHour: 200_012
                },
                {
                    id: "asdawd2e21a",
                    date: new Date(),
                    message: "Figyelem az ön Honda Accord gépjárműve (alvz.szm: JACUBS25DN7100010)\n" +
                        "2023.01.13-án kötelező szervízen kell résztvennie!",
                    images: [
                        "https://bontoplaza.hu/bontott-alkatresz-kepek/opel-astra-h-1.6-gyujtotrafo_532EB777-49C6-464D-BFB2-46194A7A8CA6_MEDIUM.jpg"
                    ],
                    kmHour: 200_013
                },
                {
                    id: "12312QA2132",
                    date: new Date(),
                    message: "Figyelem az ön Honda Accord gépjárműve (alvz.szm: JACUBS25DN7100010)\n" +
                        "2023.01.13-án kötelező szervízen kell résztvennie!",
                    images: [
                        "https://bontoplaza.hu/pic.php?guid=3FC4B8AB-A1CB-43E6-B228-941F8F6D96AC&size=LARGE"
                    ],
                    kmHour: 200_015
                }
            ]
        }

        setCar(car);
        setIsLoading(false)
    }, []);

    if (isLoading)
    {
        return (<React.Fragment>
            <BackToCarsButton startIcon={<KeyboardBackspaceOutlinedIcon />} component={Link} to="/garazs" onClick={e=>{handleChangeTab(1)}} >
                <SubTitle variant='h3' sx={{marginBottom: "0", marginLeft: "1em"}}>Autóim</SubTitle>
            </BackToCarsButton>

            <NameBox>
                <Typography variant="h3" sx={{fontWeight: 900}}>{car.carName}</Typography>
                <Typography variant="h4" sx={{ color: "rgba(17, 17, 17, 0.74)", fontWeight: 900 }}>{car.chassisNumber}</Typography>
            </NameBox>

            <Grid container direction="row">
                <Grid item>
                    <LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />}>Betöltés...</LoadingButton>
                </Grid>
            </Grid>
        </React.Fragment>)
    }

    return (<React.Fragment>
        <BackToCarsButton startIcon={<KeyboardBackspaceOutlinedIcon />} component={Link} to="/garazs">
            <SubTitle variant='h3' sx={{marginBottom: "0", marginLeft: "1em"}}>Autóim</SubTitle>
        </BackToCarsButton>

        <NameBox>
            <Typography variant="h3" sx={{fontWeight: 900}}>{car.carName}</Typography>
            <Typography variant="h4" sx={{ color: "rgba(17, 17, 17, 0.74)", fontWeight: 900 }}>{car.chassisNumber}</Typography>
        </NameBox>

        <Grid container direction="column" alignItems="flex-start">
            { /* Car Image Gallery */ }
            <Grid item >
                <Grid container direction={underMD ? "column" : "row"} spacing={CAR_DETAiL_SPACING}>
                    <Grid item xs={7}>
                        <Grid container direction="column" alignItems="flex-start" justifyContent="center">
                            <Grid item>
                                <CarWallPaperImage src={car.imageUrl}  alt={car.carName}/>

                                <Grid container direction="row" spacing={0.4}>
                                    {
                                        car.gallery.map(image => {
                                            return <Grid item><CarGalleryImage src={image} /></Grid>
                                        })
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Car Details */}
                    <Grid item xs={5}>
                        <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start">

                            { /* car detail */ }
                            <CarDetailGridItem item>
                                <CarDetailsTitle>Általános Adatok</CarDetailsTitle>

                                <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start" sx={{paddingLeft: "2.5em"}}>
                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Évjárat: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>2007/6</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Kivitel: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>Sedan</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </CarDetailGridItem>
                            { /* end of car detail */ }

                            { /* car detail */ }
                            <CarDetailGridItem item>
                                <CarDetailsTitle>Jármű adatok</CarDetailsTitle>

                                <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start" sx={{paddingLeft: "2.5em"}}>
                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Km. óra állás: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>192 332 km</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Saját tömeg: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>1 458 kg</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Teljes tömeg: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>1 970 kg</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </CarDetailGridItem>
                            { /* end of car detail */ }

                            { /* car detail */ }
                            <CarDetailGridItem item>
                                <CarDetailsTitle>Motor adatok</CarDetailsTitle>

                                <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start" sx={{paddingLeft: "2.5em"}}>
                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Üzemanyag: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>Dízel</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Hengerűrtartalom: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>2 204 cm<sup>3</sup></CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Teljesítmény: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>103 kW, 140 LE</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Hajtás: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>Első kerék</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Sebességváltó: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>Manuális</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </CarDetailGridItem>
                            { /* end of car detail */ }

                            { /* car detail */ }
                            <CarDetailGridItem item>
                                <CarDetailsTitle>Okmányok</CarDetailsTitle>

                                <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start" sx={{paddingLeft: "2.5em"}}>
                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Okmányok jellege: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>Magyar</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Műszaki vizsga érvényessége: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>2022/10</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </CarDetailGridItem>
                            { /* end of car detail */ }

                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            { /* Service information(s) */ }
            <Grid item sx={{width: "100%"}}>
                    <NameBox> <Typography>Szervíz Előélet</Typography> </NameBox>
                    <Grid container direction="column">
                        {
                            Array.from(car.services).map((service, i) => {
                                let panel = `panel${i}`
                                return <MyAccordion expanded={expanded === panel} onChange={handleAccordionChange(panel)} TransitionProps={{ unmountOnExit: true }} >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header"
                                    >
                                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                            #{i+1} Szervíz Bejegyzés
                                        </Typography>
                                        { !underMD && <Typography sx={{ color: 'text.secondary' }}>{service.kmHour} km</Typography> }
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography  dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(service.message)}}>
                                        </Typography>

                                        <div>
                                            {
                                                service.images.map(serviceImage => <MyAccordionImage src={serviceImage}  alt={`${service.id}`} />)
                                            }
                                        </div>
                                    </AccordionDetails>
                                </MyAccordion>
                            })
                        }
                    </Grid>
            </Grid>
        </Grid>
    </React.Fragment>)
}

export default GarageVehiclePreview;