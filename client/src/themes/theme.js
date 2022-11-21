import {createTheme, responsiveFontSizes} from "@mui/material";

const ROSE_RED_HEX = "#BD1E51";
const DARK_BLACK = '#24292F';
const GRAY = 'rgba(102, 102, 102, 0.05)';
const LIGHTGRAY = '#D0D7DE';
const BLUE = '#1B30F5';

let theme = createTheme({
    palette: {
        common: {
            darkblack: DARK_BLACK,
            gray: GRAY,
            lightgray: LIGHTGRAY,
            blue: BLUE,
            _RoseRed: ROSE_RED_HEX
        }
    },
    mixins: {
        button: {
            maxWidth: "149px",
            maxHeight: "40px",
            width: "100%",
            height: "100%",
            background: `${LIGHTGRAY}`, // "#24292F
            border: `#D0D7DE`,
            borderRadius: "5px",
            textTransform: "none",
            color: `${DARK_BLACK}`, // #fff
            padding: "1em 2em",
            "&:hover": {
                background: `${LIGHTGRAY}`
            }
        },
        cancelButton: {
            maxWidth: "149px",
            maxHeight: "40px",
            width: "100%",
            height: "100%",
            background: "#fff",
            border: `1px solid #24292F`,
            borderRadius: "5px",
            textTransform: "none",
            color: "#24292F",
            padding: "1em 2em",
            "&:hover": {
                background: "#fff"
            }
        }
    },
    typography: {
        h1: {
            // base fontsize is 16px
            fontSize: '2.1875rem',
            fontFamily: 'Inter',
            color: '#fff',
            fontWeight: 700
        },
        h2: {
            fontSize: '1.875rem',
            fontWeight: 700,
            fontFamily: 'Montserrat'
        },
        h3: {
            fontFamily: 'Montserrat',
            fontSize: '1.4375rem',
            fontWeight: 700
        },
        h4: {
            fontFamily: 'Montserrat',
            fontSize: '1.25rem',
            fontWeight: 700
        },
        h5: {
            fontFamily: 'Montserrat',
            fontSize: '0.9375rem',
        },
        h6: {
            fontFamily: 'Montserrat',
            fontSize: '0.7345rem',
            fontWeight: 700
        },
        link: {
            textDecoration: 'none'
        }
    },
    shadows: {
        25: "0px 0px 8px #D9D9D9"
    },
    global: {
        basePadding: "10px"
    }
})
theme = responsiveFontSizes(theme);

export default theme;