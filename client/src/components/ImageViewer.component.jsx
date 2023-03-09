import styled from "@emotion/styled";
import { Backdrop, Grid, IconButton, Typography } from "@mui/material";
import React, { Component, useEffect, useState } from "react";
import { CancelIcon, LeftArrow, RightArrow } from "../lib/GlobalIcons";
import { ImageGrid, ViewImage } from "../lib/StyledComponents";

const MyBackdrop = styled(Backdrop)(({ theme }) => ({
  color: "#fff",
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "rgba(0, 0, 0, 0.3)",
}));

/*

@props => (images) I use this property to show each image.
@props => (isURL) How do I render the images ? the images are in base64 format? if yes, then I set its value to false, otherwise its true.
@props => (index) The index of the image
@props => (open) The open state of the component
@props => (onClose) The close function of the component

*/
function ImageViewer({ isURL, images, index, open, onClose }) {
  /*
    
    ** Usage:
        If I would like to use this component then I have to create a function in the parent component which is control a boolean state.
    And If we did it then we have to set its value to true if we would like to show the menu. Afterwards If we would like to show the 
    menu we have to pass some arguments what are images, index and open. The open property is for showing the menu, the index is the
    opened image from the images array and the images are the actual images.
    
    ** Code example:
        // state values for menu 
        const [isOpenImageView, setIsOpenImageView] = useState(false);
        // current image's index
        const [currentIndex, setCurrentIndex] = useState(0);
    
        const handleOpenImage = (index) => {
            setIsOpenImageView(true);
            setCurrentIndex(index);
        }

        ...
            <img onClick={e => handleOpenImage(0)} />
        ...

        // conditional rendering
        { isOpenImageView && <ImageViewer
                images={myOBJ['pictures']}
                index={currentIndex}
                open={isOpenImageView}
                onClose={e=>setIsOpenImageView(false)}
        /> }

    */
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImage(images[index]);
    setCurrentImageIndex(index);
  }, []);

  const handleSlideLeftPagination = () => {
    let nextIndex = -1;
    if (currentImageIndex === 0) {
      nextIndex = images.length - 1;
    } else {
      nextIndex = currentImageIndex - 1;
    }
    setCurrentImage(images[nextIndex]);
    setCurrentImageIndex(nextIndex);
  };
  const handleSlideRightPagination = () => {
    let nextIndex = -1;
    if (currentImageIndex === images.length - 1) {
      nextIndex = 0;
    } else {
      nextIndex = currentImageIndex + 1;
    }
    setCurrentImage(images[nextIndex]);
    setCurrentImageIndex(nextIndex);
  };

  if (images.length === 1) {
    return (
      <>
        <MyBackdrop open={open} onClick={onClose}>
          <ImageGrid
            container
            gap={2}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={1}>
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Grid item>
                  <Typography sx={{ color: "#fff" }} variant="body1">
                    {currentImageIndex + 1}/{images.length}
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={onClose} sx={{ color: "#111" }}>
                    <CancelIcon sx={{ width: "60px", height: "60px" }} />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs>
              {isURL ? (
                <ViewImage
                  src={
                    ("" + currentImage).includes("http")
                      ? currentImage
                      : `${process.env.REACT_APP_CLIENT_URL}/${currentImage}`
                  }
                />
              ) : (
                // if the isURL is false then I want to render a base64 image
                <ViewImage src={currentImage} />
              )}
            </Grid>
          </ImageGrid>
        </MyBackdrop>
      </>
    );
  }

  return (
    <>
      <MyBackdrop open={open}>
        <ImageGrid
          container
          gap={2}
          direction="column"
          wrap="nowrap"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={5}>
            <Grid
              container
              gap={2}
              direction="column"
              wrap="nowrap"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item>
                    <Typography sx={{ color: "#fff" }} variant="body1">
                      {currentImageIndex + 1}/{images.length}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={onClose} sx={{ color: "#fff" }}>
                      <CancelIcon sx={{ width: "45px", height: "45px" }} />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                {isURL ? (
                  // if the isURL is false then I want to render a base64 image
                  <ViewImage
                    src={
                      ("" + currentImage).includes("http")
                        ? currentImage
                        : `${process.env.REACT_APP_CLIENT_URL}/${currentImage}`
                    }
                  />
                ) : (
                  <ViewImage src={currentImage} />
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={7}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
                <IconButton
                  sx={{ color: "#fff" }}
                  onClick={(e) => handleSlideLeftPagination()}
                >
                  <LeftArrow sx={{ width: "45px", height: "45px" }} />
                </IconButton>
              </Grid>

              <Grid item>
                <IconButton
                  sx={{ color: "#fff" }}
                  onClick={(e) => handleSlideRightPagination()}
                >
                  <RightArrow sx={{ width: "45px", height: "45px" }} />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </ImageGrid>
      </MyBackdrop>
    </>
  );
}

export default ImageViewer;
