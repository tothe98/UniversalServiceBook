import React, { Component, useState } from "react";
import moment from "moment";
import {
  Chip,
  Grid,
  Typography,
  useMediaQuery,
  theme,
  Link,
} from "../lib/GlobalImports.js";
import {
  SubTitle,
  ContentBox,
  ContentBoxImage,
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
import ImageViewer from "./ImageViewer.component.jsx";

function VehicleCard({ vehicle, i, handleChangeTab }) {
  const underMD = useMediaQuery(theme.breakpoints.down("md"));
  const underS = useMediaQuery(theme.breakpoints.down("sm"));

  const [isOpenImageView, setIsOpenImageView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpenImage = (index) => {
    setIsOpenImageView(true);
    setCurrentIndex(index);
  };

  return (
    <>
      <ContentBox key={vehicle + i}>
        <Grid container direction="column">
          <Grid item>
            <CarCard>
              <CarCardHeader
                title={`${vehicle.manufacture} ${vehicle.model}`}
              ></CarCardHeader>

              <Grid
                container
                direction={underMD ? "column" : "row"}
                alignItems={underMD ? "center" : "flex-start"}
                justifyContent={underMD && "center"}
              >
                <Grid item>
                  <CarCardMedia
                    component="img"
                    image={
                      vehicle?.preview
                        ? vehicle["preview"]
                        : vehicle["pictures"][0]
                    }
                    alt={`${vehicle.manufacture} ${vehicle.model}`}
                    onClick={(e) => handleOpenImage(0)}
                  />
                </Grid>

                <Grid item>
                  <CarCardContent>
                    <Grid container direction="column" justifyContent="center">
                      <Grid container direction="row" spacing={2}>
                        <Grid item>
                          <Typography variant="h4">Alv??zsz??m:</Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h4">{vehicle.vin}</Typography>
                        </Grid>
                      </Grid>

                      <Grid container direction="row" spacing={2}>
                        <Grid item>
                          <Typography variant="h4">Rendsz??m:</Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h4">
                            {vehicle.licenseNumber}
                          </Typography>
                        </Grid>
                      </Grid>

                      {vehicle?.serviceEntries && (
                        <Grid container direction="row" spacing={2}>
                          <Grid item>
                            <Typography variant="h4">
                              Bejegyzett szervizek:
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="h4">
                              {vehicle.serviceEntries.length}
                            </Typography>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </CarCardContent>
                </Grid>
              </Grid>

              <CarCardActions>
                {underMD ? (
                  <Chip
                    label={moment(vehicle.vintage).format("YYYY")}
                    variant="outlined"
                  />
                ) : (
                  <>
                    <Chip
                      label={moment(vehicle.vintage).format("YYYY")}
                      variant="outlined"
                    />
                    <Chip label={`${vehicle.mileage} km`} variant="outlined" />
                    <Chip
                      label={`${vehicle.performanceLE} LE`}
                      variant="outlined"
                    />
                  </>
                )}
                <ViewButton
                  size="small"
                  sx={{ marginLeft: "auto" }}
                  component={Link}
                  to={`/jarmuveim/${
                    vehicle["_id"] ? vehicle["_id"] : vehicle["id"]
                  }`}
                  onClick={(e) => {
                    handleChangeTab(1);
                  }}
                >
                  Megtekintem
                </ViewButton>
              </CarCardActions>
            </CarCard>
          </Grid>
        </Grid>
      </ContentBox>

      {isOpenImageView && (
        <ImageViewer
          isURL={true}
          images={[
            vehicle.preview ? vehicle["preview"] : vehicle["pictures"][0],
          ]}
          index={currentIndex}
          open={isOpenImageView}
          onClose={(e) => setIsOpenImageView(false)}
        />
      )}
    </>
  );
}

export default VehicleCard;
