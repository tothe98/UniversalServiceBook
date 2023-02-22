import { AccordionDetails, AccordionSummary, Typography, useMediaQuery } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import moment from "moment";
import { useEffect, useState } from "react";
import { ExpandMoreIcon } from "../lib/GlobalIcons";
import { MyAccordion, MyAccordionImage, SubTitle } from "../lib/StyledComponents";
import theme from "../themes/theme";
import ImageViewer from "./ImageViewer.component";

function DynamicAccord({ service, panel, serialNumber }) {
    const underMD = useMediaQuery(theme.breakpoints.down("md"));
    const underS = useMediaQuery(theme.breakpoints.down("sm"));

    const [expanded, setExpanded] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpenImageView, setIsOpenImageView] = useState(false);

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleOpenImage = (index) => {
        setIsOpenImageView(true);
        setCurrentIndex(index);
    }

    return <>
        <MyAccordion key={service + "" + serialNumber} expanded={expanded === panel} onChange={handleAccordionChange(panel)} TransitionProps={{ unmountOnExit: true }} >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
            >
                <SubTitle variant="h4" sx={{ width: '33%', flexShrink: 0 }}>
                    #{serialNumber + 1} Szerviz Bejegyzés
                </SubTitle>
                {!underMD && <Typography sx={{ color: 'text.secondary' }}>{service.mileage} km</Typography>}
            </AccordionSummary>
            <AccordionDetails>

                <SubTitle variant="h4">Szerviz adatok:</SubTitle>

                {
                    underS
                        ?
                        <>
                            <Typography variant="body1" >Bejegyzést kiállításának időpontja: <strong>{moment(service.date).format("YYYY.MM.DD HH:mm")}</strong></Typography>
                        </>
                        :
                        <dl>
                            <dd>
                                <Typography variant="body1" >Bejegyzést kiállításának időpontja: <strong>{moment(service.date).format("YYYY.MM.DD HH:mm")}</strong></Typography>
                            </dd>
                        </dl>
                }

                <SubTitle variant="h4">Műhely Adatok:</SubTitle>

                {
                    underS
                        ?
                        <>
                            <Typography variant="body1" >Bejegyzést kiállító műhely: <strong>{service.workshop}</strong></Typography>
                            <Typography variant="body1" >Bejegyzést kiállító szerelő: <strong>{service.mechanicer}</strong></Typography>
                        </>
                        :
                        <dl>
                            <dd>
                                <Typography variant="body1" >Bejegyzést kiállító műhely: <strong>{service.workshop}</strong></Typography>
                                <Typography variant="body1" >Bejegyzést kiállító szerelő: <strong>{service.mechanicer}</strong></Typography>
                            </dd>
                        </dl>
                }

                <SubTitle variant="h4" sx={{ margin: "1rem 0" }}>Bejegyzés</SubTitle>

                {
                    underS
                        ?
                        <Typography variant="body1" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service.description) }}>
                        </Typography>
                        :
                        <dl>
                            <dd>
                                <Typography variant="body1" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service.description) }}>
                                </Typography>
                            </dd>
                        </dl>
                }

                {
                    service.pictures && <>
                        <SubTitle variant="h4">Csatolmányok</SubTitle>

                        <div>
                            {
                                service.pictures.map((image, i) => <MyAccordionImage onClick={e=>handleOpenImage(i)} key={image + "" + i} src={`${image}`} alt={`${service.id}`} />)
                            }
                        </div>
                    </>
                }
            </AccordionDetails>
        </MyAccordion>

        { isOpenImageView && <ImageViewer 
            isURL={true} 
            images={[...service.pictures]}
            index={currentIndex}
            open={isOpenImageView}
            onClose={e => setIsOpenImageView(false)}
            />
        }
    </>
}

export default DynamicAccord;