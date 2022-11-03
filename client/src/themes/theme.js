import { createTheme } from "@mui/material";

export default createTheme({
    palette: {
        common: {
            darkblack: '#24292F',
            gray: 'rgba(102, 102, 102, 0.05)'
        }
    },
    typography: {
        h1: {
            // base fontsize is 16px
            fontSize: '1.875rem',
            fontFamily: 'Inter',
            color: '#fff'
        },
        h2: {

        },
        h3: {
            fontFamily: 'Montserrat',
            fontSize: '1.4375rem'
        },
        link: {
            textDecoration: 'none'
        }
    }
})