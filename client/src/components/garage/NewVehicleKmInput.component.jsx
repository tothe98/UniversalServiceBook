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
import { useState } from "react";
import {
  DateIcon,
  DiscountOutlinedIcon,
  KmIcon,
  TankIcon,
  WarningIcon,
  WheelIcon,
} from "../../lib/GlobalIcons";
import {
  MyFormControll,
  MyTextField,
  WarningImage,
} from "../../lib/StyledComponents";

export default function NewVehicleKMInput({
  newVehicleKm,
  setErrorMessageDuringCarAdd,
  setNewVehicleKm,
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
        value={newVehicleKm}
      >
        <Grid item xs={1}>
          <Typography align="center">
            <KmIcon />
          </Typography>
        </Grid>

        <Grid item xs>
          <MyTextField
            fullWidth
            id="outlined-disabled"
            label="Km. óra állás *"
            type="number"
            value={newVehicleKm}
            InputProps={{
              inputProps: {
                style: {
                  textAlign: "start",
                  MozAppearance: "textfield",
                  WebkitAppearance: "textfield",
                  appearance: "textfield",
                },
              },
            }}
            onChange={(e) => {
              const maxCount = parseInt(process.env.REACT_APP_MAXIMUM_KM);
              const eventValue = parseInt(e.target.value);

              if (eventValue < 0) {
                setNewVehicleKm(0);
                setIsError(true);
                return;
              }

              if (eventValue > maxCount) {
                setErrorMessageDuringCarAdd(
                  "alvázszám",
                  "Az alvázszám nem lehet hosszabb mint 18 karakter!"
                );
                setNewVehicleKm(maxCount);
                setIsError(true);
                return;
              }
              setNewVehicleKm(eventValue);
              setIsError(false);
            }}
          />
          <Typography variant="body1" sx={{ opacity: 0.7 }}>
            * Ezen mező értéke 1 és {process.env.REACT_APP_MAXIMUM_KM} km lehet!
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
