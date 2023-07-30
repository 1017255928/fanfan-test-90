import React, { useState } from "react";
import Alert from "../Alert";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import NewMap from "../../component/NewMap";
import xhr from "../../fetch";
import "./index.scss";
import { useEffect } from "react";
import { useCallback } from "react";

const ariaLabel = { "aria-label": "description" };
export default function TemporaryDrawer(props) {
  const [imgs, setImgs] = useState([]);
  const handleFileChange = event => {
    const file = event.target.files[0];
    // TODO: 处理上传逻辑
    const formData = new FormData();
    formData.append("file", file);
    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then(response => response.json())
      .then(response => {
        var newImg = imgs;
        newImg.push(response.data);
        event.target.value = "";
        setImgs(JSON.parse(JSON.stringify(newImg)));
      });
  };

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price_per_day, setPricePerDay] = useState("");
  const [price_per_hour, setPricePerHour] = useState("");
  const [address, setAddress] = useState("");
  const [standard, setStandard] = useState("");
  const [addressNum, setAddressNum] = useState({});
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [toAccess, setToAccess] = useState("");
  const [size, setSize] = useState("");

  function newDay(s) {
    const date = new Date(s);
    const year = date.getFullYear(); // 获取年份
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份前面补0
    const day = String(date.getDate()).padStart(2, "0"); // 日期前面补0
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    setDescription(!props.msg ? "" : props.msg.description);
    setName(!props.msg ? "" : props.msg.name);
    setPricePerDay(!props.msg ? "" : props.msg.price_per_day);
    setPricePerHour(!props.msg ? "" : props.msg.price_per_hour);
    setAddress(!props.msg ? "" : props.msg.address);
    setStandard(!props.msg ? "" : props.msg.standard);
    setStartTime(!props.msg ? "" : newDay(props.msg.start_time));
    setEndTime(!props.msg ? "" : newDay(props.msg.end_time));
    setToAccess(!props.msg ? "" : props.msg.to_access);
    setSize(!props.msg ? "" : props.msg.size);
    setImgs(!props.msg ? [] : props.msg.images.split(","));
  }, [props.msg]);

  const mapClick = useCallback(res => {
    setAddressNum(res);
  }, []);

  const isEndTime = (e) => {
    console.log(e.target.value)
    setEndTime(e.target.value)
  }

  const addOrUpdate = res => {
    if(!startTime){
      return Alert('必须输入开始时间')
    }
    if(new Date(endTime).getTime() < new Date(startTime).getTime()){
      return Alert('结束时间必须大于开始时间')
    }
    return
    let data = {
      name,
      description,
      price_per_day,
      price_per_hour,
      address,
      standard,
    };
    data.user_id = props?.msg?.user_id || JSON.parse(sessionStorage.userInfo)?.id;
    var mew_img = JSON.parse(JSON.stringify(imgs));
    data.images = mew_img.join(",");
    data.visible = 1;
    data.latitude = addressNum.lat;
    data.longitude = addressNum.lng;
    data.start_time = startTime;
    data.end_time = endTime;
    data.to_access = toAccess;
    data.size = size;

    if (props.msg) {
      xhr(
        "/parking/" + props.msg.id,
        {
          method: "PUT",
          body: JSON.stringify(data),
        },
        res => {
          if (res.code === "200") {
            Alert("success");
            props.setOpen(false);
          }
        }
      );
      return;
    }

    xhr(
      "/parking",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      res => {
        if (res.code === "200") {
          Alert("success");
          props.setOpen(false);
        }
      }
    );
  };
  return (
    <div>
      <Dialog maxWidth="800px" open={props.open}>
        <div className="drawer">
          <div>
            <div className="drawer-item">
              <span>title</span>
              <Input
                value={name}
                disabled={props.disabled}
                onChange={e => setName(e.target.value)}
                multiline
                inputProps={ariaLabel}
              />
            </div>
            <div className="drawer-item">
              <span>Description</span>
              <Input
                disabled={props.disabled}
                value={description}
                onChange={e => setDescription(e.target.value)}
                multiline
                inputProps={ariaLabel}
              />
            </div>
            <div className="drawer-item">
              <span>Price per day</span>
              <Input
                disabled={props.disabled}
                value={price_per_day}
                type={'number'}
                onChange={e => setPricePerDay(e.target.value)}
              />
            </div>
            <div className="drawer-item">
              <span>Price per hour</span>
              <Input
                value={price_per_hour}
                type={'number'}
                disabled={props.disabled}
                onChange={e => setPricePerHour(e.target.value)}
              />
            </div>
            <div className="drawer-item">
              <span>Address</span>
              <Input
                value={address}
                disabled={props.disabled}
                onChange={e => setAddress(e.target.value)}
                multiline
                inputProps={ariaLabel}
              />
            </div>
            <div className="drawer-item">
              <span>访问方式</span>
              <Input
                value={toAccess}
                disabled={props.disabled}
                onChange={e => setToAccess(e.target.value)}
                multiline
                inputProps={{
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                }}
              />
            </div>
            <div className="drawer-item" style={{ display: "flex" }}>
              <span>可选的时间</span>
              <div>
                <div>
                  <label
                    style={{ marginRight: "10px", fontSize: "12px" }}
                    for="start"
                  >
                    开始时间:
                  </label>
                  <input
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    defaultValue={new Date().toISOString().split("T")[0]}
                    min={new Date().toISOString().split("T")[0]}
                    type="datetime-local"
                  />
                </div>

                <div>
                  <label
                    style={{ marginRight: "10px", fontSize: "12px" }}
                    for="end"
                  >
                    结束时间:
                  </label>
                  <input
                    defaultValue={startTime || new Date().toISOString().split(".")[0]}
                    value={endTime}
                    onChange={e => isEndTime(e)}
                    min={startTime}
                    type="datetime-local"
                  />
                </div>
              </div>
            </div>
            <div className="drawer-item">
              <span>可停放类</span>
              <Input
                value={standard}
                disabled={props.disabled}
                onChange={e => setStandard(e.target.value)}
                multiline
                inputProps={{
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                }}
              />
            </div>
          </div>
          <div className="drawer-item">
            <span>车位大小</span>

            <Input
              value={size}
              disabled={props.disabled}
              onChange={e => setSize(e.target.value)}
              multiline
              inputProps={{
                pattern: "[0-9]*",
                inputMode: "numeric",
              }}
            />
          </div>

          <div className="drawer-item" style={{ display: "flex" }}>
            <span>地图标记</span>
            <div>
              {addressNum.lat || props.msg?.latitude || ""},{" "}
              {addressNum.lng || props.msg?.longitude || ""}{" "}
            </div>
          </div>
          <NewMap
            lat={props.msg?.latitude}
            lng={props.msg?.longitude}
            onClick={mapClick}
          ></NewMap>
          <div className="drawer-item" style={{ display: "flex" }}>
            <span>图片</span>
            {!props.disabled && (
              <div style={{ overflow: "hidden" }}>
                <div className="upload-container">
                  <span
                    className="plus"
                    onClick={() =>
                      document.querySelector('input[type="file"]').click()
                    }
                  >
                    +
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            )}

            <div className="img-map">
              {imgs.map(item => (
                <div>
                  <img style={{ width: "84px",height: "84px" }} src={item}></img>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <Button variant="contained" onClick={() => props.setOpen(false)}>
              取消
            </Button>
            {!props.disabled && (
              <Button
                style={{ marginLeft: "10px" }}
                onClick={() => addOrUpdate()}
                variant="contained"
              >
                {props.msg ? "修改" : "新增"}
              </Button>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
