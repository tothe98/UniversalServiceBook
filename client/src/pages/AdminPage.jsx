import React, {Component, useEffect, useState} from 'react';
import {styled, Typography} from "@mui/material";

const SubTitle = styled(Typography)(({theme}) => ({
    ...theme.typography.link,
    marginBottom: "2rem"
}))

function AdminPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, [])

    return (<React.Fragment>
        <SubTitle variant='h3'>Userek kezelése</SubTitle>

        { /*TODO: felhasználók kezelése, műhely tulajdonosok hozzáadása, ha admin vagyok */ }

        {/*

        LAST TIME =  I started doing the admin page, I would like to
                    do a vehicle change part where I can choose a vehicle
                    and afterwards I can update, delete it and so on.

        */}

    </React.Fragment>)
}

export default AdminPage;