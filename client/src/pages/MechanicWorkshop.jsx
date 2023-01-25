import React, {useEffect, useRef, useState} from "react";
import useAuth from "../hooks/useAuth";
import {
    Avatar,
    Button,
    Card, CardActionArea,
    CardContent,
    CardHeader, Divider,
    FormControl,
    Grid,
    IconButton,
    styled,
    TextField,
    Typography,
    toast,
    axios,
    moment
} from "../lib/GlobalImports";
import {
    AddCircleOutlineOutlinedIcon,
    SearchOutlinedIcon,
    DateIcon,
    KmIcon,
    RemoveCircleOutlineOutlinedIcon,
    DocumentsIcon
} from "../lib/GlobalIcons"
import {
    MyCardSkeleton,
    MyInputSkeleton,
    MyTextSkeleton
} from "../lib/Skeletons";
import {
    axiosInstance
} from "../lib/GlobalConfigs"
import {
    ContentBox,
    GalleryImage,
    SubTitle,
    SubTitle2,
    MyTextField,
    MyCardHeader
} from "../lib/StyledComponents"
import {Editor} from "@tinymce/tinymce-react";

const UploadButton = styled(Button)(({theme}) => ({
    margin: "2rem 0"
}))

function MechanicWorkshop({handleChangeTab}) {
    /* authentication context */
    const { auth } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [isSent, setIsSent] = useState(false);
    const [isFinded, setIsFinded] = useState(false);
    const [findedVehicle, setFindedVehicle] = useState({});
    const [findedVehicleServiceEntriesCount, setFindedVehicleServiceEntriesCount] = useState(0);
    const [vehicleVin, setVehicleVin] = useState("");

    /* new service message datas */
    const [isAttachmentLoading, setAttachmentLoading] = useState(false);
    const [mileage, setMileage] = useState(0);
    const [attachments, setAttachments] = useState([]);
    const [newServiceDate, setNewServiceDate] = useState(moment().format("YYYY-MM-DD"));
    const serviceMessageHTML = useRef(null);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const handleSearchVehicle = async (e) => {
        setIsFinded(false)
        setFindedVehicle({})

        if (!vehicleVin) {
            toast.error("Az alvázszám mező űres!");
            return;
        }

        if (vehicleVin.length > parseInt(process.env.REACT_APP_MAXIMUM_VIN_LENGTH)) {
            toast.error("Az alvázszám nem lehet hosszabb mint "+process.env.REACT_APP_MAXIMUM_VIN_LENGTH+" karakter.")
            setVehicleVin("")
            return;
        }

        const response = await axiosInstance.get(`getVehicleByVin/${vehicleVin}`,
            {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            });
        /* We have to write the date to data  */
        const data = await response.data;
        const vehicle = await data.data.vehicle;
        const serviceEntriesCount = await data.data.serviceEntriesCount;
        setFindedVehicle(vehicle);
        setFindedVehicleServiceEntriesCount(serviceEntriesCount);
        
        if (!findedVehicle) {
            toast.error("Nem található jármű ezzel az alvázszámmal!")
            return;
        }

        setIsFinded(true);
    }

    const handleNewServiceMessage = () => {
        setIsSent(true);
        setTimeout(() => {
            setIsSent(false);
        }, Number(process.env.REACT_APP_BUTTON_CLICK_TIMEOUT));
        /* it is a plain html text */
        let textEditorContent = serviceMessageHTML.current.getContent();

        console.log(mileage, textEditorContent, newServiceDate.toString(), findedVehicle['id'])

        const formData = new FormData();

        for (let i = 0; i < attachments.length; i++) {
            formData.append("pictures", attachments[i]['file']);
        }

        formData.append("mileage", mileage);
        formData.append("description", textEditorContent);
        formData.append("date", moment(newServiceDate).format("YYYY-MM-DD HH:mm"));
        formData.append("vehicleID", findedVehicle.id)

        const headers = {
            'Content-Type': 'multipart/form-data',
            'x-access-token': localStorage.getItem("token")
        }
        axiosInstance.post('/addServiceEntry', formData, { headers } )
            .then((res) => {
                toast.success("Sikeresen feltöttél egy új szerviz bejegyzést!")
            })
            .catch((err) => {
                console.log(err.response)

                if (err.response.status == 409) {
                    // mileage is less then the before one
                } else if (err.response.status == 422) {
                    toast.error("Hoops! Valamit nem töltöttél ki!")
                } else if (err.response.status == 400) {
                    toast.error("Hoop! Több fájlt töltöttél ki!")
                }
            });
    }

    const handleNewAttachmentUpload = async (e) => {
        setAttachmentLoading(true);
        const attachments = [];

        for (const file of e.target.files) {
            const base64 = await convertBase64(file);

            attachments.push({
                file: file,
                base64: base64,
                deleted: false
            })
        }

        setAttachments(attachments);
        setAttachmentLoading(false);
    }

    /* id = base64 */
    const handleNewAttachmentDelete = (e, id) => {
        setAttachmentLoading(true);
        const newAttachments = [...attachments];

        for (let index = 0; index < newAttachments.length; index++) {
            const element = newAttachments[index];
            if (element.base64 == id) {
                element.deleted = true;
            }
        }

        setAttachments(newAttachments);
        setAttachmentLoading(false);
    }

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }

    if (isLoading) {
        return <>
            <SubTitle variant='h3'>Jármű kiválasztása</SubTitle>
            <MyTextSkeleton />


            <Grid container direction="column" alignItems="flex-start" justifyContent="center" sx={{marginBottom: "1.5rem"}}>
                <Grid item sx={{width: "100%"}}>
                    <MyTextSkeleton />
                    <MyInputSkeleton />

                    <SubTitle2 variant='h3'>Új szervízbejegyzés hozzáadása!</SubTitle2>
                    <MyCardSkeleton />
                </Grid>
                <Grid item>
                    <MyInputSkeleton />
                </Grid>
            </Grid>
        </>
    }

    return <>
        <SubTitle variant='h3'>Jármű kiválasztása</SubTitle>

        <Grid container direction="column" alignItems="flex-start" justifyContent="center" sx={{marginBottom: "1.5rem"}}>
            <Grid item sx={{width: "100%"}}>
                <MyTextField
                    fullWidth
                    id="outlined-disabled"
                    label="Alvázszám"
                    type="text"
                    value={vehicleVin}
                    onChange={e=>setVehicleVin(e.target.value)}
                />
            </Grid>
            <Grid item>
                <Button variant="contained" color="warning" startIcon={<SearchOutlinedIcon />} onClick={e=>handleSearchVehicle(e)}>
                    Keresés
                </Button>
            </Grid>
        </Grid>

        {
            isFinded && <React.Fragment>
                <Card variant="outlined">
                    <CardActionArea>
                        <MyCardHeader
                            title={`${findedVehicle.manufacture} ${findedVehicle.model}`}
                            subheader={findedVehicle.vin}
                        />

                        <CardContent>
                            <Typography variant="h4">Tulajdonos: <a href={"#"}>{findedVehicle.fullName}</a></Typography>
                            <Typography variant="h4">Bejegyzett szervízek: { findedVehicleServiceEntriesCount }</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>

                <SubTitle2 variant='h3'>Új szervízbejegyzés hozzáadása!</SubTitle2>

                <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                    <Grid item xs={1}>
                        <Typography align="center">
                            <DateIcon />
                        </Typography>
                    </Grid>

                    <Grid item xs={11}>
                        <MyTextField
                            fullWidth
                            id="outlined"
                            value={newServiceDate}
                            default={newServiceDate}
                            type="date"
                            onChange={e=>{
                                let input = new Date(e.target.value);
                                setNewServiceDate(input)
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                    <Grid item xs={1}>
                        <Typography align="center">
                            <KmIcon />
                        </Typography>
                    </Grid>

                    <Grid item xs={11}>
                        <MyTextField
                            fullWidth
                            id="outlined-disabled"
                            label="Km. óra állás"
                            type="number"
                            onChange={e=>{
                                let kmInput = parseInt(e.target.value+"")

                                if (kmInput < 0)
                                {
                                    toast.error("Ez a mező nem lehet kisebb mint 0!");
                                    return;
                                }
                                else if (kmInput >= parseInt(process.env.REACT_APP_MAXIMUM_KM))
                                {
                                    toast.error("Ez a mező nem lehet nagyobb mint ${process.env.REACT_APP_MAXIMUM_KM} km!");
                                    return;
                                }
                                setMileage(kmInput);
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container direction="row" spacing={0} wrap="nowrap" alignItems="center" justifyContent="center">
                    <Grid item xs={1}>
                        <Typography align="center">
                            <DocumentsIcon />
                        </Typography>
                    </Grid>

                    <Grid item xs={11}>
                        <MyTextField
                            fullWidth
                            id="outlined-disabled"
                            default={2010}
                            type="file"
                            multiple={true}
                            onChange={e=>handleNewAttachmentUpload(e)}
                        />
                    </Grid>
                </Grid>

                <Grid container
                    direction="row"
                    wrap="wrap"
                    justifyContent="center"
                    gap={2}
                >
                    {
                        !isAttachmentLoading && Array.from(attachments).map((obj, i) => {
                            return !obj.deleted && <Grid item key={obj+""+i}>
                                <Grid container direction="column" gap={2} justifyContent="center" alignItems="center">
                                    <Grid item>
                                        <GalleryImage
                                            src={obj.base64}
                                            loading="lazy"
                                        />
                                    </Grid>

                                    <Grid item>
                                        <IconButton onClick={e=>handleNewAttachmentDelete(e, obj.base64)}>
                                            <RemoveCircleOutlineOutlinedIcon color="error" />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        })}
                </Grid>

                <Editor
                    apiKey="jdakkbjup13h3wxbimqnu4sii9msv6jim9sx9y7qfzk43spo"
                    onInit={ (evt, editor) => serviceMessageHTML.current = editor }
                    init={{
                        menubar: false
                    }}
                />

                {
                    isSent
                    ?
                    <UploadButton variant="contained" color="success" startIcon={<AddCircleOutlineOutlinedIcon />} disabled>
                        Feltöltés
                    </UploadButton>
                    :
                    <UploadButton variant="contained" color="success" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={e=>handleNewServiceMessage(e)}>
                        Feltöltés
                    </UploadButton>
                }

            </React.Fragment>
        }
    </>
}

export default MechanicWorkshop;