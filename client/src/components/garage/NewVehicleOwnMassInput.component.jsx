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
  CarWeightIcon,
  DateIcon,
  DiscountOutlinedIcon,
  DocumentsIcon,
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

export default function NewVehicleOwnMassInput({
  newVehicleOwnWeight,
  setErrorMessageDuringCarAdd,
  setNewVehicleOwnWeight,
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
        value={newVehicleOwnWeight}
      >
        <Grid item xs={1}>
          <Typography align="center">
            <CarWeightIcon />
          </Typography>
        </Grid>

        <Grid item xs>
          <MyTextField
            fullWidth
            id="outlined-disabled"
            label="Saját tömeg"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">kg</InputAdornment>
              ),
              inputProps: {
                style: {
                  textAlign: "start",
                  MozAppearance: "textfield",
                  WebkitAppearance: "textfield",
                  appearance: "textfield",
                },
              },
            }}
            default={0}
            value={newVehicleOwnWeight}
            type="number"
            onChange={(e) => {
              const maxCount = parseInt(process.env.REACT_APP_MAXIMUM_WEIGHT);

              if (e.target.value < 0) {
                setNewVehicleOwnWeight(0);
                setIsError(true);
                return;
              }

              if (e.target.value > maxCount) {
                setErrorMessageDuringCarAdd(
                  "alvázszám",
                  "Az alvázszám nem lehet hosszabb mint 18 karakter!"
                );
                setNewVehicleOwnWeight(maxCount);
                setIsError(true);
                return;
              }
              setNewVehicleOwnWeight(parseInt(e.target.value));
              setIsError(false);
            }}
          />
          <Typography variant="body1" sx={{ opacity: 0.7 }}>
            * Ezen mező értéke 1 és {process.env.REACT_APP_MAXIMUM_WEIGHT} kg
            lehet!
          </Typography>
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
