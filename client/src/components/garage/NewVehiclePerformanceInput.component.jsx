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
  PerformanceIcon,
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

export default function NewVehiclePerformanceInput({
  newVehiclePerformance,
  setErrorMessageDuringCarAdd,
  setNewVehiclePerformance,
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
            <PerformanceIcon />
          </Typography>
        </Grid>

        <Grid item xs>
          <Grid container direction="row">
            <Grid item xs>
              <MyTextField
                fullWidth
                id="outlined-disabled"
                label="Teljesítmény *"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">LE</InputAdornment>
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
                value={newVehiclePerformance}
                type="number"
                onChange={(e) => {
                  const maxCount = parseInt(
                    process.env.REACT_APP_MAXIMUM_PERFORMANCE_LE
                  );

                  if (e.target.value < 0) {
                    setNewVehiclePerformance(0);
                    setIsError(true);
                    return;
                  }

                  if (e.target.value > maxCount) {
                    setErrorMessageDuringCarAdd(
                      "alvázszám",
                      "Az alvázszám nem lehet hosszabb mint 18 karakter!"
                    );
                    setNewVehiclePerformance(maxCount);
                    setIsError(true);
                    return;
                  }
                  setNewVehiclePerformance(parseInt(e.target.value));
                  setIsError(false);
                }}
              />
            </Grid>
          </Grid>
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
