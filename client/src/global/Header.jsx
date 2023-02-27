import React, { Component, useEffect, useState } from "react";
import {
  Avatar,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  styled,
  Toolbar,
  Typography,
  useMediaQuery,
  Link,
  theme,
  toast,
  Button,
  Navigate,
} from "../lib/GlobalImports";
import {
  Title,
  SideMenu,
  MyDrawer,
  MarginDiv,
  MyAvatar,
  MyDivider,
  SpaceInList,
} from "../lib/StyledComponents";
import {
  MenuIcon,
  LogoutOutlinedIcon,
  AutoAwesomeIcon,
  Person4Icon,
} from "../lib/GlobalIcons";
import Roles from "../lib/Roles";
import useAuth from "../hooks/useAuth";

const MAX_HEIGHT = "100px";

const Wrapper = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.common.darkblack,
  maxHeight: MAX_HEIGHT,
  height: "100%",
  padding: "32px 0",
  paddingLeft: theme.global.basePadding,
  paddingRight: theme.global.basePadding,
  zIndex: theme.zIndex.drawer + 1,
  position: "relative",
}));

const LoginButton = styled(Button)(({ theme }) => ({
  color: "#fff",
  baxkgroundColor: "none",
  [theme.breakpoints.down("sm")]: {
    minWidth: "100%",
  },
}));

function Header({ routes, handleChangeTab }) {
  const { auth } = useAuth();
  const underS = useMediaQuery(theme.breakpoints.down("sm"));
  const upLG = useMediaQuery(theme.breakpoints.up("lg"));
  const downLG = useMediaQuery(theme.breakpoints.down("lg"));
  const [open, setOpen] = useState(false);
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  const handleLogout = (e) => {
    localStorage.removeItem("token");
    toast.success("Sikeresen kijelentkeztél!");
    global.location.reload();
    global.location.href = "/";
    setOpen(!open);
  };

  const getRoutesByRole = (role) => {
    switch (role) {
      case Roles.User:
        return [...routes.USER];
        break;
      case Roles.Employee:
        return [...routes.EMPLOYEE];
        break;
      case Roles.Owner:
        return [...routes.OWNER];
        break;
      case Roles.Admin:
        return [...routes.ADMIN];
        break;
    }
  };

  const Tabs = () => {
    return (
      <>
        {Array.from(getRoutesByRole(auth.role)).map((route) => {
          return (
            <>
              <MyDivider variant="inset" component="li" />

              <ListItem>
                <ListItemButton component={Link} to={route.link}>
                  <MyAvatar>
                    <AutoAwesomeIcon sx={{ color: "white" }} />
                  </MyAvatar>
                  <ListItemText
                    primary={route.name}
                    onClick={(e) => {
                      handleChangeTab(route.activeIndex);
                      setOpen(!open);
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <MyDivider variant="inset" component="li" />
            </>
          );
        })}

        <SpaceInList />

        <ListItem>
          <ListItemButton
            component={Link}
            to="/beallitasok"
            onClick={(e) => {
              handleChangeTab(3);
              setOpen(!open);
            }}
          >
            <MyAvatar>
              <img
                src={
                  auth?.user?.picture !== undefined
                    ? auth.user.picture
                    : "https://media.istockphoto.com/id/1016744004/vector/profile-placeholder-image-gray-silhouette-no-photo.jpg?s=612x612&w=0&k=20&c=mB6A9idhtEtsFXphs1WVwW_iPBt37S2kJp6VpPhFeoA="
                }
                alt="profilkép"
              />
            </MyAvatar>
            <ListItemText
              primary={`${
                auth.user && auth.user.lName + " " + auth.user.fName
              }`}
            />
          </ListItemButton>
        </ListItem>
      </>
    );
  };

  return (
    <React.Fragment>
      <Wrapper>
        <Grid container>
          {upLG && <Grid item xs></Grid>}

          <Grid item lg={10} xs={11}>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              sx={{ width: "100%", height: "100%" }}
            >
              <Grid item>
                <Title variant="h1" component={Link} to="/">
                  Univerzális Szervizkönyv
                </Title>
              </Grid>
            </Grid>
          </Grid>

          {underS && auth.user && (
            <SideMenu item xs={1}>
              <IconButton>
                <Typography variant="h1">
                  <MenuIcon onClick={(e) => setOpen(!open)} />
                </Typography>
              </IconButton>
            </SideMenu>
          )}

          {!auth.user && upLG && (
            <SideMenu item xs={1}>
              <LoginButton
                startIcon={<Person4Icon />}
                onClick={(e) => {
                  window.location.href = "/bejelentkezes";
                }}
              >
                <Typography variant="body1">Bejelentkezés</Typography>
              </LoginButton>
            </SideMenu>
          )}
          {!auth.user && downLG && (
            <SideMenu item xs={1}>
              <LoginButton
                startIcon={<Person4Icon />}
                onClick={(e) => {
                  window.location.href = "/bejelentkezes";
                }}
              ></LoginButton>
            </SideMenu>
          )}

          <Grid item xs></Grid>
        </Grid>
      </Wrapper>

      {auth.user && (
        <MyDrawer
          PaperProps={{ elevation: 9 }}
          anchor="top"
          open={open}
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
          onClose={(e) => {
            setOpen(false);
          }}
        >
          <List>
            <MarginDiv />
            <SpaceInList />

            <Tabs />

            <ListItem>
              <ListItemButton
                onClick={(e) => {
                  handleLogout(e);
                }}
              >
                <MyAvatar>
                  <LogoutOutlinedIcon />
                </MyAvatar>
                <ListItemText disableTypography primary="Kijelentkezés" />
              </ListItemButton>
            </ListItem>
          </List>
        </MyDrawer>
      )}
    </React.Fragment>
  );
}

export default Header;
