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
import NewVehicleVinInput from "../components/garage/NewVehicleVinInput.component";
import NewVehicleLicenseNumberInput from "../components/garage/NewVehicleLicenseNumberInput.component";
import NewVehicleCategoryInput from "../components/garage/NewVehicleCategoryInput.component";
import NewVehicleBrandInput from "../components/garage/NewVehicleBrandInput.component";
import NewVehicleModelInput from "../components/garage/NewVehicleModelInput.component";
import NewVehicleDesignTypeInput from "../components/garage/NewVehicleDesignTypeInput.component";
import NewVehicleVintagesInput from "../components/garage/NewVehicleVintagesInput.component";
import NewVehicleKMInput from "../components/garage/NewVehicleKmInput.component";
import NewVehicleOwnMassInput from "../components/garage/NewVehicleOwnMassInput.component";
import NewVehicleFullMassInput from "../components/garage/NewVehicleFullMassInput.component";
import NewVehicleFuelInput from "../components/garage/NewVehicleFuelInput.component";
import NewVehicleCylinderCapacityInput from "../components/garage/NewVehicleCylinderCapacityInput.component";
import NewVehiclePerformanceInput from "../components/garage/NewVehiclePerformanceInput.component";
import NewVehicleDriveTypeInput from "../components/garage/NewVehicleDriveTypeInput.component";
import NewVehicleChangeGearInput from "../components/garage/NewVehicleChangeGearInput.component";
import NewVehicleNODInput from "../components/garage/NewVehicleNODInput.component";
import NewVehicleMOTInput from "../components/garage/NewVehicleMOTInput.component";
import {
  AllowedMimeTypes,
  getFileMimeType,
  isValidFileMimeType,
} from "../lib/FileUploader";

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

    if (newVehicleVin.length < process.env.REACT_APP_MAXIMUM_VIN_LENGTH) {
      toast.error("Hiba! Az alv??zsz??m hossza nem megfelel??!");
      return;
    }

    if (!newVehicleManufacture["id"]) {
      toast.error("Hiba! Nem adta meg j??rm??v??nek gy??rt??j??t!");
      return;
    }
    if (!newVehicleModel["id"]) {
      toast.error(`Hiba! Nem adta meg a j??rm??v??nek modellj??t! K??rj??k figyeljen arra, hogy 
                        a mez??be ??rt ??rt??knek megfelel??t v??lassza ki a leg??rd??l?? list??b??l!`);
      return;
    }
    if (!newVehicleFuel) {
      toast.error("Hiba! Nem adta meg a j??rm??v??nek ??zemanyag t??pus??t!");
      return;
    }
    if (!newVehicleDriveType) {
      toast.error("Hiba! Nem adta meg a j??rm??v??nek hajt??s??t!");
      return;
    }
    if (!newVehicleDesignType) {
      toast.error("Hiba! Nem adta meg a j??rm??v??nek kivitel??t!");
      return;
    }
    if (!newVehicleTransmission) {
      toast.error(
        "Hiba! Nem adta meg a j??rm??v??nek sebess??gv??lt??j??nak t??pus??t!"
      );
      return;
    }
    if (!newVehicleVin) {
      toast.error("Hiba! Nem adta meg a j??rm??ve alv??zsz??m??t!");
      return;
    }
    if (!newVehicleVintage) {
      toast.error(`Hiba! Nem, vagy hib??san adta meg a j??rm??ve ??vj??rat??t! K??rj??k figyeljen arra, hogy 
                        a mez??be ??rt ??rt??knek megfelel??t v??lassza ki a leg??rd??l?? list??b??l!`);
      return;
    }
    if (!newVehicleOwnWeight) {
      toast.error("Hiba! Nem, vagy hib??san adta meg a j??rm??ve ??n t??meg??t!");
      return;
    }
    if (!newVehicleMaxWeight) {
      toast.error(
        "Hiba! Nem, vagy hib??san adta meg a j??rm??ve maxim??lis t??meg??t!"
      );
      return;
    }
    if (!newVehicleCylinderCapacity) {
      toast.error(
        "Hiba! Nem, vagy hib??san adta meg a j??rm??v??nek henger??rtartalm??t!"
      );
      return;
    }
    if (!newVehiclePerformance) {
      toast.error(
        "Hiba! Nem, vagy hib??san adta meg a j??rm??v??nek teljes??tm??ny??t!"
      );
      return;
    }
    if (!newVehicleDocument) {
      toast.error("Hiba! Nem adta meg a j??rm??v??nek sz??rmaz??si hely??t!");
      return;
    }
    if (!newVehicleKm) {
      toast.error(
        "Hiba! Nem, vagy hib??san adta meg a j??rm??v??nek kilom??ter??ll??s??t!"
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
        toast.success("Sikeresen hozz??adt??l egy ??j j??rm??vet!");
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
          toast.warning("Hiba! Nem t??lt??tt??l ki minden mez??t!");
          return;
        }

        if (error.response.status == 409) {
          toast.warning("Hiba! Ilyen alv??zsz??mmal m??r l??tezik j??rm??!");
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
    const isValidMimeType = isValidFileMimeType(e.target.files[0]);
    if (!isValidMimeType) {
      toast.error(
        `Hiba! A felt??lteni k??v??nt ??llom??ny kiterjeszt??se nem t??mogatott! (.${getFileMimeType(
          e.target.files[0]
        )}) `
      );
      e.target.value = "";
      return;
    }

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
    const isValidMimeType = isValidFileMimeType(e.target.files[0]);
    if (!isValidMimeType) {
      toast.error(
        `Hiba! A felt??lteni k??v??nt ??llom??ny kiterjeszt??se nem t??mogatott! (.${getFileMimeType(
          e.target.files[0]
        )}) `
      );
      e.target.value = "";
      return;
    }

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
              placeholder="Keres??s???"
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
            Hozz??ad??s
          </Button>
        </Grid>
      </Grid>

      {/* search field texts */}
      {isSearchEmpty && <SubTitle variant="h3">Nincs ilyen j??rm??!</SubTitle>}

      {/* start create new car section */}
      {isAdding && (
        <>
          <SubTitle variant="h3">??j j??rm?? r??gz??t??se</SubTitle>

          <ContentBox>
            <Grid container direction="column">
              <Grid item>
                <CarCard>
                  <LiveImageUploadField
                    isURL={newVehicleWallpaperInBase64 ? false : true}
                    title="El??n??zeti k??p felt??lt??se"
                    image={[
                      newVehicleWallpaperInBase64
                        ? newVehicleWallpaperInBase64
                        : "https://t3.ftcdn.net/jpg/04/21/50/96/360_F_421509616_AW4LfRfbYST8T2ZT9gFGxGWfrCwr4qm4.jpg",
                    ]}
                    onAction={(e) => handleVehiclePreviewChange(e)}
                  />

                  <CarCardContent>
                    {/* ??ltal??nos adatok */}
                    <AddCarSubTitle variant="h4">
                      J??rm?? ??ltal??nos adatai
                    </AddCarSubTitle>

                    {/* NEXT TIME: I have to that the users do not enter long sentences into the input fields. */}

                    <NewVehicleVinInput
                      newVehicleVin={newVehicleVin}
                      setNewVehicleVin={setNewVehicleVin}
                      setErrorMessageDuringCarAdd={setErrorMessageDuringCarAdd}
                    />
                    <NewVehicleLicenseNumberInput
                      setErrorMessageDuringCarAdd={setErrorMessageDuringCarAdd}
                      newVehicleLicenseNum={newVehicleLicenseNum}
                      setNewVehicleLicenseNum={setNewVehicleLicenseNum}
                    />
                    <NewVehicleCategoryInput
                      vehicleTypes={vehicleTypes}
                      newVehicleCategory={newVehicleCategory}
                      setNewVehicleCategory={setNewVehicleCategory}
                    />
                    <NewVehicleBrandInput
                      vehicleManufacturers={vehicleManufacturers}
                      newVehicleManufacture={newVehicleManufacture}
                      setNewVehicleManufacture={setNewVehicleManufacture}
                    />
                    <NewVehicleModelInput
                      vehicleModels={vehicleModels}
                      setNewVehicleModel={setNewVehicleModel}
                      newVehicleModel={newVehicleModel}
                    />
                    <NewVehicleDesignTypeInput
                      MenuProps={MenuProps}
                      vehicleDesignTypes={vehicleDesignTypes}
                      setNewVehicleDesignType={setNewVehicleDesignType}
                      newVehicleDesignType={newVehicleDesignType}
                    />
                    <NewVehicleVintagesInput
                      setNewVehicleVintage={setNewVehicleVintage}
                      newVehicleVintage={newVehicleVintage}
                      vehicleVintages={vehicleVintages}
                    />

                    {/* ----- ??ltal??nos adatok */}

                    {/* J??rm?? adatok */}
                    <AddCarSubTitle variant="h4">J??rm?? adatai</AddCarSubTitle>

                    <NewVehicleKMInput
                      newVehicleKm={newVehicleKm}
                      setErrorMessageDuringCarAdd={setErrorMessageDuringCarAdd}
                      setNewVehicleKm={setNewVehicleKm}
                    />
                    <NewVehicleOwnMassInput
                      newVehicleOwnWeight={newVehicleOwnWeight}
                      setErrorMessageDuringCarAdd={setErrorMessageDuringCarAdd}
                      setNewVehicleOwnWeight={setNewVehicleOwnWeight}
                    />
                    <NewVehicleFullMassInput
                      newVehicleMaxWeight={newVehicleMaxWeight}
                      setNewVehicleMaxWeight={setNewVehicleMaxWeight}
                      setErrorMessageDuringCarAdd={setErrorMessageDuringCarAdd}
                    />

                    {/* ----- J??rm?? adatok */}

                    {/* Motor adatok */}
                    <AddCarSubTitle variant="h4">
                      J??rm?? motor adatai
                    </AddCarSubTitle>

                    <NewVehicleFuelInput
                      setNewVehicleFuel={setNewVehicleFuel}
                      vehicleFuels={vehicleFuels}
                      newVehicleFuel={newVehicleFuel}
                      MenuProps={MenuProps}
                    />
                    <NewVehicleCylinderCapacityInput
                      newVehicleCylinderCapacity={newVehicleCylinderCapacity}
                      setErrorMessageDuringCarAdd={setErrorMessageDuringCarAdd}
                      setNewVehicleCylinderCapacity={
                        setNewVehicleCylinderCapacity
                      }
                    />
                    <NewVehiclePerformanceInput
                      newVehiclePerformance={newVehiclePerformance}
                      setErrorMessageDuringCarAdd={setErrorMessageDuringCarAdd}
                      setNewVehiclePerformance={setNewVehiclePerformance}
                    />
                    <NewVehicleDriveTypeInput
                      setNewVehicleDriveType={setNewVehicleDriveType}
                      newVehicleDriveType={newVehicleDriveType}
                      MenuProps={MenuProps}
                      vehicleDriveTypes={vehicleDriveTypes}
                    />
                    <NewVehicleChangeGearInput
                      newVehicleTransmission={newVehicleTransmission}
                      setNewVehicleTransmission={setNewVehicleTransmission}
                      MenuProps={MenuProps}
                      vehicleTransmissions={vehicleTransmissions}
                    />
                    {/* ----- Motor adatok */}

                    <AddCarSubTitle variant="h4">J??rm?? okm??nyai</AddCarSubTitle>

                    {/* Okm??nyok */}
                    <NewVehicleNODInput
                      setNewVehicleDocument={setNewVehicleDocument}
                    />

                    <NewVehicleMOTInput
                      newVehicleDocumentValidity={newVehicleDocumentValidity}
                      setNewVehicleDocumentValidity={
                        setNewVehicleDocumentValidity
                      }
                    />
                    {/* ----- end of Okm??nyok */}

                    <AddCarSubTitle variant="h4">K??pgal??ria</AddCarSubTitle>

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
                          inputProps={{
                            accept:
                              "image/jpeg, image/jpg, image/png, image/webp",
                          }}
                          helperText={`* Enged??lyezett ??llom??ny kiterjeszt??sek (${AllowedMimeTypes.map(
                            (x) => ` ${x}`
                          )})`}
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
                      M??gsem
                    </Button>
                    {isSent ? (
                      <Button size="small" variant="contained" disabled>
                        Ment??s
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={(e) => handleNewVehicle(e)}
                      >
                        Ment??s
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
        <Typography variant="h4">Jelenleg nincs j??rm??ved!</Typography>
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
