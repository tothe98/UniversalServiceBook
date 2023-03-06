import { Autocomplete, Grid, TextField, Typography } from "@mui/material";
import { DateIcon } from "../../lib/GlobalIcons";
import { MyFormControll } from "../../lib/StyledComponents";

export default function NewVehicleVintagesInput({
  setNewVehicleVintage,
  newVehicleVintage,
  vehicleVintages,
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
            <DateIcon />
          </Typography>
        </Grid>

        <Grid item xs={11}>
          <MyFormControll fullWidth>
            <Autocomplete
              fullWidth
              disablePortal
              id="jarmu-évjáratok"
              options={Array.from(vehicleVintages).map((year, i) => {
                return {
                  label: `${year}`,
                  value: year,
                };
              })}
              value={newVehicleVintage["label"]}
              onChange={(event, newValue) => {
                setNewVehicleVintage(newValue ? newValue : " ");
              }}
              renderInput={(params) => (
                <TextField {...params} label="Jármű évjárat *" />
              )}
            />
          </MyFormControll>
        </Grid>
      </Grid>
    </>
  );
}
