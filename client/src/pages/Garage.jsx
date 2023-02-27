import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Select,
  axios,
  Link,
  theme,
  Alert,
  Autocomplete,
  Button,
  Chip,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  toast,
  moment,
} from "../lib/GlobalImports";
import {
  AddCircleOutlineOutlinedIcon,
  DirectionsCarFilledOutlinedIcon,
  DiscountOutlinedIcon,
  EnergySavingsLeafOutlinedIcon,
  TextsmsOutlinedIcon,
  RemoveCircleOutlineOutlinedIcon,
  AccountTreeOutlinedIcon,
  SearchIcon,
  DateIcon,
  CarTypeIcon,
  KmIcon,
  CarWeightIcon,
  FuelIcon,
  TankIcon,
  PerformanceIcon,
  WheelIcon,
  ChangeGearIcon,
  DocumentsIcon,
  ValidityIcon,
  serviceInformationIcon,
  MoreVertIcon,
  DoNotDisturbOnOutlinedIcon,
  ShareOutlinedIcon,
} from "../lib/GlobalIcons";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
  AddCarSubTitle,
  MyTextField,
  MyFormControll,
  GalleryImage,
  MenuProps,
  SubTitle,
  ContentBox,
  ViewButton,
  CarCard,
  CarCardHeader,
  CarCardMedia,
  CarCardContent,
  CarCardActions,
  CarOptionsMenu,
  CarDialog,
  MenuText,
  CarDialogText,
} from "../lib/StyledComponents";
import { MyCardSkeleton, MyInputSkeleton } from "../lib/Skeletons";
import { CopyToClipBoard } from "../lib/GlobalFunctions";
import { axiosInstance } from "../lib/GlobalConfigs";
import useAuth from "../hooks/useAuth";
import VehicleCard from "../components/VehicleCard.component";
import ImageItem from "../components/ImageItem.component";
import LiveImageUploadField from "../components/LiveImageUploadField.component";
import ImageViewer from "../components/ImageViewer.component";

