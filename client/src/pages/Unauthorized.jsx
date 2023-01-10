import styled from '@emotion/styled';
import { Button, Typography } from '@mui/material';
import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';

const SubTitle = styled(Typography)(({theme}) => ({
    ...theme.typography.link,
    marginBottom: "2rem"
}))

const Unauthorized = () => {
    const navigate = useNavigate();
    const goBack = navigate(-1);

    return (
        <>
            <SubTitle variant='h3'>Kérés megtagadva!</SubTitle>
            <Button variant='contained' onClick={goBack}>Vissza!</Button>
        </>
    );
}

export default Unauthorized;