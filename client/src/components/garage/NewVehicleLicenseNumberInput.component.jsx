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

export default function NewVehicleLicenseNumberInput({
  newVehicleLicenseNum,
  setNewVehicleLicenseNum,
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
            <TextsmsOutlinedIcon />
          </Typography>
        </Grid>

        <Grid item xs>
          <MyTextField
            fullWidth
            id="Rendszám"
            label="Rendszám"
            type="text"
            value={newVehicleLicenseNum}
            onChange={(e) => {
              const maxCount = parseInt(
                process.env.REACT_APP_MAXIMUM_LICENSE_PLATE_NUMBER_LENGTH
              );

              if (e.target.value.length < 0) {
                setNewVehicleLicenseNum("");
                setIsError(true);
                return;
              }

              if (e.target.value.length > maxCount) {
                setErrorMessageDuringCarAdd(
                  "alvázszám",
                  "Az alvázszám nem lehet hosszabb mint 18 karakter!"
                );
                setNewVehicleLicenseNum(
                  ("" + e.target.value).substring(0, maxCount)
                );
                setIsError(true);
                return;
              }
              setNewVehicleLicenseNum(e.target.value);
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
