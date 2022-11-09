import React, {useState} from "react";
import {Button, styled, Typography, useMediaQuery} from "@mui/material";
import {Link} from "react-router-dom";
import theme from "../themes/theme";
import { v4 as uuidv4 } from 'uuid';

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

function Garage() {
    const underMD = useMediaQuery(theme.breakpoints.down("md"));
    const underS = useMediaQuery(theme.breakpoints.down("sm"));
    const [cars, setCars] = useState([]);

    return (<React.Fragment>
        <SubTitle variant='h3'>Garázs</SubTitle>
        <SubTitle variant='h4' component={Link} to="/">Vissza a főoldalra!</SubTitle>
    </React.Fragment>)
}

export default Garage;