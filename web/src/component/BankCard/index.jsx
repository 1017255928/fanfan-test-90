import React, { useState } from "react";

import Alert from "../Alert";
import SliderCaptcha from "../SliderCaptcha";
import { Button, TextField } from "@mui/material";
import fetch from "../../fetch";
import "./index.scss";
import { useEffect } from "react";

function Register() {
  const [bankCard, setBankCard] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [isCode, setIsCode] = useState(false);
  const [bankTime, setBankTime] = useState("");
  const [userInfo, setUserInfo] = useState(
    sessionStorage.userInfo ? JSON.parse(sessionStorage.userInfo) : {}
  );
  useEffect(() => {
    fetch(
      "/user/" + userInfo.id,
      {
        method: "get",
      },
      res => {
        setUserInfo(res.data)
        setBankCode(res.data.bank_code);
        setBankTime(res.data.bank_time);
      }
    );
  }, []);

  const callback = e => {
    setIsCode(e);
  };

  const balanceClick = e => {
    console.log(e);
    const data = {
      ...userInfo,
      point_minute: 0,
    };

    fetch(
      "/user/" + userInfo.id,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      res => {
        Alert("success");
        sessionStorage.userInfo = JSON.stringify({
          ...userInfo,
          ...data,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    );
  };

  const bankClick = () => {
    const data = {
      ...userInfo,
      bank_card: bankCard,
      bank_code: bankCode,
      bank_time: bankTime,
    };

    if (!isCode) {
      return Alert("The man-machine check fails");
    }
    fetch(
      "/user/" + userInfo.id,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      res => {
        Alert("success");
        sessionStorage.userInfo = JSON.stringify({
          ...userInfo,
          ...data,
        });
        window.location.reload();
      }
    );
  };
  return (
    <div className="BankCard">
      <div style={{ marginLeft: "20px" }}>
        <span>
          Balance： <span>{userInfo.point_minute}</span>{" "}
          <button onClick={balanceClick}>Withdraw</button>
        </span>
        <span>
          积分： <span>{userInfo.integral || 0}</span>{" "}
          <button onClick={balanceClick}>Withdraw</button>
        </span>
        <TextField
          label="Account Name"
          variant="outlined"
          fullWidth
          value={bankCard}
          onChange={event => setBankCard(event.target.value)}
          margin="normal"
        />
        <div style={{ display: "flex", marginTop: "3%", marginBottom: "15px" }}>
          <TextField
            label="BSB"
            variant="outlined"
            style={{ marginRight: "10px" }}
            fullWidth
            value={bankCode}
            onChange={event => setBankCode(event.target.value)}
            margin="normal"
          />
          <TextField
            label="Account Time"
            variant="outlined"
            fullWidth
            value={bankTime}
            onChange={event => setBankTime(event.target.value)}
            margin="normal"
          />
        </div>
        <SliderCaptcha callback={callback} />
        <Button
          variant="contained"
          style={{
            float: "right",
            marginTop: "10px",
          }}
          color="primary"
          onClick={bankClick}
          type="submit"
        >
          Save Change
        </Button>
      </div>
    </div>
  );
}

export default Register;