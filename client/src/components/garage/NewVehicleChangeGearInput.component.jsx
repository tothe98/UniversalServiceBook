import {
  Autocomplete,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  ChangeGearIcon,
  DateIcon,
  DiscountOutlinedIcon,
} from "../../lib/GlobalIcons";
import { MyFormControll } from "../../lib/StyledComponents";

export default function NewVehicleChangeGearInput({
  newVehicleTransmission,
  setNewVehicleTransmission,
  MenuProps,
  vehicleTransmissions,
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
            <ChangeGearIcon />
          </Typography>
        </Grid>

        <Grid item xs={11}>
          <MyFormControll fullWidth>
            <InputLabel id="demo-simple-select-label">
              Sebességváltó *
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Sebességváltó"
              onChange={(e) => setNewVehicleTransmission(e.target.value)}
              value={newVehicleTransmission}
              MenuProps={MenuProps}
            >
              {vehicleTransmissions.map((x, i) => {
                return (
                  <MenuItem key={i + "xasda2"} value={x.id}>
                    {x.transmission}
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
