import React, { Component } from 'react'
import {
    uuidv4,
    DOMPurify,
    Link,
    Typography,
    Grid,
    useMediaQuery,
    theme
} from '../lib/GlobalImports'
import {
    ContentBox,
    ContentBoxImage,
    ViewButton
} from '../lib/StyledComponents'
import {
    serviceInformationIcon
} from '../lib/GlobalIcons'

function InformationCard({ data, i, handleChangeTab }) {
    const underMD = useMediaQuery(theme.breakpoints.down("md"));
    const underS = useMediaQuery(theme.breakpoints.down("sm"));

    return <ContentBox key={uuidv4()}>
                <Grid container spacing={2} direction={underS ? "column" : "row"}  alignItems="center" 
                        justifyContent={ underS ? "center" : "flex-start" }>
                    <Grid item xs={1}>
                        <Grid container direction="column" justifyContent="center" alignItems="center">
                            <ContentBoxImage src={serviceInformationIcon} alt="Szervíz Információ" sx={{width: "4em", height: "4em"}} />
                            <Typography>{i + 1}</Typography>
                        </Grid>
                    </Grid>

                    <Grid item xs={10} sx={{maxWidth: "628px", height: "auto"}}>
                        <Grid container direction="column" justifyContent="center" sx={{ textAlign: underS ? "center" : "" }} >
                            <Typography variant="h4" xs>
                                Szervíz Információ
                            </Typography>
                        </Grid>
                        <Grid container direction="row" sx={{ textAlign: underS ? "center" : "" }} >
                            <Grid item><Typography variant="h5" sx={{textAlign: "justify", maxWidth: "500px"}} 
                                dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(data['text'])}} /></Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs sx={{position: underS ? "block" : "absolute", bottom: "2em", right: "2em"}}>
                        <ViewButton component={Link} to={`/jarmuveim/${data['vehicleId']}`} onClick={e=>{handleChangeTab(2)}}  >Megtekintem</ViewButton>
                    </Grid>
                </Grid>
            </ContentBox>
}

export default InformationCard;