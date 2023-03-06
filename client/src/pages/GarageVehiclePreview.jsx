import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { axiosInstance } from "../lib/GlobalConfigs";
import {
  ExpandMoreIcon,
  KeyboardBackspaceOutlinedIcon,
  RemoveCircleOutlineOutlinedIcon,
  ShareOutlinedIcon,
  EditIcon,
  NotActivatedIcon,
  ContentCopyIcon,
  DeleteIcon,
  ChangeCircleIcon,
  LeftArrow,
  RightArrow,
  CancelIcon,
} from "../lib/GlobalIcons";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  styled,
  Typography,
  useMediaQuery,
  Link,
  axios,
  moment,
  DOMPurify,
  theme,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  toast,
  InputAdornment,
  TextField,
  Tooltip,
} from "../lib/GlobalImports";
import {
  NameBox,
  BackToCarsButton,
  CarWallPaperImage,
  CarGalleryImage,
  CarDetailGridItem,
  CarDetailsTitle,
  CarDetailValue,
  MyAccordionImage,
  MyAccordion,
  CAR_DETAiL_SPACING,
  CarDialog,
  CarDialogText,
  MyTextField,
  CarCardMedia,
  GalleryImage,
  ViewImage,
  ImageGrid,
} from "../lib/StyledComponents";
import {
  MyFullWidthInputSkeleton,
  MyInputSkeleton,
  MyTextSkeleton,
  MyWallpaperSkeleton,
} from "../lib/Skeletons";
import useAuth from "../hooks/useAuth";
import Roles from "../lib/Roles";
import { CopyToClipBoard } from "../lib/GlobalFunctions";
import { Backdrop, Badge, CircularProgress, Slide } from "@mui/material";
import { Box } from "@mui/system";
import ImageViewer from "../components/ImageViewer.component";
import DynamicAccord from "../components/DynamicAccord.component";

const SubTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.link,
  marginBottom: "2rem",
  fontWeight: 800,
}));

