import React, { useEffect, useState } from "react";
import {
  axios,
  toast,
  Link,
  Button,
  Grid,
  styled,
  TextField,
  Typography,
  Input,
} from "../lib/GlobalImports";
import {
  MyCircularSkeleton,
  MyFullWidthInputSkeleton,
  MyInputSkeleton,
} from "../lib/Skeletons";
import {
  SubTitle,
  MyGridItem,
  FormCancelButton,
  FormActionButton,
  AvatarImage,
} from "../lib/StyledComponents";
import { axiosInstance } from "../lib/GlobalConfigs";
import useAuth from "../hooks/useAuth";
import ImageViewer from "../components/ImageViewer.component";

function Settings({ handleChangeTab }) {
  /* getting context data */
  const { auth, setAuth } = useAuth();

  /* loading screen variables */
  const [isLoading, setIsLoading] = useState(true);
  const [isSent, setIsSent] = useState(false);
  const [isOpenImageView, setIsOpenImageView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [picture, setPicture] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [home, setHome] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");
  const [changePasswordError, setChangePasswordError] = useState(null);
  const [oldPasswordError, setOldPasswordError] = useState(null);
  const [formUnderProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setPicture({
      url: auth.user.picture,
      file: null,
      modified: false,
      base64: null,
    });
    setFirstName(auth.user.fName);
    setLastName(auth.user.lName);
    setEmail(auth.user.email);
    setHome(auth.user.home);
    setPhoneNumber(auth.user.phone);
    setIsLoading(false);
  }, []);

  const handleProfileImageChange = async (e) => {
    setIsProcessing(true);
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setPicture({
      url: auth.user.picture,
      file: file,
      modified: true,
      base64: base64,
    });
    setIsProcessing(false);
  };

  // put it to global function
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

  const getUserDatas = async (token) => {
    const response = await axiosInstance.get("getUserData", {
      headers: {
        "x-access-token": token,
      },
    });
    let user = response.data.data.user;
    let highestRole = 2001;
    Array.from(user.roles).forEach((role) => {
      if (role > highestRole) {
        highestRole = role;
      }
    });
    const role = highestRole;

    setPicture({
      url: user.picture,
      file: null,
      modified: false,
      base64: null,
    });
    setFirstName(user.fName);
    setLastName(user.lName);
    setEmail(user.email);
    setHome(user.home);
    setPhoneNumber(user.phone);

    setAuth({ user, token, role });
  };

  const handleUpdateUser = async (e) => {
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
    }, Number(process.env.REACT_APP_BUTTON_CLICK_TIMEOUT));
    e.preventDefault();
    if (formUnderProcessing) return;

    const formData = new FormData();

    setOldPasswordError(null);
    setChangePasswordError(null);
    let changedSomething = false;

    // password changing
    if (password) {
      if (newPassword !== reNewPassword) {
        setChangePasswordError("A két jelszó nem stimmel!");
        toast.error(changePasswordError);
        return;
      }

      if (newPassword.length < 8 || reNewPassword.length < 8) {
        toast.error("Az új jelszavaknak legalább 8 karakternek kell lennie!");
        return;
      }

      formData.append("oldPassword", password);
      formData.append("newPassword", newPassword);
      changedSomething = true;
    } else {
      if (newPassword || reNewPassword) {
        toast.error("Opss! Kérlek töltsd ki az összes jelszó mezőt!");
      }
    }

    if (auth.user.fName !== firstName) {
      changedSomething = true;
      formData.append("fName", firstName);
    }
    if (auth.user.lName !== lastName) {
      changedSomething = true;
      formData.append("lName", lastName);
    }
    if (auth.user.home !== home) {
      changedSomething = true;
      formData.append("home", home);
    }
    if (auth.user.phone !== phoneNumber) {
      changedSomething = true;
      formData.append("phone", phoneNumber);
    }

    // profile picture
    if (picture.modified) {
      changedSomething = true;
      formData.append("picture", picture.file);
    }

    if (changedSomething) {
      const headers = {
        "Content-Type": "multipart/form-data",
        "x-access-token": localStorage.getItem("token"),
      };
      await axiosInstance
        .put("updateUser", formData, { headers })
        .then((res) => {
          getUserDatas(localStorage.getItem("token"));
          toast.success("Sikeresen frissítetted a fiókodat!");
        })
        .catch((err) => {
          toast.error("Hiba! A felhasználói felület modósítása meghiúsult!");
        });
    }
  };

  const handleOpenImage = (index) => {
    setIsOpenImageView(true);
    setCurrentIndex(index);
  };

  const handleLastNameChange = (e) => {
    if (`${e.target.value}`.length > 30) {
      setLastName(`${e.target.value}`.substring(0, 30));
    } else {
      setLastName(e.target.value);
    }
  };

  const handleFirstNameChange = (e) => {
    if (`${e.target.value}`.length > 25) {
      setFirstName(`${e.target.value}`.substring(0, 30));
    } else {
      setFirstName(e.target.value);
    }
  };

  const handleTelephoneNumberChange = (e) => {
    if (`${e.target.value}`.length > 12) {
      setPhoneNumber(`${e.target.value}`.substring(0, 12));
    } else {
      setPhoneNumber(e.target.value);
    }
  };

  const handleCountryChange = (e) => {
    if (`${e.target.value}`.length > 56) {
      setHome(`${e.target.value}`.substring(0, 56));
    } else {
      setHome(e.target.value);
    }
  };

  if (isLoading) {
    return (
      <React.Fragment>
        <form onSubmit={handleUpdateUser}>
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <MyGridItem item>
              <Grid container direction="row" spacing={1.5}>
                <Grid item id="WallpaperItem">
                  <MyCircularSkeleton variant="circular" />
                </Grid>

                <Grid item>
                  <SubTitle variant="h3">Profilkép beállítások</SubTitle>

                  <Grid container direction="column" sx={{ marginTop: "auto" }}>
                    <MyFullWidthInputSkeleton />
                  </Grid>
                </Grid>
              </Grid>
            </MyGridItem>

            <MyGridItem item>
              <SubTitle variant="h3">Felhasználói adatok</SubTitle>

              <Grid container direction="column" spacing={1.5}>
                <Grid item>
                  <MyFullWidthInputSkeleton />
                </Grid>
                <Grid item>
                  <MyFullWidthInputSkeleton />
                </Grid>
                <Grid item>
                  <MyFullWidthInputSkeleton />
                </Grid>
              </Grid>
            </MyGridItem>

            <MyGridItem item>
              <SubTitle variant="h3">Jelszó beállítások</SubTitle>

              <Grid container direction="column" spacing={1.5}>
                <Grid item>
                  <MyFullWidthInputSkeleton />
                </Grid>
                <Grid item>
                  <MyFullWidthInputSkeleton />
                </Grid>
                <Grid item>
                  <MyFullWidthInputSkeleton />
                </Grid>
              </Grid>
            </MyGridItem>

            <MyGridItem item>
              <Grid
                container
                direction="row"
                spacing={1.5}
                justifyContent="flex-end"
              >
                <MyInputSkeleton />
                <MyInputSkeleton />
              </Grid>
            </MyGridItem>
          </Grid>
        </form>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <form onSubmit={handleUpdateUser}>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <MyGridItem item>
            <Grid container direction="row" spacing={1.5}>
              <Grid item id="WallpaperItem">
                <AvatarImage
                  onClick={(e) => handleOpenImage(0)}
                  src={
                    picture.modified
                      ? picture.base64
                      : picture.url
                      ? picture.url
                      : "https://media.istockphoto.com/id/1016744004/vector/profile-placeholder-image-gray-silhouette-no-photo.jpg?s=612x612&w=0&k=20&c=mB6A9idhtEtsFXphs1WVwW_iPBt37S2kJp6VpPhFeoA="
                  }
                  alt="profile image"
                  id="wallpaperIMG"
                />
              </Grid>

              <Grid item>
                <SubTitle variant="h3">Profilkép beállítása</SubTitle>

                <Grid container direction="column" sx={{ marginTop: "auto" }}>
                  <TextField
                    inputProps={{ accept: "image/*" }}
                    fullWidth
                    name="wallpaper"
                    placeholder="Kép kiválasztása..."
                    type="file"
                    onChange={(e) => handleProfileImageChange(e)}
                  />
                </Grid>
              </Grid>
            </Grid>
          </MyGridItem>

          <MyGridItem item>
            <SubTitle variant="h3">Felhasználói adatok</SubTitle>

            <Grid container direction="column" spacing={1.5}>
              <Grid item>
                <TextField
                  disabled
                  fullWidth
                  label="Felhasználói e-mail"
                  defaultValue={email}
                />
              </Grid>

              <Grid item>
                <TextField
                  fullWidth
                  label="Keresztnév:"
                  value={firstName}
                  type="text"
                  onChange={(e) => handleFirstNameChange(e)}
                />
              </Grid>

              <Grid item>
                <TextField
                  fullWidth
                  label="Családnév:"
                  value={lastName}
                  type="text"
                  onChange={(e) => handleLastNameChange(e)}
                />
              </Grid>

              <Grid item>
                <TextField
                  fullWidth
                  label="Telefonszám"
                  type="tel"
                  defaultValue={phoneNumber}
                  value={phoneNumber}
                  onChange={(e) => handleTelephoneNumberChange(e)}
                />
              </Grid>

              <Grid item>
                <TextField
                  fullWidth
                  label="Város"
                  type="text"
                  value={home ? home : ""}
                  onChange={(e) => handleCountryChange(e)}
                />
              </Grid>
            </Grid>
          </MyGridItem>

          <MyGridItem item>
            <SubTitle variant="h3">Jelszavak kezelése</SubTitle>

            <Grid container direction="column" spacing={1.5}>
              {oldPasswordError ? (
                <Grid item>
                  <TextField
                    error
                    label="Régi jelszó"
                    defaultValue=""
                    fullWidth
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
              ) : (
                <Grid item>
                  <TextField
                    label="Régi jelszó"
                    defaultValue=""
                    fullWidth
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
              )}

              {changePasswordError ? (
                <React.Fragment>
                  <Grid item>
                    <TextField
                      error
                      label="Új jelszó*"
                      fullWidth
                      type="password"
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      error
                      label="Új jelszó**"
                      fullWidth
                      type="password"
                      onChange={(e) => setReNewPassword(e.target.value)}
                    />
                  </Grid>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Grid item>
                    <TextField
                      label="Új jelszó*"
                      fullWidth
                      type="password"
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Új jelszó**"
                      fullWidth
                      type="password"
                      onChange={(e) => setReNewPassword(e.target.value)}
                    />
                  </Grid>
                </React.Fragment>
              )}
            </Grid>
          </MyGridItem>

          <MyGridItem item>
            <Grid
              container
              direction="row"
              spacing={1.5}
              justifyContent="flex-end"
            >
              <Grid item>
                {isSent ? (
                  <FormActionButton disabled>Mentés</FormActionButton>
                ) : (
                  <FormActionButton type="submit">Mentés</FormActionButton>
                )}
              </Grid>
              <Grid item>
                <FormCancelButton
                  variant="contained"
                  component={Link}
                  to="/"
                  onClick={(e) => {
                    handleChangeTab(0);
                  }}
                >
                  Elvetés
                </FormCancelButton>
              </Grid>
            </Grid>
          </MyGridItem>
        </Grid>
      </form>

      {isOpenImageView && (picture.modified || picture.url) && (
        <ImageViewer
          isURL={picture.modified ? false : true}
          images={[picture.modified ? picture.base64 : picture.url]}
          index={currentIndex}
          open={isOpenImageView}
          onClose={(e) => setIsOpenImageView(false)}
        />
      )}
    </React.Fragment>
  );
}

export default Settings;
