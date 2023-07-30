import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { AccountCircle, Lock } from "@mui/icons-material";
import SliderCaptcha from "../SliderCaptcha"
import fetch from '../../fetch'
import "./index.scss";
import { useEffect } from "react";
import Alert from "../Alert";

function Login() {
  const [nickname, setUsername] = useState("");
  const [isCode, setIsCode] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(()=>{
    if(sessionStorage.userInfo){
      window.location.reload()
      sessionStorage.userInfo = ''
    }
  },[])

  const handleUsernameChange = event => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  const callback = e => {
    setIsCode(e)
  }

  const handleSubmit = event => {
    event.preventDefault();
    if(!isCode){
      return Alert('The man-machine verification fails. Procedure')
    }
    fetch('/user/login', {
      method: 'POST',
      body: JSON.stringify({
        nickname: nickname,
        password
      })
    },res =>{
      if(res.code === '200'){
        Alert('success')
        sessionStorage.userInfo = JSON.stringify(res.data)
        window.location = "/"
      }
    })
  };

  return (
    <div className="container">
      <div className="image-container">
        <img src="./images/background.png" alt="Login image" />
      </div>
      <div className="form-container">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <TextField
            label="email"
            variant="outlined"
            value={nickname}
            onChange={handleUsernameChange}
            fullWidth
            InputProps={{
              startAdornment: <AccountCircle color="disabled" />,
            }}
            margin="normal"
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            InputProps={{
              startAdornment: <Lock color="disabled" />,
            }}
            fullWidth
            margin="normal"
          />
          <SliderCaptcha callback={callback}/>
          <Button variant="contained" color="primary" type="submit">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
