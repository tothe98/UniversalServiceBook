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
import {
  DateIcon,
  DiscountOutlinedIcon,
  FuelIcon,
  TankIcon,
  WheelIcon,
} from "../../lib/GlobalIcons";
import { MyFormControll, MyTextField } from "../../lib/StyledComponents";

export default function NewVehicleFuelInput({
  setNewVehicleFuel,
  vehicleFuels,
  newVehicleFuel,
  MenuProps,
}) {
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
            <FuelIcon />
          </Typography>
        </Grid>

        <Grid item xs={11}>
          <MyFormControll fullWidth>
            <InputLabel id="demo-simple-select-label">Üzemanyag *</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Üzemanyag *"
              onChange={(e) => setNewVehicleFuel(e.target.value)}
              value={newVehicleFuel}
              MenuProps={MenuProps}
            >
              {vehicleFuels.map((x, i) => {
                return (
                  <MenuItem key={i + x} value={x.id}>
                    {x.type}
                  </MenuItem>
                );
              })}
            </Select>
          </MyFormControll>
        </Grid>
      </Grid>
    </>
  );
}
