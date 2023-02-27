import React, { Component } from "react";
import { useState } from "react";
import {
  Languages,
  MessageStatusCodes,
  getFieldMessage,
} from "../config/MessageHandler";
import { axiosInstance } from "../lib/GlobalConfigs";
import { Grid, theme, toast } from "../lib/GlobalImports";
import { SubTitle } from "../lib/StyledComponents";
import { MyTextField, SendButton } from "../lib/StyledComponents";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const sendForgotPasswordRequest = async () => {
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
    }, Number(process.env.REACT_APP_BUTTON_CLICK_TIMEOUT));

    if (!email) {
      toast.error(
        getFieldMessage(Languages.hu, "e-mail", MessageStatusCodes.error)
      );
      return;
    }
    if (!(email.includes("@") && email.includes("."))) {
      toast.error(
        getFieldMessage(Languages.hu, "e-mail", MessageStatusCodes.warning)
      );
    }

    await axiosInstance
      .post("/forgotPassword", { email: email })
      .then((res) => {
        if (res.status == 200) {
          setEmail("");
          toast.success("E-mail elküldve!");
        }
      })
      .catch((err) => {
        if (err.response.status == 422) {
          toast.error("Ooops! E-mail mező nincs kitöltve!");
        }
        if (err.response.status == 404) {
          toast.error("Ooops! Nem létezik ez az e-mail cím!");
        }
        setEmail("");
      });
  };

  return (
    <>
      <SubTitle sx={{ marginTop: "30px" }} variant="h3">
        Elfelejtett jelszó kérelem
      </SubTitle>

      <Grid container direction="column">
        <Grid item>
          <MyTextField
            fullWidth
            id="outlined-disabled"
            label="E-mail cím"
            value={email}
            default={""}
            color="success"
            type="email"
            sx={{ maxWidth: "500px" }}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </Grid>
        <Grid item>
          {isSent ? (
            <SendButton disabled>Küldés</SendButton>
          ) : (
            <SendButton onClick={(e) => sendForgotPasswordRequest()}>
              Küldés
            </SendButton>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default ForgotPassword;
