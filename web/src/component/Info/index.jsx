import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import ChangePasswordDialog from "./Password";
import { useNavigate } from "react-router-dom";
import { AccountCircle, Person, Description, Phone } from "@mui/icons-material";
import fetch from "../../fetch";
import Alert from "../Alert";
import "./index.scss";

let userInfo = sessionStorage.userInfo
  ? JSON.parse(sessionStorage.userInfo)
  : {};

function Register() {
  const [nickname, setNickname] = useState(userInfo.nickname || "");
  const [name, setName] = useState(userInfo.name || "");
  const [intro, setIntro] = useState(userInfo.intro || "");
  const [phone, setPhone] = useState(userInfo.phone || "");
  const [category, setCategory] = useState(userInfo.category || "");
  const [password, setPassword] = useState(userInfo.password || "");
  const [showPassword, setShowPassword] = useState(false);
  const history = useNavigate();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = res => {
    if (typeof res === "string") {
      setPassword(res);
      handleSubmit();
    }
    setOpen(false);
  };

  const handleNicknameChange = event => {
    setNickname(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleNameChange = event => {
    setName(event.target.value);
  };

  const handleIntroChange = event => {
    setIntro(event.target.value);
  };

  const handlePhoneChange = event => {
    setPhone(event.target.value);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handleSubmit = event => {
    event && event.preventDefault();
    const data = {
      ...userInfo,
      nickname,
      name,
      intro,
      phone,
      category,
      password,
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
        window.location.reload();
      }
    );
  };

  return (
    <div className="info-container">
      <div>
        <p>profile</p>
        <img src="/27ddc832-b720-420e-85ac-5b4ff3b63d8e.png" alt="" />
        <div
          onClick={handleOpen}
          style={{ height: "51px", background: "#ddd", lineHeight: "51px" }}
        >
          Change Password
        </div>
        <div
          onClick={() => history("/table")}
          style={{
            height: "51px",
            background: "#ddd",
            lineHeight: "51px",
            marginTop: "5px",
          }}
        >
          Manage Listing
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <TextField
          label="email"
          variant="outlined"
          value={nickname}
          disabled
          onChange={handleNicknameChange}
          fullWidth
          InputProps={{
            startAdornment: <AccountCircle color="disabled" />,
          }}
          margin="normal"
        />
        <TextField
          label="Name"
          variant="outlined"
          value={name}
          onChange={handleNameChange}
          fullWidth
          InputProps={{
            startAdornment: <Person color="disabled" />,
          }}
          margin="normal"
        />
        <TextField
          label="Intro"
          variant="outlined"
          value={intro}
          onChange={handleIntroChange}
          fullWidth
          InputProps={{
            startAdornment: <Description color="disabled" />,
          }}
          margin="normal"
        />
        <TextField
          label="Phone"
          variant="outlined"
          value={phone}
          onChange={handlePhoneChange}
          fullWidth
          InputProps={{
            startAdornment: <Phone color="disabled" />,
          }}
          margin="normal"
        />
        <ChangePasswordDialog open={open} onClose={handleClose} />
        {/* <TextField
          label="Password"
          variant="outlined"
          value={password}
          type={showPassword ? "text" : "password"}
          InputProps={{
            startAdornment: <Lock color="disabled" />,
            endAdornment: (
              <VisibilityOff
                color="disabled"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              />
            ),
          }}
          onChange={handlePasswordChange}
          fullWidth
          margin="normal"
        /> */}
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Register;
