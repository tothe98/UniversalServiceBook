import React, { Component } from 'react';
import moment from 'moment';
import {
    Chip, 
    Grid,
    Typography,
    useMediaQuery,
    theme,
    Link
} from '../lib/GlobalImports.js'
import {
    SubTitle,
    ContentBox,
    ContentBoxImage,
    ViewButton,
    CarCard,
    CarCardHeader,
    CarCardMedia,
    CarCardContent,
    CarCardActions,
    CarOptionsMenu,
    CarDialog,
    MenuText,
    CarDialogText
} from '../lib/StyledComponents'

function VehicleCard({ vehicle, i, handleChangeTab }) {
    const underMD = useMediaQuery(theme.breakpoints.down("md"));
    const underS = useMediaQuery(theme.breakpoints.down("sm"));

    return <ContentBox key={vehicle+i}>
                <Grid container direction="column">
                    <Grid item>
                        <CarCard>
                            <CarCardHeader
                                title={`${vehicle.manufacture} ${vehicle.model}`}
                            >
                            </CarCardHeader>

                            <Grid container direction={underMD ? "column" : "row"}
                                alignItems={underMD ? "center" : "flex-start"}
                                justifyContent={underMD && "center"}>
                                <Grid item>
                                    <CarCardMedia
                                        component="img"
                                        image={ vehicle?.preview ? vehicle['preview'] : vehicle['pictures'][0] }
                                        alt={`${vehicle.manufacture} ${vehicle.model}`}
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

                                            {
                                                vehicle?.serviceEntries
                                                &&
                                                <Grid container direction="row" spacing={2}>
                                                    <Grid item><Typography variant="h4">Bejegyzett
                                                        szervízek:</Typography></Grid>
                                                    <Grid item><Typography
                                                        variant="h4">{vehicle.serviceEntries.length}</Typography></Grid>
                                                </Grid>
                                            }
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
                                            to={`/jarmuveim/${vehicle['_id'] ? vehicle['_id'] : vehicle['id']}`} onClick={e => {
                                    handleChangeTab(1)
                                }}>Megtekintem</ViewButton>
                            </CarCardActions>
                        </CarCard>
                    </Grid>
                </Grid>
            </ContentBox>
}

export default VehicleCard;