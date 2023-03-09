import React, { Component, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Skeleton,
  styled,
  Toolbar,
  Typography,
  useMediaQuery,
  theme,
} from "../lib/GlobalImports";
import { Link, toast } from "../lib/GlobalImports";
import { MyCircularSkeleton, MyTextSkeleton } from "../lib/Skeletons";
import { AvatarImage } from "../lib/StyledComponents";
import useAuth from "../hooks/useAuth";
import ImageViewer from "../components/ImageViewer.component";

const Container = styled(Grid)(({ theme }) => ({
  paddingLeft: theme.global.basePadding,
  paddingRight: theme.global.basePadding,
}));

const MyGridItem = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const SettingsButton = styled(Button)(({ theme }) => ({
  ...theme.mixins.button,
  backgroundColor: theme.palette.common.lightgray,
  "&:hover": {
    backgroundColor: theme.palette.common.lightgray,
  },
  color: theme.palette.common.darkblack,
  [theme.breakpoints.down("sm")]: {
    minWidth: "100%",
  },
}));

const NameText = styled(Typography)(({ theme }) => ({
  wordBreak: "break-all",
  maxWidth: "250px",
  width: "100%",
}));

function Profile({ handleChangeTab, loggedIn }) {
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const underLarge = useMediaQuery(theme.breakpoints.down("lg"));
  const underSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [isOpenImageView, setIsOpenImageView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setIsLoading(false);
  });

  const handleOpenImage = (index) => {
    setIsOpenImageView(true);
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <>
        <Container
          container
          spacing={underLarge ? 1 : 2}
          direction={underLarge ? (underSmall ? "column" : "row") : "column"}
          alignItems="center"
          justifyContent={underLarge ? "flex-start" : "center"}
          sx={{
            marginTop: underLarge ? "1.5em" : 0,
            marginBottom: underLarge ? "1.5em" : 0,
          }}
        >
          {underLarge ? (
            <MyGridItem item>
              <Grid item>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  spacing={1.5}
                >
                  <Grid item>
                    <MyCircularSkeleton variant="circular" />
                  </Grid>

                  <Grid item>
                    <Typography variant="h2" align="center">
                      <MyTextSkeleton variant="rectangular" />
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </MyGridItem>
          ) : (
            <React.Fragment>
              <Grid item>
                <MyCircularSkeleton variant="circular" />
              </Grid>
              <Grid item>
                <Typography align="center" variant="h2">
                  <MyTextSkeleton variant="rectangular" />
                </Typography>
              </Grid>
            </React.Fragment>
          )}
          <MyGridItem
            item
            sx={{ marginLeft: underLarge ? "auto" : 0, textAlign: "center" }}
          >
            {loggedIn ? (
              <SettingsButton
                sx={{ marginTop: "10px", marginLeft: underLarge ? "auto" : "" }}
                component={Link}
                to="/beallitasok"
                onClick={(e) => {
                  handleChangeTab(3);
                }}
              >
                Beállítások
              </SettingsButton>
            ) : (
              <SettingsButton
                sx={{ marginTop: "10px", marginLeft: underLarge ? "auto" : "" }}
                component={Link}
                to="/bejelentkezes"
                onClick={(e) => {
                  handleChangeTab(3);
                }}
              >
                Belépés
              </SettingsButton>
            )}
          </MyGridItem>
        </Container>
        {underLarge && <hr />}
      </>
    );
  }

  return (
    <>
      <Container
        container
        spacing={underLarge ? 1 : 2}
        direction={underLarge ? (underSmall ? "column" : "row") : "column"}
        alignItems="center"
        justifyContent={underLarge ? "flex-start" : "center"}
        sx={{
          marginTop: underLarge ? "1.5em" : 0,
          marginBottom: underLarge ? "1.5em" : 0,
        }}
      >
        {underLarge ? (
          <MyGridItem item>
            <Grid item>
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                spacing={1.5}
              >
                <Grid item>
                  <AvatarImage
                    onClick={(e) => handleOpenImage(0)}
                    src={
                      auth?.user?.picture
                        ? `${process.env.REACT_APP_CLIENT_URL}/${auth.user.picture}`
                        : "https://media.istockphoto.com/id/1016744004/vector/profile-placeholder-image-gray-silhouette-no-photo.jpg?s=612x612&w=0&k=20&c=mB6A9idhtEtsFXphs1WVwW_iPBt37S2kJp6VpPhFeoA="
                    }
                    alt="profil kép"
                    sx={{ margin: 0 }}
                  />
                </Grid>

                <Grid item>
                  <NameText align="center" variant="h2">
                    {auth.user && auth.user.lName}
                  </NameText>
                  <NameText
                    align="center"
                    variant="h2"
                    sx={{ wordBreak: "break-word" }}
                  >
                    {auth.user && auth.user.fName}
                  </NameText>
                </Grid>
              </Grid>
            </Grid>
          </MyGridItem>
        ) : (
          <React.Fragment>
            <Grid item>
              <AvatarImage
                onClick={(e) => handleOpenImage(0)}
                src={
                  auth?.user?.picture !== undefined
                    ? auth.user.picture
                    : "https://media.istockphoto.com/id/1016744004/vector/profile-placeholder-image-gray-silhouette-no-photo.jpg?s=612x612&w=0&k=20&c=mB6A9idhtEtsFXphs1WVwW_iPBt37S2kJp6VpPhFeoA="
                }
                alt="profil kép"
              />
            </Grid>
            <Grid item sx={{ width: "100%", height: "auto" }}>
              <NameText
                align="center"
                variant="h2"
                sx={{ wordBreak: "break-word" }}
              >
                {auth.user && auth.user.lName}
              </NameText>
              <NameText
                align="center"
                variant="h2"
                sx={{ wordBreak: "break-word" }}
              >
                {auth.user && auth.user.fName}
              </NameText>
            </Grid>
          </React.Fragment>
        )}
        <MyGridItem
          item
          sx={{ marginLeft: underLarge ? "auto" : 0, textAlign: "center" }}
        >
          {auth.user ? (
            <>
              <SettingsButton
                sx={{ marginTop: "10px", marginLeft: underLarge ? "auto" : "" }}
                component={Link}
                to="/beallitasok"
                onClick={(e) => {
                  handleChangeTab(3);
                }}
              >
                Beállítások
              </SettingsButton>
              <SettingsButton
                sx={{
                  marginTop: "10px",
                  marginLeft: underLarge ? "auto" : "",
                  background: theme.palette.common.orange,
                  color: theme.palette.common.white,
                }}
                onClick={(e) => {
                  handleChangeTab(1);
                  localStorage.removeItem("token");
                  localStorage.removeItem("last_viewed");
                  toast.success("Sikeresen kijelentkeztél!");
                  window.location.href = "/bejelentkezes";
                }}
              >
                Kijelentkezés
              </SettingsButton>
            </>
          ) : (
            <SettingsButton
              sx={{ marginTop: "10px", marginLeft: underLarge ? "auto" : "" }}
              component={Link}
              to="/bejelentkezes"
              onClick={(e) => {
                handleChangeTab(3);
              }}
            >
              Belépés
            </SettingsButton>
          )}
        </MyGridItem>
      </Container>
      {underLarge && <hr />}

      {isOpenImageView && auth?.user?.picture && (
        <ImageViewer
          isURL={true}
          images={[auth.user.picture]}
          index={currentIndex}
          open={isOpenImageView}
          onClose={(e) => setIsOpenImageView(false)}
        />
      )}
    </>
  );
}

export default Profile;
