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
  CarTypeIcon,
  DateIcon,
  DiscountOutlinedIcon,
} from "../../lib/GlobalIcons";
import { MyFormControll } from "../../lib/StyledComponents";

export default function NewVehicleDesignTypeInput({
  vehicleDesignTypes,
  setNewVehicleDesignType,
  newVehicleDesignType,
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
            <CarTypeIcon />
          </Typography>
        </Grid>

        <Grid item xs={11}>
          <MyFormControll fullWidth>
            <InputLabel id="Kivitel-beviteli-mezo">Kivitel *</InputLabel>
            <Select
              labelId="Kivitel"
              id="Kivitel"
              label="Kivitel *"
              required
              onChange={(e) => setNewVehicleDesignType(e.target.value)}
              value={newVehicleDesignType}
              MenuProps={MenuProps}
            >
              {vehicleDesignTypes.map((x, i) => {
                return (
                  <MenuItem key={x + i} value={x.id}>
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
