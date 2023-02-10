import {Skeleton, styled} from "@mui/material";

const MyCircularSkeleton = styled(Skeleton)(({theme}) => ({
    minWidth: "200px",
    minHeight: "200px"
}))

const MyTextSkeleton = styled(Skeleton)(({theme}) => ({
    minWidth: "100px",
    minHeight: "50px"
}))

const MyWallpaperSkeleton = styled(Skeleton)(({theme}) => ({
    minWidth: "300px",
    minHeight: "400px"
}))

const MyCardSkeleton = styled(Skeleton)(({theme}) => ({
    minWidth: "100%",
    height: "300px",
    margin: 0,
    lineHeight: 0
}))

const MyInputSkeleton = styled(Skeleton)(({theme}) => ({
    width: "100px",
    height: "60px",
    lineHeight: 0,
    margin: "0 0.3rem"
}))

const MyFullWidthInputSkeleton = styled(Skeleton)(({theme}) => ({
    width: "100%",
    height: "60px",
    lineHeight: 0,
    margin: "0 0.3rem"
}))

export { MyCircularSkeleton, MyTextSkeleton, MyCardSkeleton, MyInputSkeleton, MyFullWidthInputSkeleton, MyWallpaperSkeleton }