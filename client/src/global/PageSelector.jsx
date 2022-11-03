import { styled, Tab, Tabs } from '@mui/material';
import React from 'react';
import { useState } from 'react';

const MAX_HEIGHT = '108px';

const ContainerDiv = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.common.gray,
    maxHeight: MAX_HEIGHT,
    height: '100%'
}))

function PageSelector() {
    const [value, setValue] = useState(0);

    const handlePageChange = (e, newValue) => {
        setValue(newValue);
    }

    return <ContainerDiv>
        <Tabs value={value} onChange={handlePageChange}>
            <Tab label="Főoldal" />
            <Tab label="Garázs" />
            <Tab label="Leveleim" />
        </Tabs>
    </ContainerDiv>
}

export default PageSelector;