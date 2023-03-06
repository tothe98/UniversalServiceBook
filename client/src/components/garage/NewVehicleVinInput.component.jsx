import {
  Autocomplete,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useState } from "react";
import {
  DateIcon,
  DiscountOutlinedIcon,
  DocumentsIcon,
  EnergySavingsLeafOutlinedIcon,
  TankIcon,
  TextsmsOutlinedIcon,
  WarningIcon,
  WheelIcon,
} from "../../lib/GlobalIcons";
import {
  MyFormControll,
  MyTextField,
  WarningImage,
} from "../../lib/StyledComponents";

export default function NewVehicleVinInput({
  newVehicleVin,
  setNewVehicleVin,
  setErrorMessageDuringCarAdd,
}) {
  const [isError, setIsError] = useState(false);

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
            <EnergySavingsLeafOutlinedIcon />
          </Typography>
        </Grid>
        <Grid item xs>
          <MyTextField
            fullWidth
            id="Alvázszám"
            label="Alvázszám"
            type="text"
            value={newVehicleVin}
            required
            onChange={(e) => {
              const maxCount = parseInt(
                process.env.REACT_APP_MAXIMUM_VIN_LENGTH
              );

              if (e.target.value.length < 0) {
                setNewVehicleVin("");
                setIsError(true);
                return;
              }

              if (e.target.value.length > maxCount) {
                setErrorMessageDuringCarAdd(
                  "alvázszám",
                  "Az alvázszám nem lehet hosszabb mint 18 karakter!"
                );
                setNewVehicleVin(("" + e.target.value).substring(0, maxCount));
                setIsError(true);
                return;
              }
              setNewVehicleVin(e.target.value);
              setIsError(false);
            }}
          />
        </Grid>

        {isError && (
          <Grid item sx={{ padding: "0.4em 0.5em" }}>
            <Tooltip title="Hibás értéket adott meg!">
              <WarningImage src={WarningIcon} />
            </Tooltip>
          </Grid>
        )}
      </Grid>
    </>
  );
}
