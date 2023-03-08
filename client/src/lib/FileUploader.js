const AllowedMimeTypes = [
    "png", "jpg", "jpeg", "webp"
]

const isValidFileMimeType = (file) => {
    const uploadedFile = file.name;
    const uploadedFileSplitArray = `${uploadedFile}`.split(".");
    const uploadedFileMimeType =
      uploadedFileSplitArray[uploadedFileSplitArray.length - 1];
    return AllowedMimeTypes.includes(uploadedFileMimeType);
} 

const getFileMimeType = (file) => {
    const uploadedFile = file.name;
    const uploadedFileSplitArray = `${uploadedFile}`.split(".");
    const uploadedFileMimeType =
      uploadedFileSplitArray[uploadedFileSplitArray.length - 1];
    return uploadedFileMimeType;
}

export {
    AllowedMimeTypes,
    isValidFileMimeType,
    getFileMimeType
}