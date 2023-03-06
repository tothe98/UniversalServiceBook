import { Autocomplete, Grid, TextField, Typography } from "@mui/material";
import { DateIcon, DiscountOutlinedIcon } from "../../lib/GlobalIcons";
import { MyFormControll } from "../../lib/StyledComponents";

export default function NewVehicleBrandInput({
  vehicleManufacturers,
  newVehicleManufacture,
  setNewVehicleManufacture,
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
            <DiscountOutlinedIcon />
          </Typography>
        </Grid>

        <Grid item xs={11}>
          <MyFormControll fullWidth>
            <Autocomplete
              fullWidth
              disablePortal
              id="Jármű márkája"
              options={vehicleManufacturers.map((x, i) => {
                return {
                  label: x.manufacture,
                  id: x.id,
                };
              })}
              value={newVehicleManufacture["label"]}
              onChange={(event, newValue) => {
                setNewVehicleManufacture(newValue ? newValue : " ");
              }}
              renderInput={(params) => (
                <TextField {...params} label="Jármű márkája *" />
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
