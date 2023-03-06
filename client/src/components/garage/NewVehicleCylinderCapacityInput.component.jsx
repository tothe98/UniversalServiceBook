import {
  Autocomplete,
  Grid,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  DateIcon,
  DiscountOutlinedIcon,
  TankIcon,
  WarningIcon,
} from "../../lib/GlobalIcons";
import {
  MyFormControll,
  MyTextField,
  WarningImage,
} from "../../lib/StyledComponents";

export default function NewVehicleCylinderCapacityInput({
  newVehicleCylinderCapacity,
  setErrorMessageDuringCarAdd,
  setNewVehicleCylinderCapacity,
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
            <TankIcon />
          </Typography>
        </Grid>

        <Grid item xs>
          <MyTextField
            fullWidth
            id="outlined-disabled"
            label="Hengerűrtartalom *"
            type="number"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  cm<sup>3</sup>
                </InputAdornment>
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
            value={newVehicleCylinderCapacity}
            onChange={(e) => {
              const maxCount = parseInt(
                process.env.REACT_APP_MAXIMUM_CYLINDER_CAPACITY
              );

              if (e.target.value < 0) {
                setNewVehicleCylinderCapacity(0);
                setIsError(true);
                return;
              }

              if (e.target.value > maxCount) {
                setErrorMessageDuringCarAdd(
                  "alvázszám",
                  "Az alvázszám nem lehet hosszabb mint 18 karakter!"
                );
                setNewVehicleCylinderCapacity(maxCount);
                setIsError(true);
                return;
              }
              setNewVehicleCylinderCapacity(parseInt(e.target.value));
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
