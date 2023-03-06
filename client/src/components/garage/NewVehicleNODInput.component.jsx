import {
  Autocomplete,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import {
  DateIcon,
  DiscountOutlinedIcon,
  DocumentsIcon,
  TankIcon,
  TextsmsOutlinedIcon,
  WheelIcon,
} from "../../lib/GlobalIcons";
import { MyFormControll, MyTextField } from "../../lib/StyledComponents";

export default function NewVehicleNODInput({ setNewVehicleDocument }) {
  return (
    <>
      <Grid
        container
        direction="row"
        spacing={0}
        wrap="nowrap"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={1}>
          <Typography align="center">
            <DocumentsIcon />
          </Typography>
        </Grid>

        <Grid item xs={11}>
          <MyTextField
            fullWidth
            id="outlined-disabled"
            label="Okmányok jellege **"
            type="text"
            onChange={(e) => setNewVehicleDocument(e.target.value)}
          />
          <Typography variant="body1" sx={{ opacity: "0.6" }}>
            * Az okmányok jellege a jármű származási helyét várja értékül.
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
