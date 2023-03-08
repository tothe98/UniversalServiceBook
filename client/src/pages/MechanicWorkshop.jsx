import React, { useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  IconButton,
  styled,
  TextField,
  Typography,
  toast,
  axios,
  moment,
  Tooltip,
} from "../lib/GlobalImports";
import {
  AddCircleOutlineOutlinedIcon,
  SearchOutlinedIcon,
  DateIcon,
  KmIcon,
  RemoveCircleOutlineOutlinedIcon,
  DocumentsIcon,
  WarningIcon,
} from "../lib/GlobalIcons";
import {
  MyCardSkeleton,
  MyInputSkeleton,
  MyTextSkeleton,
} from "../lib/Skeletons";
import { axiosInstance } from "../lib/GlobalConfigs";
import {
  ContentBox,
  GalleryImage,
  SubTitle,
  SubTitle2,
  MyTextField,
  MyCardHeader,
  WarningImage,
} from "../lib/StyledComponents";
import { Editor } from "@tinymce/tinymce-react";
import {
  Languages,
  MessageStatusCodes,
  getFieldMessage,
} from "../config/MessageHandler";
import ImageItem from "../components/ImageItem.component";
import ImageViewer from "../components/ImageViewer.component";
import {
  AllowedMimeTypes,
  getFileMimeType,
  isValidFileMimeType,
} from "../lib/FileUploader";

const UploadButton = styled(Button)(({ theme }) => ({
  margin: "2rem 0",
}));

