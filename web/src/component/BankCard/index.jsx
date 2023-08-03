import React, { useState } from "react";

import Alert from "../Alert";
import SliderCaptcha from "../SliderCaptcha";
import { Button, TextField } from "@mui/material";
import fetch from "../../fetch";
import "./index.scss";
import { useEffect } from "react";

const currentDate = new Date();
const formattedDate = currentDate.toISOString().split("T")[0]; // 将日期转换为字符串格式
function Register() {
  const [bankCard, setBankCard] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [isCode, setIsCode] = useState(false);
  const [bankTime, setBankTime] = useState(formattedDate);
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
        setUserInfo(res.data);
        setBankCode(res.data.bank_code);
        setBankCard(res.data.bank_card);
        setBankTime(res.data.bank_time || formattedDate);
      }
    );
  }, []);

  const callback = e => {
    setIsCode(e);
  };

  const balanceClick = e => {
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

  const onBlur = event => {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;
    if (
      new Date(`${event.target.value}`).getTime() < new Date(`${year}-${month}-01`).getTime()
    ) {
      setBankTime('')
      return Alert('The card has expired and cannot be paid')
    }
  };

  const bankClick = () => {
    if(bankCard.length !== 16){
      return Alert('The card no is 16 bits')
    }
    if(bankCode.length !== 3){
      return Alert('The cvc is 3 bits')
    }
    const data = {
      ...userInfo,
      bank_card: bankCard,
      bank_code: bankCode,
      bank_time: bankTime,
    };

    if (!isCode) {
      return Alert("The man-machine check is failed");
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
          Point： <span>{userInfo.integral || 0}</span>{" "}
        </span>
        <TextField
          label="Card No"
          variant="outlined"
          fullWidth
          value={bankCard}
          onChange={event => setBankCard(event.target.value)}
          margin="normal"
        />
        <div style={{ display: "flex", marginTop: "3%", marginBottom: "15px" }}>
          <TextField
            label="CVC"
            variant="outlined"
            style={{ marginRight: "10px" }}
            fullWidth
            value={bankCode.replace(/./g, "*")}
            onChange={event => setBankCode(event.target.value)}
            margin="normal"
          />
          <TextField
            label="Expiry"
            variant="outlined"
            fullWidth
            type={"date"}
            onBlur={onBlur}
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
