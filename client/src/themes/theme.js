import { createTheme } from "@mui/material";

export default createTheme({
    palette: {
        common: {
            darkblack: '#24292F',
            gray: 'rgba(102, 102, 102, 0.05)',
            lightgray: '#D0D7DE',
            blue: "#1B30F5"
        }
    },
    mixins: {
      button: {
          maxWidth: "149px",
          maxHeight: "40px",
          width: "100%",
          height: "100%",
          background: "#24292F",
          border: `#D0D7DE`,
          borderRadius: "5px",
          textTransform: "none",
          color: "#fff",
          padding: "1em 2em",
          "&:hover": {
              background: "#24292F"
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
    }
})