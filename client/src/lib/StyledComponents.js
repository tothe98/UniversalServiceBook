import {
    Alert,
    Accordion,
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
    useMediaQuery,
    Drawer,
    Avatar,
    Tab,
    CardActionArea
} from "@mui/material";
import {
    theme
} from "./GlobalImports"

const CONTENT_BOX_MAX_HEIGHT = "200px";
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
const MAX_HEIGHT = '100px';
const MAX_WIDTH = '880px';
const CAR_NAME_BOX_MAX_HEIGHT = "80px";
const CAR_DETAiL_SPACING = 2;
const CAR_DETAIL_GRID_ITEM_SPACE = "1em";

const SubTitle = styled(Typography)(({theme}) => ({
    marginBottom: "2rem"
}))

const SubTitle2 = styled(Typography)(({theme}) => ({
    margin: "2rem 0"
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
const MyTextField2 = styled(TextField)(({theme}) => ({
    margin: "0.7"
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


const Wrapper = styled(Grid)(({theme}) => ({
    maxHeight: MAX_HEIGHT,
    height: '100%',
    marginTop: "40px",
    paddingLeft: theme.global.basePadding,
    paddingRight: theme.global.basePadding
}))

const MyHr = styled('hr')(({theme}) => ({
    margin: 0
}))

const FooterText = styled(Toolbar)(({theme}) => ({
}))

const SubMenuContainer = styled(Toolbar)(({theme}) => ({
    marginLeft: 'auto'
}))

const FooterElement = styled(Typography)(({theme}) => ({
    ...theme.typography.link,
    margin: '0 5px'
}))

const Title = styled(Typography)(({theme}) => ({
    ...theme.typography.link
}))

const SideMenu = styled(Grid)(({theme}) => ({
    marginLeft: "auto"
}))

const MyDrawer = styled(Drawer)(({theme}) => ({
    marginTop: "6.25rem",
    "& 	.MuiDrawer-paper": {
        backgroundColor: "rgba(36, 41, 47, 0.946555)",
        color: theme.palette.common.white
    }
}))

const MarginDiv = styled('div')(({theme}) => ({
    marginTop: "7.0rem"
}))

const MyAvatar = styled(Avatar)(({theme}) => ({
    color: theme.palette.common.white,
    background: "none",
    marginRight: "1em",
    objectFit: "cover"
}))

const MyDivider = styled(Divider)(({theme}) => ({
    "& 	.MuiDivider-root": {
        color: theme.palette.common.gray
    }
}))

const SpaceInList = styled('div')(({theme}) => ({
    marginTop: "2rem"
}))

const MyTab = styled(Tab)(({theme}) => ({
    ...theme.typography.h3,
    textTransform: "none"
}))

const NameBox = styled('div')(({theme}) => ({
    maxHeight: CAR_NAME_BOX_MAX_HEIGHT,
    height: "auto",
    background: theme.palette.common.white,
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
    margin: "23px 0",
    padding: "10px"
}))

const BackToCarsButton = styled(Button)(({theme}) => ({
    color: theme.palette.common.darkblack,
    textTransform: "none",
    borderColor: `#D0D7DE`,
    borderRadius: "5px"
}))

const CarWallPaperImage = styled("img")(({theme}) => ({
    objectFit: "cover",
    width: "100%",
    height: "100%",
    cursor: "pointer"
}))

const CarGalleryImage = styled("img")(({theme}) => ({
    maxWidth: "97px",
    objectFit: "cover",
    width: "100%",
    minHeight: "40px",
    height: "auto",
    cursor: "pointer",
    "&:hover": {
        opacity: 0.7
    }
}))

const CarDetailsTitle = styled(Typography)(({theme}) => ({
    fontWeight: 800
}))

const CarDetailGridItem = styled(Grid)(({theme}) => ({
    marginBottom: CAR_DETAIL_GRID_ITEM_SPACE,
    width: "100%"
}))

const CarDetailValue = styled(Typography)(({theme}) => ({
    fontWeight: 390,
    width: "100%"
}))

const MyAccordion = styled(Accordion)(({theme}) => ({
    border: `1px solid ${theme.palette.common.lightgray}`,
    marginBottom: "0.5em"
}))

const MyAccordionImage = styled("img")(({theme}) => ({
    maxWidth: "150px",
    width: "100%",
    height: "100%",
    objectFit: "cover"
}))

const MyCardHeader = styled(CardHeader)(({theme}) => ({
    "& .MuiCardHeader-title": {
        ...theme.typography.h3
    },
    "& .MuiCardHeader-subheader": {
        ...theme.typography.h4
    }
}))

const UserCard = styled(CardActionArea)(({theme}) => ({
    width: "200px",
    height: "100px",
    textAlign: "center",
    marginBottom: "1rem",
    "&:hover": {
        backgroundColor: theme.palette.common.orange,
        color: theme.palette.common.white
    }
}))

const SendButton = styled(Button)(({theme}) => ({
    ...theme.mixins.button,
}))

const AVATAR_MAX_HEIGHT = '200px';
const AVATAR_MAX_WIDTH = '200px';

const AvatarImage = styled('img')(({theme}) => ({
    backgroundColor: theme.palette.common.gray,
    height: AVATAR_MAX_HEIGHT,
    width: AVATAR_MAX_WIDTH,
    minWidth: `100px`,
    minWidth: `100px`,
    marginBottom: '40px',
    borderRadius: '50%',
    objectFit: "cover",
    [theme.breakpoints.down("lg")]: {
        width: "150px",
        height: '150px',
        marginBottom: "0px"
    },
    [theme.breakpoints.down("md")]: {
        width: "100px",
        height: '100px',
        marginBottom: "0px"
    }
}))

const FormActionButton = styled(Button)(({theme}) => ({
    ...theme.mixins.button
}))

const FormCancelButton = styled(Button)(({theme}) => ({
    ...theme.mixins.cancelButton
}))

const MyGridItem = styled(Grid)(({theme}) => ({
    marginBottom: "30px",
    width: "100%"
}))

const ImageGrid = styled(Grid)(({ theme }) => ({
    maxWidth: "900px",
    height: "100%",
    maxHeight: "700px",
    minHeight: "400px"
}))

const ViewImage = styled("img")(({ theme }) => ({
    maxWidth: "700px",
    width: "100%",
    height: "auto",
    objectFit: "scale-down"
}))
const WarningImage = styled("img")(({ theme }) => ({
    width: "100%",
    minHeight: "25px",
    maxHeight: "25px",
    objectFit: "scale-down"
}))

export {
    WarningImage,
    ImageGrid,
    ViewImage,
    MyGridItem,
    FormCancelButton,
    FormActionButton,
    AvatarImage,
    SendButton,
    MyTextField2,
    UserCard,
    CAR_DETAiL_SPACING,
    MyCardHeader,
    SubTitle2,
    NameBox,
    BackToCarsButton,
    CarWallPaperImage,
    CarGalleryImage,
    CarDetailGridItem,
    CarDetailsTitle,
    CarDetailValue,
    MyAccordionImage,
    MyAccordion,
    MyTab,
    Title,
    SideMenu,
    MyDrawer,
    MarginDiv,
    MyAvatar,
    MyDivider,
    SpaceInList,
    Wrapper,
    MyHr,
    FooterText,
    SubMenuContainer,
    FooterElement,
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