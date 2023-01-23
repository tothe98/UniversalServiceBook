const CopyToClipBoard = (url) => {
    navigator.clipboard.writeText(url);
}

export {
    CopyToClipBoard
}