import {
    Alert,
    alpha,
    InputBase,
    TextField,
    FormControl,
    Box,
    Button,
    Card, CardActions, CardContent,
    CardHeader, CardMedia,
    Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider,
    Grid,
    IconButton, Menu, Snackbar,
    styled,
    Toolbar, Tooltip,
    Typography,
    useMediaQuery
} from "@mui/material";

const CONTENT_BOX_MAX_HEIGHT = "200px";

const SubTitle = styled(Typography)(({theme}) => ({
    marginBottom: "2rem"
}))

const ContentBox = styled('div')(({theme}) => ({
    position: "relative",
    width: "100",
    height: "auto",
    border: `1px solid ${theme.palette.common.lightgray}`,
    borderRadius: "5px",
    margin: "11px 0",
    padding: "10px"
}))

const ContentBoxImage = styled('img')(({theme}) => ({
    width: "100%",
    maxHeight: CONTENT_BOX_MAX_HEIGHT,
    objectFit: "scale-down",
    height: "100%"
}))

const ViewButton = styled(Button)(({theme}) => ({
    ...theme.mixins.button,
    position: "relative"
}))

const CarCard = styled(Card)(({theme}) => ({
    padding: "0.2rem 1rem"
}))

const CarCardHeader = styled(CardHeader)(({theme}) => ({
    "& .MuiCardHeader-title": {
        ...theme.typography.h3
    },
    padding: 0
}))

/*
*
* Honda Accord
* ----- SPACE BETWEEN ..
* img
* license plate number: ...
* ----- SPACE BETWEEN ..
* 2110 le 2016 year
* */
const SPACE_BETWEEN_HEADER_AND_FOOTER = "0.9rem";

const CarCardMedia = styled(CardMedia)(({theme}) => ({
    maxHeight: "300px",
    maxWidth: "300px",
    height: "100%",
    width: "100%",
    objectFit: "cover",
    marginTop: SPACE_BETWEEN_HEADER_AND_FOOTER
}))

const CarCardContent = styled(CardContent)(({theme}) => ({
}))

const CarCardActions = styled(CardActions)(({theme}) => ({
    marginTop: SPACE_BETWEEN_HEADER_AND_FOOTER,
    padding: 0
}))

const CarOptionsMenu = styled(Menu)(({theme}) => ({
    "&	.MuiMenu-paper": {
        borderRadius: "5px",
        border: theme.palette.common.lightgray
    }
}))

const CarDialog = styled(Dialog)(({theme}) => ({
    "& .MuiDialog-paper": {
        backgroundColor: "none",
        width: "100%"
    }
}))

const MenuText = styled(Typography)(({theme}) => ({
    color: theme.palette.common.darkblack
}))

const CarDialogText = styled(DialogContentText)(({theme}) => ({
}))

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const AddCarSubTitle = styled(Typography)(({theme}) => ({
    marginBottom: "0.9rem"
}))

const MyTextField = styled(TextField)(({theme}) => ({
    margin: "0.7rem 0"
}))
const MyFormControll = styled(FormControl)(({theme}) => ({
    margin: "0.7rem 0"
}))

const GalleryImage = styled("img")(({theme}) => ({
    maxWidth: "200px",
    maxHeight: "200px",
    width: "100%",
    height: "auto",
    objectFit: "cover"
}))

/* multiple select field values */
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export {
    Search,
    SearchIconWrapper,
    StyledInputBase,
    AddCarSubTitle,
    MyTextField,
    MyFormControll,
    GalleryImage,
    MenuProps,
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
    CarDialogText
}