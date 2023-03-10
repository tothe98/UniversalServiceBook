import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import {
    axiosInstance
} from "../lib/GlobalConfigs" 
import {
    ExpandMoreIcon,
    KeyboardBackspaceOutlinedIcon,
    RemoveCircleOutlineOutlinedIcon,
    ShareOutlinedIcon,
    EditIcon,
    NotActivatedIcon, 
    ContentCopyIcon,
    DeleteIcon,
    AccountTreeOutlinedIcon,
    Person4Icon
} from "../lib/GlobalIcons"
import {
    Accordion, AccordionDetails, AccordionSummary,
    Button,
    Grid,
    styled,
    Typography,
    useMediaQuery,
    Link,
    axios,
    moment,
    DOMPurify,
    theme,
    IconButton,
    DialogTitle,
    DialogContent,
    DialogActions,
    toast,
    InputAdornment,
    TextField
} from "../lib/GlobalImports";
import {
    NameBox,
    BackToCarsButton,
    CarWallPaperImage,
    CarGalleryImage,
    CarDetailGridItem,
    CarDetailsTitle,
    CarDetailValue,
    MyAccordionImage,
    MyAccordion,
    CAR_DETAiL_SPACING,
    CarDialog,
    CarDialogText,
    MyTextField,
    CarCardMedia,
    GalleryImage
} from "../lib/StyledComponents"
import {
    MyFullWidthInputSkeleton,
    MyInputSkeleton,
    MyTextSkeleton,
    MyWallpaperSkeleton
} from "../lib/Skeletons";
import useAuth from "../hooks/useAuth";
import Roles from "../lib/Roles";
import { textAlign } from "@mui/system";
import ImageViewer from "../components/ImageViewer.component";

const SubTitle = styled(Typography)(({ theme }) => ({
    ...theme.typography.link,
    marginBottom: "2rem",
    fontWeight: 800
}))

