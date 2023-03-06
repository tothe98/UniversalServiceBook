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
  AccountTreeOutlinedIcon,
  DateIcon,
  DiscountOutlinedIcon,
  DocumentsIcon,
  TankIcon,
  TextsmsOutlinedIcon,
  WheelIcon,
} from "../../lib/GlobalIcons";
import { MyFormControll, MyTextField } from "../../lib/StyledComponents";

export default function NewVehicleModelInput({
  vehicleModels,
  setNewVehicleModel,
  newVehicleModel,
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
            <AccountTreeOutlinedIcon />
          </Typography>
        </Grid>

        <Grid item xs={11}>
          <MyFormControll fullWidth>
            <Autocomplete
              fullWidth
              disablePortal
              id="Jármű modell"
              options={vehicleModels.map((x, i) => {
                return {
                  label: x.model,
                  id: x.id,
                };
              })}
              value={newVehicleModel["label"]}
              onChange={(event, newValue) => {
                setNewVehicleModel(newValue ? newValue : " ");
              }}
              renderInput={(params) => (
                <TextField {...params} label="Jármű modell *" />
              )}
            />
          </MyFormControll>
          <Typography variant="body1" sx={{ opacity: "0.6" }}>
            * Kérjük, hogy a mezőbe írt értéknek megfelelőt válassza ki a
            legördülő listából.
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
