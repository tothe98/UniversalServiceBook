import { Grid, IconButton } from "@mui/material";
import React, { Component, useState } from "react";
import { RemoveCircleOutlineOutlinedIcon } from "../lib/GlobalIcons";
import { GalleryImage } from "../lib/StyledComponents";
import ImageViewer from "./ImageViewer.component";

/*
@props => (isURL) How do I render the images ? the images are in base64 format? if yes, then I set its value to false, otherwise its true.
@props => (isOwnImageView) I use this boolean value to determine that this component has to render its own image and open it or its parent does.
@props => (hasCustomClick) If it is true, then I can add a another click action next to onDeleteAction.
@props => (image) Current Image.
@props => (onCustomClick) If hasCustomClick is true and I click to the image the customClick will run.
@props => (onDeleteAction) What I want to do when I click to the remove icon.
*/
function ImageItem({
  isURL,
  isOwnImageView,
  hasCustomClick,
  image,
  onDeleteAction,
  onCustomClick,
}) {
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
        direction="column"
        gap={2}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <GalleryImage
            onClick={(e) => {
              if (isOwnImageView) {
                handleOpenImage(0);
              } else if (hasCustomClick) {
                onCustomClick();
              }
            }}
            src={
              isURL
                ? ("" + image).includes("http")
                  ? image
                  : `${process.env.REACT_APP_CLIENT_URL}/${image}`
                : image
            }
            loading="lazy"
          />
        </Grid>

        <Grid item>
          <IconButton onClick={onDeleteAction}>
            <RemoveCircleOutlineOutlinedIcon color="error" />
          </IconButton>
        </Grid>
      </Grid>

      {isOwnImageView && isOpenImageView && (
        <ImageViewer
          isURL={isURL}
          images={[image]}
          index={currentIndex}
          open={isOpenImageView}
          onClose={(e) => setIsOpenImageView(false)}
        />
      )}
    </>
  );
}

export default ImageItem;
