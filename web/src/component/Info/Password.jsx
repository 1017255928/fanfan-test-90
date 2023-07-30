import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import Alert from "../Alert";
import SliderCaptcha from "../SliderCaptcha";

const ChangePasswordDialog = ({ open, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCode, setIsCode] = useState(false);

  const handleConfirm = () => {
    if (!isCode) {
      return Alert("The man-machine verification fails. Procedure");
    }
    
    // 在这里处理确认按钮的逻辑
    if (JSON.parse(sessionStorage.userInfo).password !== oldPassword) {
      return Alert("Wrong password");
    }

    if (newPassword !== confirmPassword) {
      return Alert("Password inconsistency");
    }

    
    if(!(/([a-z])/.test(newPassword))){
      return Alert('缺少小写字母')
    }
    if(!(/([A-Z])/.test(newPassword))){
      return Alert('缺少大写字母')
    }
    if(!(/([0-9])/.test(newPassword))){
      return Alert('缺少数字')
    }
    if(newPassword.length < 8){
      return Alert('密码必须大于8位数')
    }

    // ...
    onClose(newPassword); // 关闭弹框
  };

  const callback = e => {
    setIsCode(e);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <TextField
          label="Old password"
          type="password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <div style={{ marginLeft: "4%" }}>
        <SliderCaptcha callback={callback} />
      </div>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordDialog;
