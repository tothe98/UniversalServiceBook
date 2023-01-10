import React, {Component, useEffect, useState} from 'react';
import {styled, Typography} from "@mui/material";

const SubTitle = styled(Typography)(({theme}) => ({
    ...theme.typography.link,
    marginBottom: "2rem"
}))

function OwnerPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, [])

    return (<React.Fragment>
        <SubTitle variant='h3'>Műhely kezelés</SubTitle>

        { /*TODO: Műhely kezelési felület ha owner vagyok (employee crud) */ }

    </React.Fragment>)
}

export default OwnerPage;