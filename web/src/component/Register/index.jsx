import React, { useState } from "react";
import { Button, TextField, Select, MenuItem, InputLabel } from "@mui/material";
import SliderCaptcha from "../SliderCaptcha"
import {
  AccountCircle,
  Person,
  Description,
  Phone,
  Lock,
  VisibilityOff,
} from "@mui/icons-material";
import fetch from "../../fetch";
import "./index.scss";
import Alert from "../Alert";

function Register() {
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [intro, setIntro] = useState("");
  const [phone, setPhone] = useState("");
  const [isCode, setIsCode] = useState(false);
  const [category, setCategory] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleNicknameChange = event => {
    setNickname(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleNameChange = event => {
    setName(event.target.value);
  };

  const handleConfirmPasswordChange = event => {
    setConfirmPassword(event.target.value);
  };

  const handleIntroChange = event => {
    setIntro(event.target.value);
  };

  const handlePhoneChange = event => {
    if(event.target.value.length > 10){
      return Alert('Please input correct phone number')
    }
    setPhone(event.target.value);
  };

  const callback = e => {
    setIsCode(e)
  }

  const handleCategoryChange = event => {
    setCategory(event.target.value);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };
  const handleSubmit = event => {
    event.preventDefault();
    let data = {
      nickname,
      name,
      intro,
      phone,
      password,
    };
    if(!(/([a-z])/.test(password))){
      return Alert('The password Missing lowercase letters')
    }
    if(!(/([A-Z])/.test(password))){
      return Alert('The password Missing capital letters')
    }
    if(!(/([0-9])/.test(password))){
      return Alert('Password missing digits')
    }
    if(password.length < 8){
      return Alert('The password must be larger than 8 digits')
    }
    if (Object.values(data).filter(item => !item).length) {
      return Alert("Complete information entry");
    }
    if (password !== confirmPassword) {
      return Alert("Two passwords do not match");
    }
    if(!isCode){
      return Alert("The man-machine check fails");
    }
    if(!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(nickname))){
      return Alert("Please enter the correct email address");
    }
    data = {
      ...data,
      bank_card: '',
      point_minute: 0,
      category: '',
      bank_code: '',
      bank_time: "",
      integral: 0,
      bank_name: ''
    }
    fetch(
      "/user/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      res => {
        Alert("success");
        window.location = "/login"
      }
    );
  };

  return (
    <div className="container">
      <div className="image-container">
        <img src="./images/background.png" alt="Login image" />
      </div>
      <div className="form-container">
        <h2>register</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="email"
            variant="outlined"
            value={nickname}
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
            type={'number'}
            InputProps={{
              startAdornment: <Phone color="disabled" />,
            }}
            margin="normal"
          />
          <TextField
            label="Password"
            variant="outlined"
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
            value={password}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            InputProps={{
              startAdornment: <Lock color="disabled" />,
            }}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            fullWidth
            margin="normal"
          />
          {/* <div style={{ width: "100%" }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              value={category}
              InputProps={{
                startAdornment: <Person color="disabled" />,
              }}
              variant="outlined"
              onChange={handleCategoryChange}
              fullWidth
            >
              <MenuItem value={1}>Administrator</MenuItem>
              <MenuItem value={2}>User</MenuItem>
              <MenuItem value={3}>Publisher</MenuItem>
            </Select>
          </div> */}
          <SliderCaptcha callback={callback}/>
          <Button variant="contained" color="primary" type="submit">
            Register
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Register;
