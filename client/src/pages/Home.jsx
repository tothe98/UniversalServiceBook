import React, {Component, useEffect, useState} from 'react';
import {
    MyCardSkeleton, 
    MyTextSkeleton
} from "../lib/Skeletons";
import {
    serviceInformationIcon
} from "../lib/GlobalIcons"
import {
    DOMPurify,
    Link,
    uuidv4,
    theme,
    axios,
    moment,
    Alert,
    Box,
    Button,
    Card, CardActions, CardContent,
    CardHeader, CardMedia,
    Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider,
    Grid,
    IconButton, Menu, Snackbar,
    styled,
    Toolbar, Tooltip,
    Typography,
    useMediaQuery
} from '../lib/GlobalImports';
import {
    SubTitle
} from '../lib/StyledComponents'
import {
    axiosInstance
} from '../lib/GlobalConfigs'
import VehicleCard from '../components/VehicleCard.component';
import InformationCard from '../components/InformationCard.component';

function Home({handleChangeTab}) {
    /* loading screen variables */
    const [isLoading, setIsLoading] = useState(true);
    const underMD = useMediaQuery(theme.breakpoints.down("md"));
    const underS = useMediaQuery(theme.breakpoints.down("sm"));
    const [serviceInformations, setServiceInformations] = useState([]);
    const [lastActivityVehicles, setLastActivityVehicles] = useState([]);

    const getVehicleById = async (token, id) => {
        return new Promise((resolve, reject) => {
            /* Constrainst: id cannot be null, id have to be valid (format) */
            if (id)
            {
                // TODO: I have to tell to Erik to make an id checker
                axiosInstance.get(`/getVehicle/${id}`, { headers: { 'x-access-token': token } })
                    .then(res => {
                        const v = res.data.data.vehicle;
                        v['serviceEntries'] = res.data.data.serviceEntries;
                        resolve(v);
                    })
            }
        })
    }
    const getLastActivityVehicles = (token, vehicleIDs) => {
        setIsLoading(true);
        const promises = [];

        for (let i = 0; i < vehicleIDs.length; i++) {
            if (vehicleIDs[i] != null) {
                if (vehicleIDs[i].length == 24) {
                    /* TODO: When I add etc. kecske as an id it throws 500 error. */
                    promises.push(getVehicleById(token, vehicleIDs[i]));
                }
            }
        }

        Promise.all(promises)
            .then((results) => {
                const arr = [];
                results.forEach((result) => {
                    if (result != undefined) {
                        if (result != null) {
                            arr.push(result) 
                        }
                    }
                })
                setLastActivityVehicles(arr);
            })
            .catch((err) => {
                
            })
        setIsLoading(false);
    }

    useEffect(() => {
        const serviceInformations = [
            {
                id: "12a12e",
                chassisNumber: "AH22UBZVSDTAWD",
                message: `Figyelem az ön <b>Honda Accord</b> gépjárműve (alvz.szm: <b>JACUBS25DN7100010</b>) <b>2023.01.13</b>-án kötelező szervízen kell résztvennie!`
            },
            {
                id: "12a1asd2e",
                chassisNumber: "AH22UBZVSDTAWD",
                message: `Figyelem az ön <b>Renault Megane</b> gépjárműve (alvz.szm: <b>JACUBS25DN7100010</b>) a következő hónapban kötelező szervízen kell résztvennie!`
            },
            {
                id: "12acw12e",
                chassisNumber: "AH22UBZVSDTawdwdAWD",
                message: `Figyelem az ön <a>SEAT Alhambra</a> gépjárműve (alvz.szm: <b>JACUBS25DN7100010</b>) kötelező szervízen kell résztvennie! <mark>MA!</mark>`
            },
            {
                id: "12a12e",
                chassisNumber: "AHad22UBZVSDTAWD",
                message: `Figyelem az ön <b>Audi A7</b> gépjárművét (alvz.szm: <b>JACUBS25DN7100010</b>) sikeresen javítottuk!`
            },
            {
                id: "12a12e",
                chassisNumber: "AWDFH22UBZVSDTAWD",
                message: `Figyelem az ön <b>Honda Civic</b> gépjárműve (alvz.szm: <b>JACUBS25DN7100010</b>) megbukott a forgalmi teszten!`
            }
        ]

        if (localStorage.getItem("last_viewed")) {
            getLastActivityVehicles(localStorage.getItem("token"), 
                Array.from(JSON.parse(localStorage.getItem("last_viewed"))));
        }
        setServiceInformations(serviceInformations);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <>
                <div>
                    <MyTextSkeleton />
                    <MyCardSkeleton />
                </div>

                <div>
                    <MyTextSkeleton />
                    <MyCardSkeleton />
                </div>
            </>
        )
    }

    return (
        <>
            <SubTitle variant='h3'>Legutóbbi aktivításaim</SubTitle>

            {
                localStorage.getItem("last_viewed")
                ?
                    Array.from(JSON.parse(localStorage.getItem("last_viewed"))).length > 0
                    ?
                    <>
                        {
                            lastActivityVehicles
                                .map((vehicle, i) => {
                                    return <VehicleCard vehicle={vehicle} i={i} handleChangeTab={handleChangeTab} />
                                })
                        }
                    </>
                    :
                    <Typography variant="h4" sx={{ opacity: 0.7 }} >Nincs legutóbbi aktivításod!</Typography>
                :
                <Typography variant="h4" sx={{ opacity: 0.7 }} >Nincs legutóbbi aktivításod!</Typography>
            }

            <SubTitle variant='h3' sx={{marginTop: "2rem"}}>Szervíz Információk</SubTitle>

            {
                serviceInformations.map((info, i) => {
                    return <InformationCard info={info} i={i} handleChangeTab={handleChangeTab} />
                })
            }
        </>
    )
}

export default Home;