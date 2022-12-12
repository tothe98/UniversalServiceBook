import React from "react";
import {useParams} from "react-router-dom";
import {Grid, Typography} from "@mui/material";

function EmailVerification() {
    const { id } = useParams();

    return <>
        <Grid container direction="column" justifyContent="center" alignItems="center">
            <Grid item>
                <Typography variant="h3">Fiók Aktiválás</Typography>
            </Grid>
            <Grid item>
                <Typography variant="h4" color="success">Aktiválva!</Typography>
            </Grid>
        </Grid>

    </>
}

export default EmailVerification;