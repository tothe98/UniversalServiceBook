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

export default function NewVehicleMOTInput({
  newVehicleDocumentValidity,
  setNewVehicleDocumentValidity,
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
            <DocumentsIcon />
          </Typography>
        </Grid>

        <Grid item xs>
          <MyTextField
            fullWidth
            id="outlined-disabled"
            value={newVehicleDocumentValidity}
            type="date"
            onChange={(e) => {
              const date = moment(e.target.valueAsDate);
              const isValidDate = date.isValid();

              if (!isValidDate) {
                setNewVehicleDocumentValidity(
                  moment(new Date()).format("YYYY-MM-DD")
                );
                setIsError(false);
                return;
              }

              const isCorrentDate = date.isBetween(
                moment("1950.01.01"),
                moment("2040.01.01")
              );

              if (!isCorrentDate) {
                setNewVehicleDocumentValidity(
                  moment(new Date()).format("YYYY-MM-DD")
                );
                setIsError(true);
                return;
              }

              setNewVehicleDocumentValidity(
                moment(e.target.valueAsDate).format("YYYY-MM-DD")
              );
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