function Garage({ handleChangeTab }) {
  const { auth } = useAuth();
  const underMD = useMediaQuery(theme.breakpoints.down("md"));
  const underS = useMediaQuery(theme.breakpoints.down("sm"));

  /* variables that used for cars */
  const [vehicles, setVehicles] = useState([]);
  const [visibleVehicles, setVisibleVehicles] = useState([]);
  /* end of car variables */

  /* searching variables */
  const [isSearchEmpty, setIsSearchEmpty] = useState(false);
  const [searchText, setSearchText] = useState("");

  /* screen variables */
  const [isLoading, setIsLoading] = useState(true);
  const [isModified, setIsModified] = useState(false);
  /* end of screen variables */

  /* new vehicle datas */
  /* these variables stores the new car datas */
  const [isAdding, setIsAdding] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [newVehicleWallpaperInBase64, setNewVehicleWallpaperInBase64] =
    useState("");
  const [newVehicleWallpaper, setNewVehicleWallpaper] = useState("");
  const [newVehicleVin, setNewVehicleVin] = useState("");
  const [newVehicleLicenseNum, setNewVehicleLicenseNum] = useState("");
  const [newVehicleCategory, setNewVehicleCategory] = useState(
    "637e08068850125b86f2ad69"
  );
  const [newVehicleManufacture, setNewVehicleManufacture] = useState("");
  const [newVehicleDesignType, setNewVehicleDesignType] = useState("");
  const [newVehicleModel, setNewVehicleModel] = useState("");
  const [newVehicleVintage, setNewVehicleVintage] = useState(0);
  const [newVehicleKm, setNewVehicleKm] = useState("");
  const [newVehicleOwnWeight, setNewVehicleOwnWeight] = useState("");
  const [newVehicleMaxWeight, setNewVehicleMaxWeight] = useState("");
  const [newVehicleFuel, setNewVehicleFuel] = useState("");
  const [newVehicleCylinderCapacity, setNewVehicleCylinderCapacity] =
    useState("");
  const [newVehiclePerformance, setNewVehiclePerformance] = useState("");
  const [newVehicleDriveType, setNewVehicleDriveType] = useState("");
  const [newVehicleTransmission, setNewVehicleTransmission] = useState("");
  const [newVehicleDocument, setNewVehicleDocument] = useState("");
  const [newVehicleDocumentValidity, setNewVehicleDocumentValidity] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [newVehicleGallery, setNewVehicleGallery] = useState([]);
  const [newVehicleGalleryImageLoading, setNewVehicleGalleryImageLoading] =
    useState(false);

  /* We use it for add error message to the new car component. */
  const [AddCarErrorMessageBox, setAddCarErrorMessageBox] = useState("");
  const setErrorMessageDuringCarAdd = (field, message) => {
    let firstLetter = field.charAt(0) + "";
    firstLetter = firstLetter.toUpperCase();
    let newField = firstLetter + "" + field.substring(1, field.length);

    setAddCarErrorMessageBox(`${newField} -> ${message}`);
    setTimeout(() => {
      setAddCarErrorMessageBox("");
    }, 10000);
  };

  /* add new car form datas */
  /* these variables store the selectable contents of the new car form */
  const [vehicleVintages, setVehicleVintages] = useState([]);
  const [vehicleFuels, setVehicleFuels] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicleDesignTypes, setVehicleDesignTypes] = useState([]);
  const [vehicleDriveTypes, setVehicleDriveTypes] = useState([]);
  const [vehicleManufacturers, setVehicleManufacturers] = useState([]);
  const [vehicleTransmissions, setVehicleTransmissions] = useState([]);
  const [vehicleModels, setVehicleModels] = useState([]);
  const [vehicleCountries, setVehicleCountries] = useState([]);

  /* for image handling */
  const [isOpenImageView, setIsOpenImageView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* handle add new car */
  const handleNewVehicle = async () => {
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
    }, Number(process.env.REACT_APP_BUTTON_CLICK_TIMEOUT));

    const body = {
      manufacture: newVehicleManufacture["id"],
      model: newVehicleModel["id"],
      fuel: newVehicleFuel,
      driveType: newVehicleDriveType,
      designType: newVehicleDesignType,
      transmission: newVehicleTransmission,
      licenseNumber: newVehicleLicenseNum,
      vin: newVehicleVin,
      vintage: newVehicleVintage["value"],
      ownMass: newVehicleOwnWeight,
      fullMass: newVehicleMaxWeight,
      cylinderCapacity: newVehicleCylinderCapacity,
      performance: newVehiclePerformance,
      mot: `${newVehicleDocumentValidity}`,
      nod: newVehicleDocument,
      mileage: newVehicleKm,
    };

    if (!newVehicleManufacture["id"]) {
      toast.error("Hiba! Nem adta meg járművének gyártóját!");
      return;
    }
    if (!newVehicleModel["id"]) {
      toast.error(`Hiba! Nem adta meg a járművének modelljét! Kérjük figyeljen arra, hogy 
                        a mezőbe írt értéknek megfelelőt válassza ki a legördülő listából!`);
      return;
    }
    if (!newVehicleFuel) {
      toast.error("Hiba! Nem adta meg a járművének üzemanyag típusát!");
      return;
    }
    if (!newVehicleDriveType) {
      toast.error("Hiba! Nem adta meg a járművének hajtását!");
      return;
    }
    if (!newVehicleDesignType) {
      toast.error("Hiba! Nem adta meg a járművének kivitelét!");
      return;
    }
    if (!newVehicleTransmission) {
      toast.error(
        "Hiba! Nem adta meg a járművének sebességváltójának típusát!"
      );
      return;
    }
    if (!newVehicleVin) {
      toast.error("Hiba! Nem adta meg a járműve alvázszámát!");
      return;
    }
    if (!newVehicleVintage) {
      toast.error(`Hiba! Nem, vagy hibásan adta meg a járműve évjáratát! Kérjük figyeljen arra, hogy 
                        a mezőbe írt értéknek megfelelőt válassza ki a legördülő listából!`);
      return;
    }
    if (!newVehicleOwnWeight) {
      toast.error("Hiba! Nem, vagy hibásan adta meg a járműve ön tömegét!");
      return;
    }
    if (!newVehicleMaxWeight) {
      toast.error(
        "Hiba! Nem, vagy hibásan adta meg a járműve maximális tömegét!"
      );
      return;
    }
    if (!newVehicleCylinderCapacity) {
      toast.error(
        "Hiba! Nem, vagy hibásan adta meg a járművének hengerűrtartalmát!"
      );
      return;
    }
    if (!newVehiclePerformance) {
      toast.error(
        "Hiba! Nem, vagy hibásan adta meg a járművének teljesítményét!"
      );
      return;
    }
    if (!newVehicleDocument) {
      toast.error("Hiba! Nem adta meg a járművének származási helyét!");
      return;
    }
    if (!newVehicleKm) {
      toast.error(
        "Hiba! Nem, vagy hibásan adta meg a járművének kilométerállását!"
      );
      return;
    }

    const formData = new FormData();
    formData.append("preview", newVehicleWallpaper);
    for (let i = 0; i < newVehicleGallery.length; i++) {
      formData.append("picture", newVehicleGallery[i].file);
    }
    formData.append("manufacture", body.manufacture);
    formData.append("model", body.model);
    formData.append("fuel", body.fuel);
    formData.append("designType", body.designType);
    formData.append("driveType", body.driveType);
    formData.append("transmission", body.transmission);
    formData.append("vin", body.vin);
    formData.append("vintage", body.vintage);
    formData.append("ownMass", body.ownMass);
    formData.append("fullMass", body.fullMass);
    formData.append("cylinderCapacity", body.cylinderCapacity);
    formData.append("performance", body.performance);
    formData.append("nod", body.nod);
    formData.append("mot", body.mot);
    formData.append("mileage", body.mileage);
    formData.append("licenseNumber", body.licenseNumber);

    const headers = {
      "Content-Type": "multipart/form-data",
      "x-access-token": localStorage.getItem("token"),
    };
    const response = await axiosInstance
      .post("/addVehicle", formData, { headers })
      .then((response) => {
        toast.success("Sikeresen hozzáadtál egy új járművet!");
        setIsAdding(false);
        setIsModified(true);
        setNewVehicleWallpaperInBase64(null);
        setNewVehicleWallpaper(null);
        setNewVehicleVin(null);
        setNewVehicleLicenseNum(null);
        setNewVehicleCategory(null);
        setNewVehicleManufacture(null);
        setNewVehicleDesignType(null);
        setNewVehicleModel(null);
        setNewVehicleVintage(null);
        setNewVehicleKm(null);
        setNewVehicleOwnWeight(null);
        setNewVehicleMaxWeight(null);
        setNewVehicleFuel(null);
        setNewVehicleCylinderCapacity(null);
        setNewVehiclePerformance(null);
        setNewVehicleDriveType(null);
        setNewVehicleTransmission(null);
        setNewVehicleDocument(null);
        setNewVehicleDocumentValidity(null);
        setNewVehicleGallery(null);
        setNewVehicleGalleryImageLoading(null);

        setVehicles([]);
        setVisibleVehicles([]);

        getVehicles(localStorage.getItem("token"));
      })
      .catch((error) => {
        if (error.response.status == 422) {
          toast.warning("Hiba! Nem töltöttél ki minden mezőt!");
          return;
        }

        if (error.response.status == 409) {
          toast.warning("Hiba! Ilyen alvázszámmal már létezik jármű!");
          return;
        }
      });
  };

  /* vehicle search method(s) */
  const handleVehicleSearch = (e) => {
    setSearchText(e.target.value);
  };

  /* file upload methods */
  const handleVehiclePreviewChange = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setNewVehicleWallpaperInBase64(base64);
    setNewVehicleWallpaper(file);
    e.target.value = "";
  };
  const handleNewVehicleGalleryImageDelete = (e, id) => {
    setNewVehicleGalleryImageLoading(true);
    const newAttachments = [...newVehicleGallery];

    for (let index = 0; index < newAttachments.length; index++) {
      const element = newAttachments[index];
      if (element.base64 == id) {
        element.deleted = true;
      }
    }

    setNewVehicleGallery(newAttachments);
    setNewVehicleGalleryImageLoading(false);
  };
  const handleNewVehicleGalleryUpload = async (e) => {
    setNewVehicleGalleryImageLoading(true);
    const attachments = [...newVehicleGallery];

    for (const file of e.target.files) {
      const base64 = await convertBase64(file);

      attachments.push({
        file: file,
        base64: base64,
        deleted: false,
      });
    }

    setNewVehicleGallery(attachments);
    setNewVehicleGalleryImageLoading(false);
    e.target.value = "";
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
  /* end of file upload methods */

  /* image handle methods */
  const handleOpenImage = (index) => {
    setIsOpenImageView(true);
    setCurrentIndex(index);
  };

  /* data request methods */
  const getVehicles = async (token) => {
    const response = await axiosInstance.get("getVehicles", {
      headers: {
        "x-access-token": token,
      },
    });
    const data = await response.data;
    const vehicles = JSON.parse(JSON.stringify(data.data.vehicles));
    setVehicles(vehicles);

    /* When I am searching I search in the visiblevehicles and after I back up datas from vehicles */
    setVisibleVehicles(vehicles);
    setIsModified(false);
  };
  const getVehicleFuelTypes = async (token) => {
    const response = await axiosInstance.post(
      "getFuels",
      {},
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    const data = await JSON.parse(JSON.stringify(response.data.data.fuels));
    const fuels = [];
    Array.from(data).forEach((fuelData) =>
      fuels.push({ id: fuelData._id, type: fuelData.fuel })
    );
    setVehicleFuels(fuels);
  };
  const getVehicleTypes = async (token) => {
    const response = await axiosInstance.post(
      "getCategories",
      {},
      {
        headers: {
          "x-access-token": token,
        },
      }
    );

    const data = await response.data;
    const categories = JSON.parse(JSON.stringify(data.data.categories));
    const arr = [];
    Array.from(categories).forEach((x) =>
      arr.push({ id: x._id, type: x.vehicleType })
    );
    setVehicleTypes(arr);
  };

  /* dependent methods (vehicleType) */
  const getVehicleManufacturers = async (token, vehicleType) => {
    const response = await axiosInstance.post(
      "getManufactures",
      {
        category: vehicleType,
      },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    const data = await response.data;
    const manufactures = JSON.parse(JSON.stringify(data.data.manufacture));
    const arr = [];
    Array.from(manufactures).forEach((x) =>
      arr.push({ id: x._id, manufacture: x.manufacture })
    );
    setVehicleManufacturers(arr);
  };
  const getVehicleDesignTypes = async (token, vehicleCategory) => {
    const response = await axiosInstance.post(
      "getDesignTypes",
      {
        vehicleType: vehicleCategory,
      },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    const data = await response.data;
    const types = JSON.parse(JSON.stringify(data.data.designTypes));
    const arr = [];
    Array.from(types).forEach((x) =>
      arr.push({ id: x._id, type: x.designType })
    );
    setVehicleDesignTypes(arr);
  };
  const getVehicleTransmissions = async (token, vehicleCategory) => {
    const response = await axiosInstance.post(
      "getTransmissions",
      {
        vehicleType: vehicleCategory,
      },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    const data = await response.data;
    const types = JSON.parse(JSON.stringify(data.data.transmissions));
    const arr = [];
    Array.from(types).forEach((x) =>
      arr.push({ id: x._id, transmission: x.transmission })
    );
    setVehicleTransmissions(arr);
  };
  const getVehicleDriveTypes = async (token, vehicleCategory) => {
    const response = await axiosInstance.post(
      "getDriveTypes",
      {
        vehicleType: vehicleCategory,
      },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    const data = await response.data;
    const types = JSON.parse(JSON.stringify(data.data.driveTypes));
    const arr = [];
    Array.from(types).forEach((x) =>
      arr.push({ id: x._id, type: x.driveType })
    );
    setVehicleDriveTypes(arr);
  };
  const getVehicleModels = async (token, vehicleManufacture) => {
    const response = await axiosInstance.post(
      "getModels",
      {
        manufacture: vehicleManufacture,
      },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    const data = await response.data;
    const types = JSON.parse(JSON.stringify(data.data.models));
    const arr = [];
    Array.from(types).forEach((x) => arr.push({ id: x._id, model: x.model }));
    setVehicleModels(arr);
  };
  /* end data request methods */

  /* handle searching... */
  useEffect(() => {
    let filteredVehicles = [];
    let carName = "";
    vehicles.forEach((vehicle) => {
      carName = vehicle.manufacture + " " + vehicle.model;
      if (carName.toLowerCase().startsWith(searchText.toLowerCase())) {
        filteredVehicles.push(vehicle);
      }
    });

    if (filteredVehicles.length === 0) {
      setIsSearchEmpty(true);
      setVisibleVehicles([]);
    } else {
      setVisibleVehicles(filteredVehicles);
      setIsSearchEmpty(false);
    }
  }, [searchText]);

  /* rendering base datas (fuel types, vehicle types, vehicles) */
  useEffect(() => {
    /* fixing search field bugg */
    setIsSearchEmpty(false);

    /* fill car helper variables */
    let date = new Date();
    let carCache = [];
    // y = year
    for (let y = date.getFullYear(); y >= 1950; y--) {
      carCache.push(y);
    }
    setVehicleVintages(carCache);

    /* getting datas from server */
    const token = localStorage.getItem("token");

    /* method execution order is very important! First is always the getvehicletypes */
    getVehicleFuelTypes(token);
    getVehicleTypes(token);
    getVehicles(token);

    /* end loading screen */
    setIsLoading(false);
  }, []);

  /* hanble open is vehicle menu */
  useEffect(() => {
    if (isAdding) {
      // remove old values
    }
  }, [isAdding]);

  /* handle vehicle type change */
  useEffect(() => {
    if (newVehicleCategory == null) return;

    /*  clear old states */
    setNewVehicleDesignType("");
    setNewVehicleManufacture("");
    setNewVehicleModel("");

    const token = localStorage.getItem("token");
    getVehicleManufacturers(token, newVehicleCategory);
    getVehicleDesignTypes(token, newVehicleCategory);
    getVehicleTransmissions(token, newVehicleCategory);
    getVehicleDriveTypes(token, newVehicleCategory);
  }, [newVehicleCategory]);

  /* handle vehicle manufacture change */
  useEffect(() => {
    if (!newVehicleManufacture) return;

    const token = localStorage.getItem("token");
    getVehicleModels(token, newVehicleManufacture["id"]);
  }, [newVehicleManufacture]);

  /* handle add car state variable change */
  useEffect(() => {
    let today = new Date();
    if (newVehicleVintage < 0) setNewVehicleVintage(0);
    if (newVehicleVintage < 1950) setNewVehicleVintage(0);
    if (newVehicleVintage > today.getFullYear())
      setNewVehicleVintage(today.getFullYear());
  }, [newVehicleVintage]);

  useEffect(() => {
    /* The modified variable is true when I upload a new vehicle */
    if (isModified) {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      /* method execution order is very important! First is always the getvehicletypes */
      getVehicles(token);
      setIsLoading(false);
    }
  }, [isModified]);

  /* loading screen */
  if (isLoading) {
    return (
      <React.Fragment>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Grid item>
            <MyInputSkeleton />
          </Grid>

          <Grid item>
            <MyInputSkeleton />
          </Grid>
        </Grid>

        <MyCardSkeleton />
        <MyCardSkeleton />
        <MyCardSkeleton />
      </React.Fragment>
    );
  }

  /* original screen */
  return (
    <React.Fragment>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
      >
        <Grid item>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Keresés…"
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => handleVehicleSearch(e)}
            />
          </Search>
        </Grid>

        <Grid item>
          <Button
            size="small"
            sx={{ boxShadow: "0px 0px 0px rgb(0 0 0 / 25%)" }}
            variant="contained"
            color="warning"
            startIcon={
              isAdding ? (
                <DoNotDisturbOnOutlinedIcon />
              ) : (
                <AddCircleOutlineOutlinedIcon />
              )
            }
            onClick={(e) => setIsAdding(!isAdding)}
          >
            Hozzáadás
          </Button>
        </Grid>
      </Grid>

      {/* search field texts */}
      {isSearchEmpty && <SubTitle variant="h3">Nincs ilyen jármű!</SubTitle>}

      {/* start create new car section */}
      {isAdding && (
        <>
          <SubTitle variant="h3">Új jármű rögzítése</SubTitle>

          <ContentBox>
            <Grid container direction="column">
              <Grid item>
                <CarCard>
                  <LiveImageUploadField
                    isURL={newVehicleWallpaperInBase64 ? false : true}
                    title="Előnézeti kép feltöltése"
                    image={[
                      newVehicleWallpaperInBase64
                        ? newVehicleWallpaperInBase64
                        : "https://t3.ftcdn.net/jpg/04/21/50/96/360_F_421509616_AW4LfRfbYST8T2ZT9gFGxGWfrCwr4qm4.jpg",
                    ]}
                    onAction={(e) => handleVehiclePreviewChange(e)}
                  />

                  <CarCardContent>
                    {/* általános adatok */}
                    <AddCarSubTitle variant="h4">
                      Jármű általános adatai
                    </AddCarSubTitle>

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
                          <EnergySavingsLeafOutlinedIcon />
                        </Typography>
                      </Grid>
                      <Grid item xs={11}>
                        <MyTextField
                          fullWidth
                          id="Alvázszám"
                          label="Alvázszám *"
                          type="text"
                          onChange={(e) => {
                            if (
                              newVehicleVin.length <=
                              parseInt(process.env.REACT_APP_MAXIMUM_VIN_LENGTH)
                            ) {
                              setNewVehicleVin(
                                e.target.value + "".toUpperCase()
                              );
                            } else if (
                              newVehicleVin.length >
                              parseInt(process.env.REACT_APP_MAXIMUM_VIN_LENGTH)
                            ) {
                              setErrorMessageDuringCarAdd(
                                "alvázszám",
                                "Az alvázszám nem lehet hosszabb mint 18 karakter!"
                              );
                              setNewVehicleVin("");
                            }
                          }}
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
                          <TextsmsOutlinedIcon />
                        </Typography>
                      </Grid>

                      <Grid item xs={11}>
                        <MyTextField
                          fullWidth
                          id="Rendszám"
                          label="Rendszám"
                          type="text"
                          onChange={(e) => {
                            if (
                              newVehicleLicenseNum.length <=
                              parseInt(
                                process.env
                                  .REACT_APP_MAXIMUM_LICENSE_PLATE_NUMBER_LENGTH
                              )
                            ) {
                              setNewVehicleLicenseNum(
                                e.target.value + "".toUpperCase()
                              );
                            } else if (
                              newVehicleLicenseNum.length >
                              parseInt(
                                process.env
                                  .REACT_APP_MAXIMUM_LICENSE_PLATE_NUMBER_LENGTH
                              )
                            ) {
                              setErrorMessageDuringCarAdd(
                                "rendszám",
                                "A rendszám nem lehet hosszabb mint 18 karakter!"
                              );
                              setNewVehicleLicenseNum("");
                            }
                          }}
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
                          <DirectionsCarFilledOutlinedIcon />
                        </Typography>
                      </Grid>

                      <Grid item xs={11}>
                        <MyFormControll fullWidth>
                          <InputLabel id="Jármű kategória">
                            Jármű kategória *
                          </InputLabel>
                          <Select
                            labelId="Jármű kategória *"
                            id="Jármű kategória *"
                            label="Jármű kategória *"
                            onChange={(e) =>
                              setNewVehicleCategory(e.target.value)
                            }
                            value={newVehicleCategory}
                            defaultValue={vehicleTypes[0].id}
                          >
                            {vehicleTypes.map((x, i) => {
                              return (
                                <MenuItem key={x + i} value={`${x.id}`}>
                                  {x.type}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </MyFormControll>
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
                          <DiscountOutlinedIcon />
                        </Typography>
                      </Grid>

                      <Grid item xs={11}>
                        <MyFormControll fullWidth>
                          <Autocomplete
                            fullWidth
                            disablePortal
                            id="Jármű márkája"
                            options={vehicleManufacturers.map((x, i) => {
                              return {
                                label: x.manufacture,
                                id: x.id,
                              };
                            })}
                            value={newVehicleManufacture["label"]}
                            onChange={(event, newValue) => {
                              setNewVehicleManufacture(
                                newValue ? newValue : " "
                              );
                            }}
                            renderInput={(params) => (
                              <TextField {...params} label="Jármű márkája **" />
                            )}
                          />
                        </MyFormControll>
                        <Typography variant="body1" sx={{ opacity: "0.6" }}>
                          * Kérjük, hogy a mezőbe írt értéknek megfelelőt
                          válassza ki a legördülő listából.
                        </Typography>
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
                          <AccountTreeOutlinedIcon />
                        </Typography>
                      </Grid>

                      <Grid item xs={11}>
                        <MyFormControll fullWidth>
                          <Autocomplete
                            fullWidth
                            disablePortal
                            id="Jármű modell"
                            options={vehicleModels.map((x, i) => {
                              return {
                                label: x.model,
                                id: x.id,
                              };
                            })}
                            value={newVehicleModel["label"]}
                            onChange={(event, newValue) => {
                              setNewVehicleModel(newValue ? newValue : " ");
                            }}
                            renderInput={(params) => (
                              <TextField {...params} label="Jármű modell **" />
                            )}
                          />
                        </MyFormControll>
                        <Typography variant="body1" sx={{ opacity: "0.6" }}>
                          * Kérjük, hogy a mezőbe írt értéknek megfelelőt
                          válassza ki a legördülő listából.
                        </Typography>
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
                          <CarTypeIcon />
                        </Typography>
                      </Grid>

                      <Grid item xs={11}>
                        <MyFormControll fullWidth>
                          <InputLabel id="Kivitel-beviteli-mezo">
                            Kivitel *
                          </InputLabel>
                          <Select
                            labelId="Kivitel"
                            id="Kivitel"
                            label="Kivitel *"
                            onChange={(e) =>
                              setNewVehicleDesignType(e.target.value)
                            }
                            value={newVehicleDesignType}
                            MenuProps={MenuProps}
                          >
                            {vehicleDesignTypes.map((x, i) => {
                              return (
                                <MenuItem key={x + i} value={x.id}>
                                  {x.type}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </MyFormControll>
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
                          <DateIcon />
                        </Typography>
                      </Grid>

                      <Grid item xs={11}>
                        <MyFormControll fullWidth>
                          <Autocomplete
                            fullWidth
                            disablePortal
                            id="jarmu-évjáratok"
                            options={Array.from(vehicleVintages).map(
                              (year, i) => {
                                return {
                                  label: `${year}`,
                                  value: year,
                                };
                              }
                            )}
                            value={newVehicleVintage["label"]}
                            onChange={(event, newValue) => {
                              setNewVehicleVintage(newValue ? newValue : " ");
                            }}
                            renderInput={(params) => (
                              <TextField {...params} label="Jármű évjárat *" />
                            )}
                          />
                        </MyFormControll>
                      </Grid>
                    </Grid>
                    {/* ----- általános adatok */}

                    {/* Jármű adatok */}
                    <AddCarSubTitle variant="h4">Jármű adatai</AddCarSubTitle>

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

                      <Grid item xs={11}>
                        <MyTextField
                          fullWidth
                          id="outlined-disabled"
                          label="Km. óra állás *"
                          type="number"
                          onChange={(e) => {
                            let kmInput = parseInt(e.target.value + "");

                            if (kmInput <= 0) {
                              setErrorMessageDuringCarAdd(
                                "km",
                                "Ez a mező nem lehet kisebb mint 0!"
                              );
                              setNewVehicleKm(null);
                              return;
                            } else if (
                              kmInput >=
                              parseInt(process.env.REACT_APP_MAXIMUM_KM)
                            ) {
                              setErrorMessageDuringCarAdd(
                                "km",
                                `Ez a mező nem lehet nagyobb mint ${process.env.REACT_APP_MAXIMUM_KM} km!`
                              );
                              setNewVehicleKm(null);
                              return;
                            }
                            setNewVehicleKm(kmInput);
                          }}
                        />
                        <Typography variant="body1" sx={{ opacity: 0.7 }}>
                          * Ezen mező értéke 1 és{" "}
                          {process.env.REACT_APP_MAXIMUM_KM} km lehet!
                        </Typography>
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
                          <CarWeightIcon />
                        </Typography>
                      </Grid>

                      <Grid item xs={11}>
                        <MyTextField
                          fullWidth
                          id="outlined-disabled"
                          label="Saját tömeg *"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="start">
                                kg
                              </InputAdornment>
                            ),
                          }}
                          default={0}
                          type="number"
                          onChange={(e) => {
                            let weight = parseInt(e.target.value);
                            if (weight <= 0) {
                              setErrorMessageDuringCarAdd(
                                "önsúly",
                                "Ez a mező nem lehet kisebb mint 0!"
                              );
                              setNewVehicleOwnWeight(null);
                              return;
                            } else if (
                              weight >
                              parseInt(process.env.REACT_APP_MAXIMUM_WEIGHT)
                            ) {
                              if (weight < 0) {
                                setErrorMessageDuringCarAdd(
                                  "önsúly",
                                  `Ez a mező nem lehet nagyobb mint ${parseInt(
                                    process.env.REACT_APP_MAXIMUM_WEIGHT
                                  )} kg!`
                                );
                                setNewVehicleOwnWeight(null);
                                return;
                              }
                            }

                            setNewVehicleOwnWeight(weight);
                          }}
                        />
                        <Typography variant="body1" sx={{ opacity: 0.7 }}>
                          * Ezen mező értéke 1 és{" "}
                          {process.env.REACT_APP_MAXIMUM_WEIGHT} kg lehet!
                        </Typography>
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
                          <CarWeightIcon />
                        </Typography>
                      </Grid>

                      <Grid item xs={11}>
                        <MyTextField
                          fullWidth
                          id="outlined-disabled"
                          label="Teljes tömeg *"
                          default={0}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="start">
                                kg
                              </InputAdornment>
                            ),
                          }}
                          type="number"
                          onChange={(e) => {
                            let weight = parseInt(e.target.value);
                            if (weight < 0) {
                              setErrorMessageDuringCarAdd(
                                "teljes tömeg",
                                "Ez a mező nem lehet kisebb mint 0!"
                              );
                              setNewVehicleMaxWeight(null);
                              return;
                            } else if (
                              weight >
                              parseInt(process.env.REACT_APP_MAXIMUM_WEIGHT)
                            ) {
                              if (weight < 0) {
                                setErrorMessageDuringCarAdd(
                                  "teljes tömeg",
                                  `Ez a mező nem lehet nagyobb mint ${process.env.REACT_APP_MAXIMUM_WEIGHT} kg!`
                                );
                                setNewVehicleMaxWeight(null);
                                return;
                              }
                            }

                            setNewVehicleMaxWeight(weight);
                          }}
                        />
                        <Typography variant="body1" sx={{ opacity: 0.7 }}>
                          * Ezen mező értéke 1 és{" "}
                          {process.env.REACT_APP_MAXIMUM_WEIGHT} kg lehet!
                        </Typography>
                      </Grid>
                    </Grid>
                    {/* ----- Jármű adatok */}

                    {/* Motor adatok */}
                    <AddCarSubTitle variant="h4">
                      Jármű motor adatai
                    </AddCarSubTitle>

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
                          <FuelIcon />
                        </Typography>
                      </Grid>

                      <Grid item xs={11}>
                        <MyFormControll fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Üzemanyag *
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Üzemanyag *"
                            onChange={(e) => setNewVehicleFuel(e.target.value)}
                            value={newVehicleFuel}
                            MenuProps={MenuProps}
                          >
                            {vehicleFuels.map((x, i) => {
                              return (
                                <MenuItem key={i + x} value={x.id}>
                                  {x.type}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </MyFormControll>
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
                          <TankIcon />
                        </Typography>
                      </Grid>

                      <Grid item xs={11}>
                        <MyTextField
                          fullWidth
                          id="outlined-disabled"
                          label="Hengerűrtartalom *"
                          type="number"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="start">
                                cm<sup>3</sup>
                              </InputAdornment>
                            ),
                          }}
                          default={500}
                          onChange={(e) => {
                            let amount = parseInt(e.target.value);
                            if (amount < 0) {
                              setErrorMessageDuringCarAdd(
                                "hengerűrtartalom",
                                "Ez a mező nem lehet kisebb mint 0!"
                              );
                              setNewVehicleCylinderCapacity(null);
                              return;
                            } else if (
                              amount >
                              parseInt(
                                process.env.REACT_APP_MAXIMUM_CYLINDER_CAPACITY
                              )
                            ) {
                              if (amount < 0) {
                                setErrorMessageDuringCarAdd(
                                  "hengerűrtartalom",
                                  `Ez a mező nem lehet nagyobb mint ${process.env.REACT_APP_MAXIMUM_CYLINDER_CAPACITY}!`
                                );
                                setNewVehicleCylinderCapacity(null);
                                return;
                              }
                            }

                            setNewVehicleCylinderCapacity(amount);
                          }}
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
                          <PerformanceIcon />
                        </Typography>
                      </Grid>

                      <Grid item xs={11}>
                        <Grid container direction="row">
                          <Grid item xs>
                            <MyTextField
                              fullWidth
                              id="outlined-disabled"
                              label="Teljesítmény *"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="start">
                                    LE
                                  </InputAdornment>
                                ),
                              }}
                              default={0}
                              type="number"
                              onChange={(e) => {
                                let amount = parseInt(e.target.value);
                                if (amount < 0) {
                                  setErrorMessageDuringCarAdd(
                                    "teljesítmény (le)",
                                    "Ez a mező nem lehet kisebb mint 0!"
                                  );
                                  setNewVehiclePerformance(null);
                                  return;
                                } else if (
                                  amount >
                                  parseInt(
                                    process.env.REACT_APP_MAXIMUM_PERFORMANCE_LE
                                  )
                                ) {
                                  if (amount < 0) {
                                    setErrorMessageDuringCarAdd(
                                      "teljesítmény (le)",
                                      `Ez a mező nem lehet nagyobb mint ${process.env.REACT_APP_MAXIMUM_PERFORMANCE_LE}!`
                                    );
                                    setNewVehiclePerformance(null);
                                    return;
                                  }
                                }

                                setNewVehiclePerformance(amount);
                              }}
                            />
                          </Grid>
                        </Grid>
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
                          <WheelIcon />
                        </Typography>
                      </Grid>

                      <Grid item xs={11}>
                        <MyFormControll fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Hajtás *
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Hajtás *"
                            onChange={(e) =>
                              setNewVehicleDriveType(e.target.value)
                            }
                            value={newVehicleDriveType}
                            defaultValue={"hatso"}
                            MenuProps={MenuProps}
                          >
                            {vehicleDriveTypes.map((x, i) => {
                              return (
                                <MenuItem key={i + "xasda2"} value={x.id}>
                                  {x.type}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </MyFormControll>
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
                          <ChangeGearIcon />
                        </Typography>
                      </Grid>

                      <Grid item xs={11}>
                        <MyFormControll fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Sebességváltó *
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Sebességváltó"
                            onChange={(e) =>
                              setNewVehicleTransmission(e.target.value)
                            }
                            value={newVehicleTransmission}
                            MenuProps={MenuProps}
                          >
                            {vehicleTransmissions.map((x, i) => {
                              return (
                                <MenuItem key={i + "xasda2"} value={x.id}>
                                  {x.transmission}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </MyFormControll>
                      </Grid>
                    </Grid>
                    {/* ----- Motor adatok */}

                    <AddCarSubTitle variant="h4">Jármű okmányai</AddCarSubTitle>

                    {/* Okmányok */}
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
                          label="Okmányok jellege **"
                          type="text"
                          onChange={(e) =>
                            setNewVehicleDocument(e.target.value)
                          }
                        />
                        <Typography variant="body1" sx={{ opacity: "0.6" }}>
                          * Az okmányok jellege a jármű származási helyét várja
                          értékül.
                        </Typography>
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
                          <DocumentsIcon />
                        </Typography>
                      </Grid>

                      <Grid item xs={11}>
                        <MyTextField
                          fullWidth
                          id="outlined-disabled"
                          default={new Date().toLocaleDateString("en-CA")}
                          value={newVehicleDocumentValidity}
                          type="date"
                          onChange={(e) => {
                            setNewVehicleDocumentValidity(
                              moment(e.target.value).format("YYYY-MM-DD")
                            );
                          }}
                        />
                      </Grid>
                    </Grid>
                    {/* ----- end of Okmányok */}

                    <AddCarSubTitle variant="h4">Képgaléria</AddCarSubTitle>

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
                          multiple
                          onChange={(e) => handleNewVehicleGalleryUpload(e)}
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
                      {!newVehicleGalleryImageLoading &&
                        Array.from(newVehicleGallery).map((obj, i) => {
                          return (
                            !obj.deleted && (
                              <Grid item key={obj + "" + i}>
                                <ImageItem
                                  key={obj + "asd" + i}
                                  isURL={false}
                                  isOwnImageView={false}
                                  hasCustomClick={true}
                                  image={obj.base64}
                                  onCustomClick={(e) => handleOpenImage(i)}
                                  onDeleteAction={(e) =>
                                    handleNewVehicleGalleryImageDelete(
                                      e,
                                      obj.base64
                                    )
                                  }
                                />
                              </Grid>
                            )
                          );
                        })}
                    </Grid>
                  </CarCardContent>

                  <CarCardActions>
                    <Button
                      size="small"
                      sx={{ marginLeft: "auto" }}
                      variant="contained"
                      color="warning"
                      onClick={(e) => setIsAdding(false)}
                    >
                      Mégsem
                    </Button>
                    {isSent ? (
                      <Button size="small" variant="contained" disabled>
                        Mentés
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={(e) => handleNewVehicle(e)}
                      >
                        Mentés
                      </Button>
                    )}
                  </CarCardActions>
                </CarCard>
              </Grid>
            </Grid>

            {AddCarErrorMessageBox && (
              <ContentBox>
                <Typography variant="h4" color="error">
                  {AddCarErrorMessageBox}
                </Typography>
              </ContentBox>
            )}
          </ContentBox>
        </>
      )}
      {/* end of create new car */}

      {visibleVehicles.length == 0 && !isSearchEmpty && (
        <Typography variant="h4">Jelenleg nincs járműved!</Typography>
      )}

      {visibleVehicles.length > 0 &&
        visibleVehicles.map((vehicle, i) => {
          return (
            <VehicleCard
              key={vehicle + " " + i}
              vehicle={vehicle}
              i={i}
              handleChangeTab={handleChangeTab}
            />
          );
        })}

      {/* New uploaded vehicle's images */}
      {isOpenImageView && (
        <ImageViewer
          isURL={false}
          images={
            !newVehicleGalleryImageLoading &&
            Array.from(newVehicleGallery).map((obj, i) => {
              return !obj.deleted && obj.base64;
            })
          }
          index={currentIndex}
          open={isOpenImageView}
          onClose={(e) => setIsOpenImageView(false)}
        />
      )}
    </React.Fragment>
  );
}

export default Garage;
