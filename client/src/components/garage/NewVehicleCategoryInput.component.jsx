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
  DateIcon,
  DirectionsCarFilledOutlinedIcon,
  DiscountOutlinedIcon,
} from "../../lib/GlobalIcons";
import { MyFormControll } from "../../lib/StyledComponents";

export default function NewVehicleCategoryInput({
  vehicleTypes,
  newVehicleCategory,
  setNewVehicleCategory,
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
            <DirectionsCarFilledOutlinedIcon />
          </Typography>
        </Grid>

        <Grid item xs={11}>
          <MyFormControll fullWidth>
            <InputLabel id="Jármű kategória">Jármű kategória *</InputLabel>
            <Select
              labelId="Jármű kategória"
              id="Jármű kategória"
              label="Jármű kategória"
              required
              onChange={(e) => setNewVehicleCategory(e.target.value)}
              value={newVehicleCategory}
              defaultValue={vehicleTypes[0].id}
            >
              {vehicleTypes.map((x, i) => {
                return (
                  <MenuItem key={x + i} value={`${x.id}`}>
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
