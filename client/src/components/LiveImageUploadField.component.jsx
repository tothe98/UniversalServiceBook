import { Grid, InputLabel, useMediaQuery } from "@mui/material";
import React, { Component, useState } from "react";
import { AllowedMimeTypes } from "../lib/FileUploader";
import {
  AddCarSubTitle,
  CarCardContent,
  CarCardMedia,
  MyTextField,
} from "../lib/StyledComponents";
import theme from "../themes/theme";
import ImageViewer from "./ImageViewer.component";

function LiveImageUploadField({ isURL, title, image, onAction }) {
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
      <Grid
        container
        direction={underMD ? "column" : "row"}
        alignItems={underMD ? "center" : "flex-start"}
        justifyContent={underMD && "center"}
      >
        <Grid item>
          <CarCardMedia
            component="img"
            onClick={(e) => handleOpenImage(0)}
            image={
              isURL
                ? ("" + image).includes("http")
                  ? image
                  : `${process.env.REACT_APP_CLIENT_URL}/${image}`
                : image
                ? image
                : "https://t3.ftcdn.net/jpg/04/21/50/96/360_F_421509616_AW4LfRfbYST8T2ZT9gFGxGWfrCwr4qm4.jpg"
            }
            alt="előkép"
          />
        </Grid>

        <Grid item>
          <CarCardContent>
            <AddCarSubTitle variant="h4" htmlFor="custom-file-input">
              {title}
            </AddCarSubTitle>

            <MyTextField
              id="custom-file-input"
              onChange={onAction}
              inputProps={{
                accept: "image/jpeg, image/jpg, image/png, image/webp",
              }}
              helperText={`* Engedélyezett állomány kiterjesztések (${AllowedMimeTypes.map(
                (x) => ` ${x}`
              )})`}
              fullWidth
              name="preview"
              placeholder="Kép kiválasztása..."
              type="file"
            />
          </CarCardContent>
        </Grid>
      </Grid>

      {isOpenImageView && (
        <ImageViewer
          isURL={isURL}
          images={[
            isURL
              ? ("" + image).includes("http")
                ? image
                : `${process.env.REACT_APP_CLIENT_URL}/${image}`
              : image
              ? image
              : "https://t3.ftcdn.net/jpg/04/21/50/96/360_F_421509616_AW4LfRfbYST8T2ZT9gFGxGWfrCwr4qm4.jpg",
          ]}
          index={currentIndex}
          open={isOpenImageView}
          onClose={(e) => setIsOpenImageView(false)}
        />
      )}
    </>
  );
}

export default LiveImageUploadField;
