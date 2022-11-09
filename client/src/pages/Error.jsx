import React from "react";
import {styled, Typography} from "@mui/material";
import {Link} from "react-router-dom";

const SubTitle = styled(Typography)(({theme}) => ({
    ...theme.typography.link,
    marginBottom: "2rem"
}))

function Error() {
    return (<React.Fragment>
        <SubTitle variant='h3'>Hiba! Az oldal nem található!</SubTitle>
        <SubTitle variant='h4' component={Link} to="/">Vissza a főoldalra!</SubTitle>
    </React.Fragment>)
}

export default Error;