import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {
    CircularProgress,
    Grid,
    styled,
    Typography,
    axios
} from "../lib/GlobalImports";
import {
    SuccessIcon,
    NotActivatedIcon
} from "../lib/GlobalIcons";
import {
    axiosInstance
} from "../lib/GlobalConfigs";

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
    * 3 => error (token expired)
    * */
    const [verificationStatus, setVerificationStatus] = useState(0);
    const { userid, token } = useParams();

    useEffect(() => {
        axiosInstance.post(`/emailConfirmation/`, {
            userid: userid,
            token: token
        })
        .then(response => {
            setVerificationStatus(1);
        })
        .catch(error => {
            if (error.response.status == 409) {
                setVerificationStatus(3);
            } else if (error.response.status == 400) {
                setVerificationStatus(2);
            }
            setVerificationStatus(2);
        })
    }, []);

    return <>
        <Grid container direction="column" justifyContent="center" alignItems="center" gap={2.5}>
            <Grid item>
                { verificationStatus === 0 && <CircularProgress /> }
                { verificationStatus === 1 && <VerificationEmailIcon src={SuccessIcon} alt="Fiók aktiválva" /> }
                { verificationStatus === 2 && <VerificationEmailIcon src={NotActivatedIcon} alt="Fiók nincs aktiválási hiba!" /> }
                { verificationStatus === 3 && <VerificationEmailIcon src={NotActivatedIcon} alt="Fiók nincs aktiválva, lejárt a token!" /> }
            </Grid>
            <Grid item>
                <Typography variant="h3">Fiók Aktiválás</Typography>
            </Grid>
            <Grid item>
                {
                    verificationStatus == 1 && <Typography variant="h4" color="success">Aktiválva!</Typography>
                }
                {
                    verificationStatus == 2 && <Typography variant="h4" color="success">Aktiválás sikertelen (hibás eljárás)!</Typography>
                }
                {
                    verificationStatus == 3 && <Typography variant="h4" color="success">Aktiválás sikertelen (lejárt token)!</Typography>
                }
            </Grid>
        </Grid>

    </>
}

export default EmailVerification;