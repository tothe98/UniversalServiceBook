import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {CircularProgress, Grid, styled, Typography} from "@mui/material";

import SuccessIcon from "../global/successIcon.png"
import NotActivatedIcon from "../global/notActivatedIcon.png"

const VerificationEmailIcon = styled("img")(({theme}) => ({
    maxWidth: "100px",
    maxHeight: "100px",
    height: "100%",
    width: "100%"
}))

function EmailVerification() {
    /*
    * Status values:
    * 0 => pending
    * 1 => success
    * 2 => error
    * */
    const [verificationStatus, setVerificationStatus] = useState(1);
    const { id } = useParams();

    // TODO: I have to send a request to the server

    return <>
        <Grid container direction="column" justifyContent="center" alignItems="center" gap={2.5}>
            <Grid item>
                { verificationStatus === 0 && <CircularProgress /> }
                { verificationStatus === 1 && <VerificationEmailIcon src={SuccessIcon} alt="Fiók aktiválva" /> }
                { verificationStatus === 2 && <VerificationEmailIcon src={NotActivatedIcon} alt="Fiók nincs aktiválva" /> }
            </Grid>
            <Grid item>
                <Typography variant="h3">Fiók Aktiválás</Typography>
            </Grid>
            <Grid item>
                {
                    verificationStatus == 1 && <Typography variant="h4" color="success">Aktiválva!</Typography>
                }
                {
                    verificationStatus == 2 && <Typography variant="h4" color="success">Aktiválás sikertelen!</Typography>
                }
            </Grid>
        </Grid>

    </>
}

export default EmailVerification;