function MechanicWorkshop({ handleChangeTab }) {
  /* authentication context */
  const { auth } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSent, setIsSent] = useState(false);
  const [isSearchSent, setIsSearchSent] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isVinError, setIsVinError] = useState(false);
  const [isFinded, setIsFinded] = useState(false);
  const [findedVehicle, setFindedVehicle] = useState({});
  const [
    findedVehicleServiceEntriesCount,
    setFindedVehicleServiceEntriesCount,
  ] = useState(0);
  const [vehicleVin, setVehicleVin] = useState("");

  /* new service message datas */
  const [isAttachmentLoading, setAttachmentLoading] = useState(false);
  const [mileage, setMileage] = useState(0);
  const [attachments, setAttachments] = useState([]);
  const [newServiceDate, setNewServiceDate] = useState(
    moment().format("YYYY-MM-DD HH:mm")
  );
  const serviceMessageHTML = useRef(null);

  /* image viewer */
  const [isOpenImageView, setIsOpenImageView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleSearchVehicle = async (e) => {
    if (vehicleVin.length === 0) {
      toast.error("Hiba! Az alvázszám mező nem lehet üres!");
      return;
    }

    setIsFinded(false);
    setFindedVehicle({});

    if (!vehicleVin) {
      toast.error(
        getFieldMessage(Languages.hu, "alvázszám", MessageStatusCodes.error)
      );
      return;
    }

    if (
      vehicleVin.length > parseInt(process.env.REACT_APP_MAXIMUM_VIN_LENGTH)
    ) {
      toast.error(
        "Az alvázszám nem lehet hosszabb mint " +
          process.env.REACT_APP_MAXIMUM_VIN_LENGTH +
          " karakter."
      );
      return;
    }

    await axiosInstance
      .get(`getVehicleByVin/${vehicleVin}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        const data = response.data;
        const vehicle = data.data.vehicle;
        const serviceEntriesCount = data.data.serviceEntriesCount;
        setFindedVehicle(vehicle);
        setMileage(vehicle["mileage"]);
        setFindedVehicleServiceEntriesCount(serviceEntriesCount);
        setIsFinded(true);
      })
      .catch((err) => {
        toast.error("Nem található jármű ezzel az alvázszámmal!");
        setIsFinded(false);
      });
  };

  const handleNewServiceMessage = () => {
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
    }, Number(process.env.REACT_APP_BUTTON_CLICK_TIMEOUT));
    /* it is a plain html text */
    let textEditorContent = serviceMessageHTML.current.getContent();

    const formData = new FormData();

    if (!findedVehicle) {
      toast.error("Nem található a szerkesztendő jármű!");
      return;
    }
    if (!mileage) {
      toast.error(
        getFieldMessage(Languages.hu, "kilométeróra", MessageStatusCodes.error)
      );
      return;
    }
    if (mileage < findedVehicle["mileage"]) {
      toast.error(`Hiba! Az új szervizbejegyzést nem sikerült feltölteni, 
        mivel ön kevesebb km-t adott meg mint, amit mi előzőleg rögzítettünk.`);
      return;
    }
    if (!textEditorContent) {
      toast.error(
        getFieldMessage(
          Languages.hu,
          "szerviz szöveg",
          MessageStatusCodes.error
        )
      );
      return;
    }
    if (!newServiceDate) {
      toast.error(
        getFieldMessage(Languages.hu, "szerviz dátum", MessageStatusCodes.error)
      );
      return;
    }

    for (let i = 0; i < attachments.length; i++) {
      formData.append("pictures", attachments[i]["file"]);
    }

    formData.append("mileage", mileage);
    formData.append("description", textEditorContent);
    formData.append("date", moment(newServiceDate).format("YYYY-MM-DD HH:mm"));
    formData.append("vehicleID", findedVehicle.id);

    const headers = {
      "Content-Type": "multipart/form-data",
      "x-access-token": localStorage.getItem("token"),
    };
    axiosInstance
      .post("/addServiceEntry", formData, { headers })
      .then((res) => {
        toast.success("Sikeresen feltöttél egy új szerviz bejegyzést!");
        setMileage(mileage);
        setNewServiceDate(moment().format("YYYY-MM-DD HH:mm"));
        setAttachments([]);
        serviceMessageHTML.current.setContent("");
      })
      .catch((err) => {
        if (err.response.status == 409) {
          // mileage is less then the before one
        } else if (err.response.status == 422) {
          toast.error("Hoops! Valamit nem töltöttél ki!");
        } else if (err.response.status == 400) {
          toast.error("Hoop! Több fájlt töltöttél ki!");
        }
      });
  };

  const handleNewAttachmentUpload = async (e) => {
    const isValidMimeType = isValidFileMimeType(e.target.files[0]);
    if (!isValidMimeType) {
      toast.error(
        `Hiba! A feltölteni kívánt állomány kiterjesztése nem támogatott! (.${getFileMimeType(
          e.target.files[0]
        )}) `
      );
      e.target.value = "";
      return;
    }

    setAttachmentLoading(true);
    const newAttachments = [...attachments];

    for (const file of e.target.files) {
      const base64 = await convertBase64(file);

      newAttachments.push({
        file: file,
        base64: base64,
        deleted: false,
      });
    }

    setAttachments(newAttachments);
    setAttachmentLoading(false);
    e.target.value = "";
  };

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
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleOpenImage = (index) => {
    setIsOpenImageView(true);
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <>
        <SubTitle variant="h3">Jármű kiválasztása</SubTitle>
        <MyTextSkeleton />

        <Grid
          container
          direction="column"
          alignItems="flex-start"
          justifyContent="center"
          sx={{ marginBottom: "1.5rem" }}
        >
          <Grid item sx={{ width: "100%" }}>
            <MyTextSkeleton />
            <MyInputSkeleton />

            <SubTitle2 variant="h3">Új szervizbejegyzés hozzáadása!</SubTitle2>
            <MyCardSkeleton />
          </Grid>
          <Grid item>
            <MyInputSkeleton />
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <>
      <SubTitle variant="h3">Jármű kiválasztása</SubTitle>

      <Grid
        container
        direction="column"
        alignItems="flex-start"
        justifyContent="center"
        sx={{ marginBottom: "1.5rem" }}
      >
        <Grid item sx={{ width: "100%" }}>
          <Grid container direction="row" alignItems="center">
            <Grid item sx={{ width: "100%" }} xs>
              <MyTextField
                fullWidth
                id="outlined-disabled"
                label="Alvázszám"
                type="text"
                value={vehicleVin}
                onChange={(e) => {
                  const maxCount = parseInt(
                    process.env.REACT_APP_MAXIMUM_VIN_LENGTH
                  );

                  if (e.target.value.length < 0) {
                    setVehicleVin("");
                    setIsVinError(true);
                    return;
                  }

                  if (e.target.value.length > maxCount) {
                    setVehicleVin(("" + e.target.value).substring(0, maxCount));
                    setIsVinError(true);
                    return;
                  }
                  setVehicleVin(e.target.value);
                  setIsVinError(false);
                }}
              />
            </Grid>

            {isVinError && (
              <Grid item xs={1}>
                <Tooltip title="Hibás értéket adott meg!">
                  <WarningImage src={WarningIcon} />
                </Tooltip>
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid item>
          {isSearchSent ? (
            <Button
              size="small"
              variant="contained"
              color="warning"
              startIcon={<SearchOutlinedIcon />}
              disabled
            >
              Keresés
            </Button>
          ) : (
            <Button
              size="small"
              variant="contained"
              color="warning"
              startIcon={<SearchOutlinedIcon />}
              onClick={(e) => {
                handleSearchVehicle(e);
                setIsSearchSent(true);
                setTimeout(() => {
                  setIsSearchSent(false);
                }, parseInt(process.env.REACT_APP_BUTTON_CLICK_TIMEOUT));
              }}
            >
              Keresés
            </Button>
          )}
        </Grid>
      </Grid>

      {isFinded && (
        <React.Fragment>
          <Card variant="outlined">
            <CardActionArea>
              <MyCardHeader
                title={`${findedVehicle.manufacture} ${findedVehicle.model}`}
                subheader={findedVehicle.vin}
              />

              <CardContent>
                <Typography variant="h4">
                  Tulajdonos: <a href={"#"}>{findedVehicle.fullName}</a>
                </Typography>
                <Typography variant="h4">
                  Bejegyzett szervizek: {findedVehicleServiceEntriesCount}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <SubTitle2 variant="h3">Új szervizbejegyzés hozzáadása!</SubTitle2>

          <Grid
            container
            direction="row"
            spacing={0}
            wrap="nowrap"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={1}>
              <Typography align="center">
                <DateIcon />
              </Typography>
            </Grid>

            <Grid item xs={11}>
              <MyTextField
                fullWidth
                disabled
                id="outlined"
                value={newServiceDate}
                type="text"
              />
            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            spacing={0}
            wrap="nowrap"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={1}>
              <Typography align="center">
                <KmIcon />
              </Typography>
            </Grid>

            <Grid item xs>
              <MyTextField
                fullWidth
                id="outlined-disabled"
                title="Km. óra állás"
                type="number"
                value={mileage}
                InputProps={{
                  inputProps: {
                    style: {
                      textAlign: "start",
                      MozAppearance: "textfield",
                      WebkitAppearance: "textfield",
                      appearance: "textfield",
                    },
                  },
                }}
                onChange={(e) => {
                  const maxCount = parseInt(process.env.REACT_APP_MAXIMUM_KM);
                  const eventValue = parseInt(e.target.value);

                  if (eventValue < 0) {
                    setMileage(0);
                    setIsError(true);
                    return;
                  }

                  if (eventValue > maxCount) {
                    setMileage(maxCount);
                    setIsError(true);
                    return;
                  }
                  setMileage(eventValue);
                  setIsError(false);
                }}
              />
            </Grid>

            {isError && (
              <Grid item sx={{ padding: "0.4em 0.5em" }}>
                <Tooltip title="Hibás értéket adott meg!">
                  <WarningImage src={WarningIcon} />
                </Tooltip>
              </Grid>
            )}
          </Grid>

          <Grid
            container
            direction="row"
            spacing={0}
            wrap="nowrap"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={1}>
              <Typography align="center">
                <DocumentsIcon />
              </Typography>
            </Grid>

            <Grid item xs={11}>
              <MyTextField
                fullWidth
                id="outlined-disabled"
                type="file"
                helperText={`* Engedélyezett állomány kiterjesztések (${AllowedMimeTypes.map(
                  (x) => ` ${x}`
                )})`}
                multiple={true}
                onChange={(e) => handleNewAttachmentUpload(e)}
              />
            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            wrap="wrap"
            justifyContent="center"
            gap={2}
          >
            {!isAttachmentLoading &&
              Array.from(attachments).map((obj, i) => {
                return (
                  !obj.deleted && (
                    <Grid item key={obj + "" + i}>
                      <ImageItem
                        isURL={false}
                        hasCustomClick={true}
                        onCustomClick={(e) => handleOpenImage(i)}
                        image={obj.base64}
                        onDeleteAction={(e) =>
                          handleNewAttachmentDelete(e, obj.base64)
                        }
                      />
                    </Grid>
                  )
                );
              })}
          </Grid>

          {!isUploaded && (
            <Editor
              apiKey="jdakkbjup13h3wxbimqnu4sii9msv6jim9sx9y7qfzk43spo"
              onInit={(evt, editor) => (serviceMessageHTML.current = editor)}
              init={{
                max_chars: 2000,
                selector: "textarea",
                language: "hu_HU",
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | casechange blocks | bold italic backcolor | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist checklist outdent indent | removeformat | a11ycheck code table help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          )}

          {isSent ? (
            <UploadButton
              size="small"
              variant="contained"
              color="success"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              disabled
            >
              Feltöltés
            </UploadButton>
          ) : (
            <UploadButton
              size="small"
              variant="contained"
              color="success"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              onClick={(e) => handleNewServiceMessage(e)}
            >
              Feltöltés
            </UploadButton>
          )}
        </React.Fragment>
      )}

      {isOpenImageView && (
        <ImageViewer
          isURL={false}
          images={Array.from(attachments).map((obj, i) => {
            return !obj.deleted && obj.base64;
          })}
          index={currentIndex}
          open={isOpenImageView}
          onClose={(e) => setIsOpenImageView(false)}
        />
      )}
    </>
  );
}

export default MechanicWorkshop;
