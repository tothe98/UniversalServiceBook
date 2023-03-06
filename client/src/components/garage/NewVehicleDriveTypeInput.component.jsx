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
  TankIcon,
  WheelIcon,
} from "../../lib/GlobalIcons";
import { MyFormControll, MyTextField } from "../../lib/StyledComponents";

export default function NewVehicleDriveTypeInput({
  setNewVehicleDriveType,
  newVehicleDriveType,
  MenuProps,
  vehicleDriveTypes,
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
            <WheelIcon />
          </Typography>
        </Grid>

        <Grid item xs={11}>
          <MyFormControll fullWidth>
            <InputLabel id="demo-simple-select-label">Hajtás *</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Hajtás *"
              onChange={(e) => setNewVehicleDriveType(e.target.value)}
              value={newVehicleDriveType}
              defaultValue={"hatso"}
              MenuProps={MenuProps}
            >
              {vehicleDriveTypes.map((x, i) => {
                return (
                  <MenuItem key={i + "xasda2"} value={x.id}>
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