function SharedVehiclePreview({ routes, activePage, handleChangeTab }) {
    const { auth } = useAuth();
    const { id } = useParams();
    const underMD = useMediaQuery(theme.breakpoints.down("md"));
    const underS = useMediaQuery(theme.breakpoints.down("sm"));

    const [isLoading, setIsLoading] = useState(true);
    const [isOpenImageView, setIsOpenImageView] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [vehicle, setVehicle] = useState({});
    const [expanded, setExpanded] = useState(false);

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleOpenImage = (index) => {
        setIsOpenImageView(true);
        setCurrentIndex(index);
    }

    /* data request methods */
    const getVehicle = async (token) => {
        await axiosInstance.get(`getPublicVehicle/${id}`)
            .then(response => {
                const data = response.data;
                const vehicle = JSON.parse(JSON.stringify(data.data.vehicle))
                vehicle['serviceEntries'] = data.data.serviceEntries;
                // Syncronize state values
                setVehicle(vehicle);
                setIsLoading(false)
            })
            .catch(err => {
                if (err.response.status == 404) {
                    window.location.href = "/"
                }
            })
    }


    useEffect(() => {
        /* For Tabs */
        switch (auth.role) {
            case Roles.User:
                [...routes.USER].forEach(route => {
                    switch (window.location.pathname) {
                        case `${route.link}`:
                            if (activePage !== route.activeIndex) {
                                handleChangeTab(route.activeIndex)
                            }
                            break;
                        default:
                            break;
                    }

                    if (window.location.pathname.includes(route.link) && route.link !== "/") {
                        if (activePage !== route.activeIndex) {
                            handleChangeTab(route.activeIndex)
                        }
                    }
                })
                break;
            case Roles.Employee:
                [...routes.EMPLOYEE].forEach(route => {
                    switch (window.location.pathname) {
                        case `${route.link}`:
                            if (activePage !== route.activeIndex) {
                                handleChangeTab(route.activeIndex)
                            }
                            break;
                        default:
                            break;
                    }

                    if (window.location.pathname.includes(route.link) && route.link !== "/") {
                        if (activePage !== route.activeIndex) {
                            handleChangeTab(route.activeIndex)
                        }
                    }
                })
                break;
            case Roles.Owner:
                [...routes.OWNER].forEach(route => {
                    switch (window.location.pathname) {
                        case `${route.link}`:
                            if (activePage !== route.activeIndex) {
                                handleChangeTab(route.activeIndex)
                            }
                            break;
                        default:
                            break;
                    }

                    if (window.location.pathname.includes(route.link) && route.link !== "/") {
                        if (activePage !== route.activeIndex) {
                            handleChangeTab(route.activeIndex)
                        }
                    }
                })
                break;
            case Roles.Admin:
                [...routes.ADMIN].forEach(route => {
                    switch (window.location.pathname) {
                        case `${route.link}`:
                            if (activePage !== route.activeIndex) {
                                handleChangeTab(route.activeIndex)
                            }
                            break;
                        default:
                            break;
                    }

                    if (window.location.pathname.includes(route.link) && route.link !== "/") {
                        if (activePage !== route.activeIndex) {
                            handleChangeTab(route.activeIndex)
                        }
                    }
                })
                break;
        }

        if (!id) {
            window.location.href = "/";
        }

        getVehicle(localStorage.getItem("token"));
    }, []);

    if (isLoading) {
        return (<React.Fragment>
            <BackToCarsButton startIcon={<KeyboardBackspaceOutlinedIcon />} component={Link} to="/jarmuveim">
                <SubTitle variant='h3' sx={{ marginBottom: "0", marginLeft: "1em" }}>J??rm??veim</SubTitle>
            </BackToCarsButton>

            <NameBox>
                <MyTextSkeleton />
                <MyTextSkeleton />
            </NameBox>

            <Grid container direction="column" alignItems="flex-start">
                { /* Car Image Gallery */}
                <Grid item >
                    <Grid container direction={"column"} spacing={CAR_DETAiL_SPACING}>
                        <Grid item xs={7}>
                            <Grid container direction="column" alignItems="flex-start" justifyContent="center">
                                <Grid item>
                                    <MyWallpaperSkeleton />

                                    <Grid container direction="row" spacing={0.4}>
                                        <MyInputSkeleton />
                                        <MyInputSkeleton />
                                        <MyInputSkeleton />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Car Details */}
                        <Grid item xs={5}>
                            <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start">

                                { /* car detail */}
                                <CarDetailGridItem item>
                                    <CarDetailsTitle>??ltal??nos Adatok</CarDetailsTitle>

                                    <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start" sx={{ paddingLeft: "2.5em" }}>
                                        <Grid item>
                                            <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                                <Grid item>
                                                    <Typography><MyInputSkeleton /></Typography>
                                                </Grid>
                                                <Grid item>
                                                    <CarDetailValue><MyInputSkeleton /></CarDetailValue>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item>
                                            <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                                <Grid item>
                                                    <Typography><MyInputSkeleton /></Typography>
                                                </Grid>
                                                <Grid item>
                                                    <CarDetailValue><MyInputSkeleton /></CarDetailValue>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </CarDetailGridItem>
                                { /* end of car detail */}

                                { /* car detail */}
                                <CarDetailGridItem item>
                                    <CarDetailsTitle>J??rm?? adatok</CarDetailsTitle>

                                    <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start" sx={{ paddingLeft: "2.5em" }}>
                                        <Grid item>
                                            <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                                <Grid item>
                                                    <Typography><MyInputSkeleton /></Typography>
                                                </Grid>
                                                <Grid item>
                                                    <CarDetailValue><MyInputSkeleton /></CarDetailValue>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item>
                                            <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                                <Grid item>
                                                    <Typography><MyInputSkeleton /></Typography>
                                                </Grid>
                                                <Grid item>
                                                    <CarDetailValue><MyInputSkeleton /></CarDetailValue>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item>
                                            <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                                <Grid item>
                                                    <Typography><MyInputSkeleton /></Typography>
                                                </Grid>
                                                <Grid item>
                                                    <CarDetailValue><MyInputSkeleton /></CarDetailValue>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </CarDetailGridItem>
                                { /* end of car detail */}

                                { /* car detail */}
                                <CarDetailGridItem item>
                                    <CarDetailsTitle>Motor adatok</CarDetailsTitle>

                                    <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start" sx={{ paddingLeft: "2.5em" }}>
                                        <Grid item>
                                            <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                                <Grid item>
                                                    <Typography><MyInputSkeleton /></Typography>
                                                </Grid>
                                                <Grid item>
                                                    <CarDetailValue><MyInputSkeleton /></CarDetailValue>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item>
                                            <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                                <Grid item>
                                                    <Typography><MyInputSkeleton /></Typography>
                                                </Grid>
                                                <Grid item>
                                                    <CarDetailValue><MyInputSkeleton /></CarDetailValue>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item>
                                            <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                                <Grid item>
                                                    <Typography><MyInputSkeleton /></Typography>
                                                </Grid>
                                                <Grid item>
                                                    <CarDetailValue><MyInputSkeleton /></CarDetailValue>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item>
                                            <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                                <Grid item>
                                                    <Typography><MyInputSkeleton /></Typography>
                                                </Grid>
                                                <Grid item>
                                                    <CarDetailValue><MyInputSkeleton /></CarDetailValue>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item>
                                            <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                                <Grid item>
                                                    <Typography><MyInputSkeleton /></Typography>
                                                </Grid>
                                                <Grid item>
                                                    <CarDetailValue><MyInputSkeleton /></CarDetailValue>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </CarDetailGridItem>
                                { /* end of car detail */}

                                { /* car detail */}
                                <CarDetailGridItem item>
                                    <CarDetailsTitle>Okm??nyok</CarDetailsTitle>

                                    <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start" sx={{ paddingLeft: "2.5em" }}>
                                        <Grid item>
                                            <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                                <Grid item>
                                                    <Typography><MyInputSkeleton /></Typography>
                                                </Grid>
                                                <Grid item>
                                                    <CarDetailValue><MyInputSkeleton /></CarDetailValue>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item>
                                            <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                                <Grid item>
                                                    <Typography><MyInputSkeleton /></Typography>
                                                </Grid>
                                                <Grid item>
                                                    <CarDetailValue><MyInputSkeleton /></CarDetailValue>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </CarDetailGridItem>
                                { /* end of car detail */}

                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                { /* Service information(s) */}
                <Grid item sx={{ width: "100%" }}>
                    <NameBox> <Typography>Szerviz El????let</Typography> </NameBox>
                    <Grid container direction="column">
                        <MyFullWidthInputSkeleton />
                        <MyFullWidthInputSkeleton />
                        <MyFullWidthInputSkeleton />
                        <MyFullWidthInputSkeleton />
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>)
    }

    return (<React.Fragment>
        <NameBox>
            <Typography variant="h3" sx={{ fontWeight: 900 }}>{vehicle.manufacture + " " + vehicle.model}</Typography>
            <Typography variant="h4" sx={{ color: "rgba(17, 17, 17, 0.74)", fontWeight: 900 }}>{vehicle.vin}</Typography>
        </NameBox>

        <Grid container direction="column" alignItems="center">
            { /* Car Image Gallery */}
            <Grid item >
                <Grid container direction={underMD ? "column" : "row"} spacing={CAR_DETAiL_SPACING}>
                    <Grid item xs={7}>
                        <Grid container direction="column" alignItems="flex-start" justifyContent="center">
                            <Grid item>
                                <CarWallPaperImage onClick={e=>handleOpenImage(0)} src={
                                    vehicle['pictures'][0]
                                } alt={vehicle.manufacture + " " + vehicle.model} />

                                <Grid container direction="row" spacing={0.4}>
                                    {
                                        Array.from(vehicle['pictures']).slice(1, vehicle['pictures'].length).map((image, i) => {
                                            return <Grid item key={image + "" + i}><CarGalleryImage onClick={e=>handleOpenImage(i)} src={"/" + image} /></Grid>
                                        })
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Car Details */}
                    <Grid item xs={5}>
                        <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start">

                            { /* car detail */}
                            <CarDetailGridItem item>
                                <CarDetailsTitle>??ltal??nos Adatok</CarDetailsTitle>

                                <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start" sx={{ paddingLeft: "2.5em" }}>
                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>??vj??rat: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>{moment(vehicle.vintage).format("YYYY")}</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    {
                                        vehicle?.licenseNumber
                                        &&
                                        <Grid item>
                                            <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                                <Grid item>
                                                    <Typography>Rendsz??m: </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <CarDetailValue>{vehicle.licenseNumber}</CarDetailValue>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    }

                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Kivitel: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>{vehicle.designType}</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </CarDetailGridItem>
                            { /* end of car detail */}

                            { /* car detail */}
                            <CarDetailGridItem item>
                                <CarDetailsTitle>J??rm?? adatok</CarDetailsTitle>

                                <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start" sx={{ paddingLeft: "2.5em" }}>
                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Km. ??ra ??ll??s: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>{vehicle.mileage} km</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Saj??t t??meg: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>{vehicle.ownMass} kg</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Teljes t??meg: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>{vehicle.fullMass} kg</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </CarDetailGridItem>
                            { /* end of car detail */}

                            { /* car detail */}
                            <CarDetailGridItem item>
                                <CarDetailsTitle>Motor adatok</CarDetailsTitle>

                                <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start" sx={{ paddingLeft: "2.5em" }}>
                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>??zemanyag: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>{vehicle.fuel}</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Henger??rtartalom: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>{vehicle.cylinderCapacity} cm<sup>3</sup></CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Teljes??tm??ny: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>{vehicle.performanceKW} kW, {vehicle.performanceLE} LE</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Hajt??s: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>{vehicle.driveType}</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Sebess??gv??lt??: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>{vehicle.transmission}</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </CarDetailGridItem>
                            { /* end of car detail */}

                            { /* car detail */}
                            <CarDetailGridItem item>
                                <CarDetailsTitle>Okm??nyok</CarDetailsTitle>

                                <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start" sx={{ paddingLeft: "2.5em" }}>
                                    <Grid item>
                                        <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                            <Grid item>
                                                <Typography>Okm??nyok jellege: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <CarDetailValue>{vehicle.nod}</CarDetailValue>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    {
                                        vehicle?.mot
                                        &&
                                        <Grid item>
                                            <Grid container direction="row" spacing={CAR_DETAiL_SPACING}>
                                                <Grid item>
                                                    <Typography>M??szaki vizsga ??rv??nyess??ge: </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <CarDetailValue>{moment(vehicle.mot).format("YYYY-MM-DD")}</CarDetailValue>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    }

                                </Grid>
                            </CarDetailGridItem>
                            { /* end of car detail */}

                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            { /* Service information(s) */}
            <Grid item sx={{ width: "100%" }}>
                <NameBox> <SubTitle variant="h4" sx={{ marginBottom: "0" }}>Szerviz El????let</SubTitle> </NameBox>
                {vehicle.serviceEntries && <Grid container direction="column">
                    {
                        Array.from(vehicle.serviceEntries).map((service, i) => {
                            let panel = `panel${i}`
                            return <MyAccordion key={service + "" + i} expanded={expanded === panel} onChange={handleAccordionChange(panel)} TransitionProps={{ unmountOnExit: true }} >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    <SubTitle variant="h4" sx={{ width: '33%', flexShrink: 0 }}>
                                        #{i + 1} Szerviz Bejegyz??s
                                    </SubTitle>
                                    {!underMD && <Typography sx={{ color: 'text.secondary' }}>{service.mileage} km</Typography>}
                                </AccordionSummary>
                                <AccordionDetails>

                                    <SubTitle variant="h4">M??hely Adatok:</SubTitle>

                                    {
                                        underS
                                            ?
                                            <>
                                                <Typography variant="body1" >Bejegyz??st ki??ll??t?? m??hely: <strong>{service.workshop}</strong></Typography>
                                                <Typography variant="body1" >Bejegyz??st ki??ll??t?? szerel??: <strong>{service.mechanicer}</strong></Typography>
                                            </>
                                            :
                                            <dl>
                                                <dd>
                                                    <Typography variant="body1" >Bejegyz??st ki??ll??t?? m??hely: <strong>{service.workshop}</strong></Typography>
                                                    <Typography variant="body1" >Bejegyz??st ki??ll??t?? szerel??: <strong>{service.mechanicer}</strong></Typography>
                                                </dd>
                                            </dl>
                                    }

                                    <SubTitle variant="h4" sx={{ margin: "1rem 0" }}>Bejegyz??s</SubTitle>

                                    {
                                        underS
                                            ?
                                            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service.description) }}>
                                            </Typography>
                                            :
                                            <dl>
                                                <dd>
                                                    <Typography variant="body1" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service.description) }}>
                                                    </Typography>
                                                </dd>
                                            </dl>
                                    }

                                    {
                                        service.pictures && <>
                                            <SubTitle variant="h4">Csatolm??nyok</SubTitle>

                                            <div>
                                                {
                                                    service.pictures.map((image, i) => <MyAccordionImage key={image + "" + i} src={`${image}`} alt={`${service.id}`} />)
                                                }
                                            </div>
                                        </>
                                    }
                                </AccordionDetails>
                            </MyAccordion>
                        })
                    }
                </Grid>}
            </Grid>
        </Grid>

        { isOpenImageView && <ImageViewer 
            isURL={true}
            images={ [...vehicle['pictures']] }
            index={currentIndex}
            open={isOpenImageView}
            onClose={e=>setIsOpenImageView(false)}
        /> }
    </React.Fragment>)
}

export default SharedVehiclePreview;