function GarageVehiclePreview({ routes, activePage, handleChangeTab }) {
  const { auth } = useAuth();
  const underMD = useMediaQuery(theme.breakpoints.down("md"));
  const underS = useMediaQuery(theme.breakpoints.down("sm"));
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isVehicleDelete, setIsVehicleDelete] = useState(false);
  const [isVehicleEdit, setIsVehicleEdit] = useState(false);
  /*
    isShared = vehicle is shared ?
    isOpenShareMenu = if i shared a vehicle and I clicked to the share button then a popup will be shown and in the modal we can eliminate the sharing or we can
                      just close the modal.
    */
  const [isShared, setIsShared] = useState(false);
  const [isShareAccepted, setIsShareAccepted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isOpenShareMenu, setIsOpenShareMenu] = useState(false);
  const [isVehiclePrivacyManager, setIsVehiclePrivacyManager] = useState(false);
  const [isShareClick, setIsShareClick] = useState(false);

  /* for vehicle images */
  const [isOpenImageView, setIsOpenImageView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [updatedOwnmass, setUpdatedOwnmass] = useState(100);
  const [updatedFullmass, setUpdatedFullmass] = useState(100);
  const [updatedPerformanceLE, setUpdatedPerformanceLE] = useState(100);
  const [updatedMOT, setUpdatedMOT] = useState(moment());
  const [updatedNOD, setUpdatedNOD] = useState("HU");
  const [updatedLicenseNumber, setUpdatedLicenseNumber] = useState("");
  const [updatedPreview, setUpdatedPreview] = useState({});
  const [updatedPictures, setUpdatedPictures] = useState([]);
  const [vehicle, setVehicle] = useState({});
  const [newOwner, setNewOwner] = useState(null);

  /* data request methods */
  const getVehicle = async (token) => {
    const response = await axiosInstance
      .get(`getVehicle/${id}`, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((response) => {
        const data = response.data;
        const vehicle = JSON.parse(JSON.stringify(data.data.vehicle));
        vehicle["serviceEntries"] = data.data.serviceEntries;
        // Syncronize state values
        setIsShared(vehicle["shared"]);
        setIsShareAccepted(vehicle["shared"]);
        setUpdatedOwnmass(vehicle["ownMass"]);
        setUpdatedFullmass(vehicle["fullMass"]);
        setUpdatedPerformanceLE(vehicle["performanceLE"]);
        setUpdatedMOT(vehicle["mot"] ? vehicle["mot"] : "");
        setUpdatedNOD(vehicle["nod"] ? vehicle["nod"] : "");
        setUpdatedLicenseNumber(
          vehicle["licenseNumber"] ? vehicle["licenseNumber"] : ""
        );
        setUpdatedPreview({
          url: vehicle["pictures"][0],
          modified: false,
          file: null,
          base64: null,
        });
        setUpdatedPictures(
          Array.from(vehicle["pictures"])
            .slice(1, vehicle["pictures"].length)
            .map((img, i) => {
              return {
                file: null,
                modified: false,
                base64: null,
                url: vehicle["pictures"][i],
              };
            })
        );
        setVehicle(vehicle);
        setIsLoading(false);
      })
      .catch((err) => {
        window.location.href = "/jarmuveim";
      });
  };

  const handleVehicleDelete = async () => {
    await axiosInstance
      .delete(`/deleteVehicle/${id}`, {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((res) => {
        toast.success("Sikeresen törölted a járműveidet!");
        window.location.href = "/jarmuveim";
      })
      .catch((err) => {
        if (err.response.status == 404) {
        }
        toast.error("Ooopps! Valami hiba történt!");
      });
  };

  const handleVehicleEdit = async () => {
    const removedImages = [];
    for (let index = 0; index < updatedPictures.length; index++) {
      const element = updatedPictures[index];
      if (element) {
        if (element.modified) {
          removedImages.push(element.url);
        }
      }
    }
    const formData = new FormData();
    if (updatedPreview.modified) {
      formData.append("preview", updatedPreview.file);
    }
    if (removedImages.length > 0) {
      formData.append("deletedPictures", removedImages);
    }
    if (updatedOwnmass != vehicle["ownMass"]) {
      formData.append("ownMass", updatedOwnmass);
    }
    if (updatedFullmass != vehicle["fullMass"]) {
      formData.append("fullMass", updatedFullmass);
    }
    if (updatedPerformanceLE != vehicle["performanceLE"]) {
      formData.append("performance", updatedPerformanceLE);
    }
    if (updatedMOT != moment(vehicle["mot"])) {
      formData.append("mot", updatedMOT);
    }
    if (updatedNOD != vehicle["nod"]) {
      formData.append("nod", updatedNOD);
    }
    if (updatedLicenseNumber != vehicle["licenseNumber"]) {
      formData.append("licenseNumber", updatedLicenseNumber);
    }

    await axiosInstance
      .put(`/updateVehicle/${id}`, formData, {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((res) => {
        toast.success("Sikeresen frissítetted az autódat!");
        window.location.reload();
      })
      .catch((err) => {
        if (err.response.status == 422) {
          toast.warning("Oopps! Valamit nem tölthettél ki!");
        }
      });
  };

  const handleVehiclePreviewChange = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setUpdatedPreview({
      file: file,
      modified: true,
      base64: base64,
      url: "",
    });
  };

  const handleVehicleShareMenu = async () => {
    setIsOpenShareMenu(true);
  };

  // click to the share icon
  const handleVehicleShare = async () => {
    await axiosInstance
      .post(
        `/shareVehicle/${id}`,
        {},
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        setIsShared(res.data.data.vehicle.shared);
        toast.success(`Sikeresen megosztottad a járművedet!`);
        setIsShared(true);
        setIsShareAccepted(true);
      })
      .catch((err) => {
        toast.warning("Ooops! Valami hiba történt megosztás közben!");
        setIsShared(false);
        setIsShareAccepted(false);
      });
  };

  const handleVehicleUnShare = async () => {
    await axiosInstance
      .post(
        `/shareVehicle/${id}`,
        {},
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        setIsShared(res.data.data.vehicle.shared);
        toast.success(`Sikeresen visszavonta a járműve megosztását!`);
        setIsShared(false);
        setIsShareAccepted(false);
      })
      .catch((err) => {
        setIsShared(false);
        toast.warning(
          "Ooops! Valami hiba történt megosztás visszavonása közben!"
        );
        setIsShareAccepted(false);
      });
  };

  const handleNewVehicleOwner = async () => {
    if (!newOwner) {
      toast.error("Kérjük adja meg a következő tulajdonos e-mail címét!");
      return;
    }

    await axiosInstance
      .post(
        `/changeOwner/${id}`,
        { email: newOwner },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        toast.success(`Sikeresen átállította a járművét!`);
        setNewOwner(null);
        window.location.href = "/jarmuveim";
      })
      .catch((err) => {
        if (err.response.status == 404) {
          toast.warning("Ooops! Ez a felhasználó nem létezik!");
        } else {
          toast.warning("Ooops! Valami hiba történt a váltás közben!");
        }
        setNewOwner(null);
      });
  };

  // TODO: put it to globalfunctions
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

  const handleNewVehicleGalleryImageDelete = (e, url) => {
    const newAttachments = [...updatedPictures];

    for (let index = 0; index < newAttachments.length; index++) {
      const element = newAttachments[index];
      if (element.url == url) {
        element.modified = true;
      }
    }

    setUpdatedPictures(newAttachments);
  };

  const handleOpenImage = (index) => {
    setIsOpenImageView(true);
    setCurrentIndex(index);
  };

  useEffect(() => {
    /* For Tabs */
    switch (auth.role) {
      case Roles.User:
        [...routes.USER].forEach((route) => {
          switch (window.location.pathname) {
            case `${route.link}`:
              if (activePage !== route.activeIndex) {
                handleChangeTab(route.activeIndex);
              }
              break;
            default:
              break;
          }

          if (
            window.location.pathname.includes(route.link) &&
            route.link !== "/"
          ) {
            if (activePage !== route.activeIndex) {
              handleChangeTab(route.activeIndex);
            }
          }
        });
        break;
      case Roles.Employee:
        [...routes.EMPLOYEE].forEach((route) => {
          switch (window.location.pathname) {
            case `${route.link}`:
              if (activePage !== route.activeIndex) {
                handleChangeTab(route.activeIndex);
              }
              break;
            default:
              break;
          }

          if (
            window.location.pathname.includes(route.link) &&
            route.link !== "/"
          ) {
            if (activePage !== route.activeIndex) {
              handleChangeTab(route.activeIndex);
            }
          }
        });
        break;
      case Roles.Owner:
        [...routes.OWNER].forEach((route) => {
          switch (window.location.pathname) {
            case `${route.link}`:
              if (activePage !== route.activeIndex) {
                handleChangeTab(route.activeIndex);
              }
              break;
            default:
              break;
          }

          if (
            window.location.pathname.includes(route.link) &&
            route.link !== "/"
          ) {
            if (activePage !== route.activeIndex) {
              handleChangeTab(route.activeIndex);
            }
          }
        });
        break;
      case Roles.Admin:
        [...routes.ADMIN].forEach((route) => {
          switch (window.location.pathname) {
            case `${route.link}`:
              if (activePage !== route.activeIndex) {
                handleChangeTab(route.activeIndex);
              }
              break;
            default:
              break;
          }

          if (
            window.location.pathname.includes(route.link) &&
            route.link !== "/"
          ) {
            if (activePage !== route.activeIndex) {
              handleChangeTab(route.activeIndex);
            }
          }
        });
        break;
    }

    if (!id) {
      window.location.href = "/jarmuveim";
    }

    getVehicle(localStorage.getItem("token"));
  }, []);

  if (isLoading) {
    return (
      <React.Fragment>
        <BackToCarsButton
          startIcon={<KeyboardBackspaceOutlinedIcon />}
          component={Link}
          to="/jarmuveim"
        >
          <SubTitle variant="h3" sx={{ marginBottom: "0", marginLeft: "1em" }}>
            Járműveim
          </SubTitle>
        </BackToCarsButton>

        <NameBox>
          <MyTextSkeleton />
          <MyTextSkeleton />
        </NameBox>

        <Grid container direction="column" alignItems="flex-start">
          {/* Car Image Gallery */}
          <Grid item>
            <Grid container direction={"column"} spacing={CAR_DETAiL_SPACING}>
              <Grid item xs={7}>
                <Grid
                  container
                  direction="column"
                  alignItems="flex-start"
                  justifyContent="center"
                >
                  <Grid item>
                    <MyWallpaperSkeleton />

                    <Grid container direction="row" spacing={0.4}>
                      <MyInputSkeleton />
                      <MyInputSkeleton />
                      <MyInputSkeleton />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {/* Car Details */}
              <Grid item xs={5}>
                <Grid
                  container
                  direction="column"
                  alignItems="flex-start"
                  justifyContent="flex-start"
                >
                  {/* car detail */}
                  <CarDetailGridItem item>
                    <CarDetailsTitle>Jármű általános adatai</CarDetailsTitle>

                    <Grid
                      container
                      direction="column"
                      alignItems="flex-start"
                      justifyContent="flex-start"
                      sx={{ paddingLeft: "2.5em" }}
                    >
                      <Grid item>
                        <Grid
                          container
                          direction="row"
                          spacing={CAR_DETAiL_SPACING}
                        >
                          <Grid item>
                            <Typography>
                              <MyInputSkeleton />
                            </Typography>
                          </Grid>
                          <Grid item>
                            <CarDetailValue>
                              <MyInputSkeleton />
                            </CarDetailValue>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item>
                        <Grid
                          container
                          direction="row"
                          spacing={CAR_DETAiL_SPACING}
                        >
                          <Grid item>
                            <Typography>
                              <MyInputSkeleton />
                            </Typography>
                          </Grid>
                          <Grid item>
                            <CarDetailValue>
                              <MyInputSkeleton />
                            </CarDetailValue>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CarDetailGridItem>
                  {/* end of car detail */}

                  {/* car detail */}
                  <CarDetailGridItem item>
                    <CarDetailsTitle>Jármű adatai</CarDetailsTitle>

                    <Grid
                      container
                      direction="column"
                      alignItems="flex-start"
                      justifyContent="flex-start"
                      sx={{ paddingLeft: "2.5em" }}
                    >
                      <Grid item>
                        <Grid
                          container
                          direction="row"
                          spacing={CAR_DETAiL_SPACING}
                        >
                          <Grid item>
                            <Typography>
                              <MyInputSkeleton />
                            </Typography>
                          </Grid>
                          <Grid item>
                            <CarDetailValue>
                              <MyInputSkeleton />
                            </CarDetailValue>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item>
                        <Grid
                          container
                          direction="row"
                          spacing={CAR_DETAiL_SPACING}
                        >
                          <Grid item>
                            <Typography>
                              <MyInputSkeleton />
                            </Typography>
                          </Grid>
                          <Grid item>
                            <CarDetailValue>
                              <MyInputSkeleton />
                            </CarDetailValue>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item>
                        <Grid
                          container
                          direction="row"
                          spacing={CAR_DETAiL_SPACING}
                        >
                          <Grid item>
                            <Typography>
                              <MyInputSkeleton />
                            </Typography>
                          </Grid>
                          <Grid item>
                            <CarDetailValue>
                              <MyInputSkeleton />
                            </CarDetailValue>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CarDetailGridItem>
                  {/* end of car detail */}

                  {/* car detail */}
                  <CarDetailGridItem item>
                    <CarDetailsTitle>Jármű motor adatai</CarDetailsTitle>

                    <Grid
                      container
                      direction="column"
                      alignItems="flex-start"
                      justifyContent="flex-start"
                      sx={{ paddingLeft: "2.5em" }}
                    >
                      <Grid item>
                        <Grid
                          container
                          direction="row"
                          spacing={CAR_DETAiL_SPACING}
                        >
                          <Grid item>
                            <Typography>
                              <MyInputSkeleton />
                            </Typography>
                          </Grid>
                          <Grid item>
                            <CarDetailValue>
                              <MyInputSkeleton />
                            </CarDetailValue>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item>
                        <Grid
                          container
                          direction="row"
                          spacing={CAR_DETAiL_SPACING}
                        >
                          <Grid item>
                            <Typography>
                              <MyInputSkeleton />
                            </Typography>
                          </Grid>
                          <Grid item>
                            <CarDetailValue>
                              <MyInputSkeleton />
                            </CarDetailValue>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item>
                        <Grid
                          container
                          direction="row"
                          spacing={CAR_DETAiL_SPACING}
                        >
                          <Grid item>
                            <Typography>
                              <MyInputSkeleton />
                            </Typography>
                          </Grid>
                          <Grid item>
                            <CarDetailValue>
                              <MyInputSkeleton />
                            </CarDetailValue>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item>
                        <Grid
                          container
                          direction="row"
                          spacing={CAR_DETAiL_SPACING}
                        >
                          <Grid item>
                            <Typography>
                              <MyInputSkeleton />
                            </Typography>
                          </Grid>
                          <Grid item>
                            <CarDetailValue>
                              <MyInputSkeleton />
                            </CarDetailValue>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item>
                        <Grid
                          container
                          direction="row"
                          spacing={CAR_DETAiL_SPACING}
                        >
                          <Grid item>
                            <Typography>
                              <MyInputSkeleton />
                            </Typography>
                          </Grid>
                          <Grid item>
                            <CarDetailValue>
                              <MyInputSkeleton />
                            </CarDetailValue>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CarDetailGridItem>
                  {/* end of car detail */}

                  {/* car detail */}
                  <CarDetailGridItem item>
                    <CarDetailsTitle>Jármű okmányai</CarDetailsTitle>

                    <Grid
                      container
                      direction="column"
                      alignItems="flex-start"
                      justifyContent="flex-start"
                      sx={{ paddingLeft: "2.5em" }}
                    >
                      <Grid item>
                        <Grid
                          container
                          direction="row"
                          spacing={CAR_DETAiL_SPACING}
                        >
                          <Grid item>
                            <Typography>
                              <MyInputSkeleton />
                            </Typography>
                          </Grid>
                          <Grid item>
                            <CarDetailValue>
                              <MyInputSkeleton />
                            </CarDetailValue>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item>
                        <Grid
                          container
                          direction="row"
                          spacing={CAR_DETAiL_SPACING}
                        >
                          <Grid item>
                            <Typography>
                              <MyInputSkeleton />
                            </Typography>
                          </Grid>
                          <Grid item>
                            <CarDetailValue>
                              <MyInputSkeleton />
                            </CarDetailValue>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CarDetailGridItem>
                  {/* end of car detail */}
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Service information(s) */}
          <Grid item sx={{ width: "100%" }}>
            <NameBox>
              {" "}
              <Typography>Szerviz előélet</Typography>{" "}
            </NameBox>
            <Grid container direction="column">
              <MyFullWidthInputSkeleton />
              <MyFullWidthInputSkeleton />
              <MyFullWidthInputSkeleton />
              <MyFullWidthInputSkeleton />
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <BackToCarsButton
        startIcon={<KeyboardBackspaceOutlinedIcon />}
        component={Link}
        to="/jarmuveim"
      >
        <SubTitle variant="h3" sx={{ marginBottom: "0", marginLeft: "1em" }}>
          Járműveim
        </SubTitle>
      </BackToCarsButton>

      <Grid container justifyContent="flex-end" alignItems="center">
        <Grid item>
          <Tooltip title="Jármű törlés">
            <IconButton onClick={(e) => setIsVehicleDelete(true)}>
              <DeleteIcon sx={{ color: "red" }} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Jármű szerkesztése">
            <IconButton onClick={(e) => setIsVehicleEdit(true)}>
              <EditIcon sx={{ color: "black" }} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Tulajdonosváltás">
            <IconButton onClick={(e) => setIsVehiclePrivacyManager(true)}>
              <ChangeCircleIcon sx={{ color: "black" }} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          {isShareClick ? (
            <IconButton
              onClick={(e) => handleVehicleShareMenu()}
              title={isShared ? "Megosztva!" : "Megosztás!"}
              disabled
            >
              <ShareOutlinedIcon sx={{ color: isShared ? "green" : "blue" }} />
            </IconButton>
          ) : (
            <IconButton
              onClick={(e) => handleVehicleShareMenu()}
              title={isShared ? "Megosztva!" : "Megosztás!"}
            >
              <ShareOutlinedIcon sx={{ color: isShared ? "green" : "blue" }} />
            </IconButton>
          )}
        </Grid>
      </Grid>

      <NameBox>
        <Typography variant="h3" sx={{ fontWeight: 900 }}>
          {vehicle.manufacture + " " + vehicle.model}
        </Typography>
        <Typography
          variant="h4"
          sx={{ color: "rgba(17, 17, 17, 0.74)", fontWeight: 900 }}
        >
          {vehicle.vin}
        </Typography>
      </NameBox>

      <Grid container direction="column" alignItems="flex-start">
        {/* Car Image Gallery */}
        <Grid item>
          <Grid
            container
            direction={underMD ? "column" : "row"}
            spacing={CAR_DETAiL_SPACING}
          >
            <Grid item xs={7}>
              <Grid
                container
                direction="column"
                alignItems="flex-start"
                justifyContent="center"
              >
                <Grid item>
                  <CarWallPaperImage
                    onClick={(e) => {
                      handleOpenImage(0);
                    }}
                    src={
                      updatedPreview.modified
                        ? updatedPreview.base64
                        : updatedPreview.url.length > 0
                        ? updatedPreview.url
                        : "https://t3.ftcdn.net/jpg/04/21/50/96/360_F_421509616_AW4LfRfbYST8T2ZT9gFGxGWfrCwr4qm4.jpg"
                    }
                    alt={vehicle.manufacture + " " + vehicle.model}
                  />

                  <Grid container direction="row" spacing={0.4}>
                    {vehicle["pictures"].map((image, i) => {
                      if (i > 0) {
                        return (
                          <Grid item key={image + "" + i}>
                            <CarGalleryImage
                              onClick={(e) => handleOpenImage(i)}
                              src={"/" + image}
                            />
                          </Grid>
                        );
                      }
                    })}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* Car Details */}
            <Grid item xs={5}>
              <Grid
                container
                direction="column"
                alignItems="flex-start"
                justifyContent="flex-start"
              >
                {/* car detail */}
                <CarDetailGridItem item>
                  <CarDetailsTitle>Jármű általános adatai</CarDetailsTitle>

                  <Grid
                    container
                    direction="column"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    sx={{ paddingLeft: "2.5em" }}
                  >
                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        spacing={CAR_DETAiL_SPACING}
                      >
                        <Grid item>
                          <Typography>Évjárat: </Typography>
                        </Grid>
                        <Grid item>
                          <CarDetailValue>
                            {moment(vehicle.vintage).format("YYYY")}
                          </CarDetailValue>
                        </Grid>
                      </Grid>
                    </Grid>

                    {vehicle?.licenseNumber && (
                      <Grid item>
                        <Grid
                          container
                          direction="row"
                          spacing={CAR_DETAiL_SPACING}
                        >
                          <Grid item>
                            <Typography>Rendszám: </Typography>
                          </Grid>
                          <Grid item>
                            <CarDetailValue>
                              {vehicle.licenseNumber}
                            </CarDetailValue>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}

                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        spacing={CAR_DETAiL_SPACING}
                      >
                        <Grid item>
                          <Typography>Kivitel: </Typography>
                        </Grid>
                        <Grid item>
                          <CarDetailValue>{vehicle.designType}</CarDetailValue>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CarDetailGridItem>
                {/* end of car detail */}

                {/* car detail */}
                <CarDetailGridItem item>
                  <CarDetailsTitle>Jármű adatai</CarDetailsTitle>

                  <Grid
                    container
                    direction="column"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    sx={{ paddingLeft: "2.5em" }}
                  >
                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        spacing={CAR_DETAiL_SPACING}
                      >
                        <Grid item>
                          <Typography>Km. óra állás: </Typography>
                        </Grid>
                        <Grid item>
                          <CarDetailValue>{vehicle.mileage} km</CarDetailValue>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        spacing={CAR_DETAiL_SPACING}
                      >
                        <Grid item>
                          <Typography>Saját tömeg: </Typography>
                        </Grid>
                        <Grid item>
                          <CarDetailValue>{vehicle.ownMass} kg</CarDetailValue>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        spacing={CAR_DETAiL_SPACING}
                      >
                        <Grid item>
                          <Typography>Teljes tömeg: </Typography>
                        </Grid>
                        <Grid item>
                          <CarDetailValue>{vehicle.fullMass} kg</CarDetailValue>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CarDetailGridItem>
                {/* end of car detail */}

                {/* car detail */}
                <CarDetailGridItem item>
                  <CarDetailsTitle>Jármű motor adatai</CarDetailsTitle>

                  <Grid
                    container
                    direction="column"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    sx={{ paddingLeft: "2.5em" }}
                  >
                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        spacing={CAR_DETAiL_SPACING}
                      >
                        <Grid item>
                          <Typography>Üzemanyag: </Typography>
                        </Grid>
                        <Grid item>
                          <CarDetailValue>{vehicle.fuel}</CarDetailValue>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        spacing={CAR_DETAiL_SPACING}
                      >
                        <Grid item>
                          <Typography>Hengerűrtartalom: </Typography>
                        </Grid>
                        <Grid item>
                          <CarDetailValue>
                            {vehicle.cylinderCapacity} cm<sup>3</sup>
                          </CarDetailValue>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        spacing={CAR_DETAiL_SPACING}
                      >
                        <Grid item>
                          <Typography>Teljesítmény: </Typography>
                        </Grid>
                        <Grid item>
                          <CarDetailValue>
                            {vehicle.performanceKW} kW, {vehicle.performanceLE}{" "}
                            LE
                          </CarDetailValue>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        spacing={CAR_DETAiL_SPACING}
                      >
                        <Grid item>
                          <Typography>Hajtás: </Typography>
                        </Grid>
                        <Grid item>
                          <CarDetailValue>{vehicle.driveType}</CarDetailValue>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        spacing={CAR_DETAiL_SPACING}
                      >
                        <Grid item>
                          <Typography>Sebességváltó: </Typography>
                        </Grid>
                        <Grid item>
                          <CarDetailValue>
                            {vehicle.transmission}
                          </CarDetailValue>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CarDetailGridItem>
                {/* end of car detail */}

                {/* car detail */}
                <CarDetailGridItem item>
                  <CarDetailsTitle>Jármű okmányai</CarDetailsTitle>

                  <Grid
                    container
                    direction="column"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    sx={{ paddingLeft: "2.5em" }}
                  >
                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        spacing={CAR_DETAiL_SPACING}
                      >
                        <Grid item>
                          <Typography>Okmányok jellege: </Typography>
                        </Grid>
                        <Grid item>
                          <CarDetailValue>{vehicle.nod}</CarDetailValue>
                        </Grid>
                      </Grid>
                    </Grid>

                    {vehicle?.mot && (
                      <Grid item>
                        <Grid
                          container
                          direction="row"
                          spacing={CAR_DETAiL_SPACING}
                        >
                          <Grid item>
                            <Typography>
                              Műszaki vizsga érvényessége:{" "}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <CarDetailValue>
                              {moment(vehicle.mot).format("YYYY-MM-DD")}
                            </CarDetailValue>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </CarDetailGridItem>
                {/* end of car detail */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Service information(s) */}
        <Grid item sx={{ width: "100%" }}>
          <NameBox>
            {" "}
            <SubTitle variant="h4" sx={{ marginBottom: "0" }}>
              Szerviz előélet
            </SubTitle>{" "}
          </NameBox>
          {vehicle.serviceEntries && (
            <Grid container direction="column">
              {Array.from(vehicle.serviceEntries).map((service, i) => {
                let panel = `panel${i}`;
                return (
                  <DynamicAccord
                    key={service + "" + i}
                    service={service}
                    panel={panel}
                    serialNumber={i}
                  />
                );
              })}
            </Grid>
          )}
        </Grid>
      </Grid>

      {isVehicleDelete && (
        <CarDialog
          open={isVehicleDelete}
          onClose={(e) => setIsVehicleDelete(!isVehicleDelete)}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <DialogTitle id="alert-dialog-title">
            <Typography variant="h2">Figyelmeztetés</Typography>
          </DialogTitle>

          <DialogContent>
            <CarDialogText id="alert-dialog-description">
              <Typography component={"span"}>
                Biztosan törölni kívánja az alábbi járművet?
              </Typography>
            </CarDialogText>
          </DialogContent>

          <DialogActions>
            <Button
              size="small"
              onClick={(e) => {
                setIsVehicleDelete(false);
              }}
              variant="contained"
              color="success"
            >
              Mégsem
            </Button>
            <Button
              size="small"
              onClick={(e) => handleVehicleDelete()}
              variant="contained"
              color="error"
              autoFocus
            >
              Törlés
            </Button>
          </DialogActions>
        </CarDialog>
      )}
      {isOpenShareMenu && (
        <CarDialog
          open={isOpenShareMenu}
          onClose={(e) => setIsOpenShareMenu(!isOpenShareMenu)}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <DialogTitle id="alert-dialog-title">
            <Typography variant="h2">Megosztás</Typography>
          </DialogTitle>

          <DialogContent>
            <CarDialogText id="alert-dialog-description">
              <Grid
                container
                direction="row"
                wrap="wrap"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={11}>
                  <MyTextField
                    fullWidth
                    id="outlined-disabled"
                    defaultValue={`${process.env.REACT_APP_CLIENT_URL}/megosztott/${id}`}
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item xs={1} sx={{ width: "100%" }}>
                  {isCopied ? (
                    <Tooltip title="Vágólapra másolva!">
                      <Badge color="success" variant="dot">
                        <IconButton
                          sx={{ margin: "0 auto" }}
                          onClick={(e) => {
                            setTimeout(() => {
                              setIsCopied(false);
                            });
                          }}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </Badge>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Vágólapra másolás!">
                      <IconButton
                        sx={{ margin: "0 auto" }}
                        onClick={(e) => {
                          CopyToClipBoard(
                            `${process.env.REACT_APP_CLIENT_URL}/megosztott/${id}`
                          );
                          setIsCopied(true);
                        }}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>

              <DialogActions>
                <Button
                  size="small"
                  onClick={(e) => {
                    setIsOpenShareMenu(false);
                  }}
                  variant="contained"
                  color="warning"
                >
                  Bezárás
                </Button>
                {isShareAccepted ? (
                  <Button
                    size="small"
                    onClick={(e) => handleVehicleUnShare()}
                    variant="contained"
                    color="error"
                    autoFocus
                  >
                    Megosztás visszavonása
                  </Button>
                ) : (
                  <Button
                    size="small"
                    onClick={(e) => handleVehicleShare()}
                    variant="contained"
                    color="success"
                    autoFocus
                  >
                    Megosztás jóváhagyása
                  </Button>
                )}
              </DialogActions>
            </CarDialogText>
          </DialogContent>
        </CarDialog>
      )}
      {isVehicleEdit && (
        <CarDialog
          open={isVehicleEdit}
          onClose={(e) => setIsVehicleDelete(!isVehicleEdit)}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <DialogTitle id="alert-dialog-title">
            <Typography variant="h2">Szerkesztés</Typography>
          </DialogTitle>

          <DialogContent>
            <CarDialogText id="alert-dialog-description">
              <Grid
                container
                direction="row"
                sx={{ margin: "2rem 0" }}
                justifyContent="space-between"
              >
                <Grid item xs={4}>
                  <CarCardMedia
                    component="img"
                    image={
                      updatedPreview.modified
                        ? updatedPreview.base64
                        : updatedPreview.url.length > 0
                        ? updatedPreview.url
                        : "https://t3.ftcdn.net/jpg/04/21/50/96/360_F_421509616_AW4LfRfbYST8T2ZT9gFGxGWfrCwr4qm4.jpg"
                    }
                    alt="new-wallpaper"
                  />
                </Grid>
                <Grid item>
                  <MyTextField
                    onChange={(e) => handleVehiclePreviewChange(e)}
                    inputProps={{ accept: "image/*" }}
                    fullWidth
                    name="wallpaper"
                    placeholder="Kép kiválasztása..."
                    type="file"
                  />
                </Grid>
              </Grid>
              <MyTextField
                fullWidth
                id="outlined-disabled"
                label="* Saját tömeg"
                value={updatedOwnmass}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">kg</InputAdornment>
                  ),
                }}
                default={0}
                type="number"
                onChange={(e) => {
                  let weight = parseInt(e.target.value);
                  if (weight < 0) {
                    setUpdatedOwnmass(vehicle["ownMass"]);
                    return;
                  }

                  if (weight > process.env.REACT_APP_MAXIMUM_WEIGHT) {
                    setUpdatedOwnmass(vehicle["ownMass"]);
                    return;
                  }
                  setUpdatedOwnmass(weight);
                }}
              />
              <MyTextField
                fullWidth
                id="outlined-disabled"
                label="* Teljes tömeg"
                value={updatedFullmass}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">kg</InputAdornment>
                  ),
                }}
                type="number"
                onChange={(e) => {
                  let weight = parseInt(e.target.value);
                  if (weight < 0) {
                    setUpdatedFullmass(vehicle["fullMass"]);
                    return;
                  }

                  if (weight > process.env.REACT_APP_MAXIMUM_WEIGHT) {
                    setUpdatedFullmass(vehicle["fullMass"]);
                    return;
                  }
                  setUpdatedFullmass(weight);
                }}
              />
              <MyTextField
                fullWidth
                id="outlined-disabled"
                label="* Teljesítmény"
                value={updatedPerformanceLE}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">LE</InputAdornment>
                  ),
                }}
                type="number"
                onChange={(e) => {
                  let performance = parseInt(e.target.value);
                  if (performance < 0) {
                    setUpdatedPerformanceLE(vehicle["performanceLE"]);
                    return;
                  }

                  if (
                    performance > process.env.REACT_APP_MAXIMUM_PERFORMANCE_LE
                  ) {
                    setUpdatedPerformanceLE(vehicle["performanceLE"]);
                    return;
                  }
                  setUpdatedPerformanceLE(performance);
                }}
              />
              <MyTextField
                fullWidth
                id="outlined-disabled"
                label="Rendszám"
                value={updatedLicenseNumber}
                type="text"
                onChange={(e) => {
                  if (
                    e.target.value.length >
                    process.env.REACT_APP_MAXIMUM_LICENSE_PLATE_NUMBER_LENGTH
                  ) {
                    setUpdatedLicenseNumber(vehicle["licenseNumber"]);
                    return;
                  }
                  if (e.target.value.length < 0) {
                    setUpdatedLicenseNumber(vehicle["licenseNumber"]);
                    return;
                  }

                  setUpdatedLicenseNumber(e.target.value);
                }}
              />
              <MyTextField
                fullWidth
                id="outlined-disabled"
                label="* Okmányok jellege"
                value={updatedNOD}
                type="text"
                onChange={(e) => {
                  if (e.target.value.length < 0) {
                    setUpdatedNOD(vehicle["nod"]);
                    return;
                  }
                  if (e.target.value.length > 30) {
                    setUpdatedNOD(vehicle["nod"]);
                    return;
                  }

                  setUpdatedNOD(e.target.value);
                }}
              />
              <MyTextField
                fullWidth
                id="outlined-disabled"
                label="Műszaki érvényesség"
                value={updatedMOT}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">*</InputAdornment>
                  ),
                }}
                type="date"
                onChange={(e) => {
                  const date = moment(e.target.valueAsDate);
                  const isValidDate = date.isValid();

                  if (!isValidDate) {
                    setUpdatedMOT(moment(new Date()).format("YYYY-MM-DD"));
                    return;
                  }

                  const isCorrentDate = date.isBetween(
                    moment("1950.01.01"),
                    moment("2040.01.01")
                  );

                  if (!isCorrentDate) {
                    setUpdatedMOT(moment(new Date()).format("YYYY-MM-DD"));
                    return;
                  }

                  setUpdatedMOT(
                    moment(e.target.valueAsDate).format("YYYY-MM-DD")
                  );
                }}
              />

              <Grid
                container
                direction="row"
                wrap="wrap"
                justifyContent="center"
                gap={2}
              >
                {Array.from(updatedPictures).map((obj, i) => {
                  return (
                    !obj.modified && (
                      <Grid item>
                        <Grid
                          container
                          direction="column"
                          gap={2}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Grid item>
                            <GalleryImage
                              key={obj + "asd" + i}
                              src={`${obj.base64 ? obj.base64 : obj.url}`}
                              loading="lazy"
                            />
                          </Grid>

                          <Grid item>
                            <IconButton
                              onClick={(e) =>
                                handleNewVehicleGalleryImageDelete(e, obj.url)
                              }
                            >
                              <RemoveCircleOutlineOutlinedIcon color="error" />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    )
                  );
                })}
              </Grid>
            </CarDialogText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={(e) => {
                setIsVehicleEdit(false);
              }}
              variant="outlined"
            >
              Mégsem
            </Button>
            <Button
              onClick={(e) => handleVehicleEdit()}
              variant="contained"
              color="success"
              autoFocus
            >
              Mentés
            </Button>
          </DialogActions>
        </CarDialog>
      )}
      {isVehiclePrivacyManager && (
        <CarDialog
          open={isVehiclePrivacyManager}
          onClose={(e) => setIsVehiclePrivacyManager(!isVehiclePrivacyManager)}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <DialogTitle id="alert-dialog-title">
            <Typography variant="h2">Tulajdonosváltás</Typography>
          </DialogTitle>

          <DialogContent>
            <CarDialogText id="alert-dialog-description">
              <MyTextField
                fullWidth
                id="outlined-disabled"
                label="* Következő tulajdonos e-mail címe"
                type="email"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
              />
            </CarDialogText>
          </DialogContent>

          <DialogActions>
            <Button
              size="small"
              onClick={(e) => {
                setIsVehiclePrivacyManager(false);
              }}
              variant="outlined"
            >
              Mégsem
            </Button>
            <Button
              size="small"
              onClick={(e) => handleNewVehicleOwner()}
              variant="contained"
              color="success"
              autoFocus
            >
              Mentés
            </Button>
          </DialogActions>
        </CarDialog>
      )}

      {isOpenImageView && (
        <ImageViewer
          isURL={true}
          images={[...vehicle["pictures"]]}
          index={currentIndex}
          open={isOpenImageView}
          onClose={(e) => setIsOpenImageView(false)}
        />
      )}
    </React.Fragment>
  );
}

export default GarageVehiclePreview;
