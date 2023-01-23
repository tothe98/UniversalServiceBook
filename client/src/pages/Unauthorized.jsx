import styled from '@emotion/styled';
import {
    Button,
    Typography
} from '../lib/GlobalImports';
import {
    SubTitle
} from '../lib/StyledComponents';
import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';

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