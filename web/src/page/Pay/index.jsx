import React, { useState, useEffect } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import {
  FaInfoCircle,
  FaCreditCard,
  FaCheck,
  FaUser,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaLock,
  FaParking,
} from "react-icons/fa";
import moment from "moment";
import Alert from "../../component/Alert";
import fetch from "../../fetch";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import { useMemo } from "react";

const steps = [
  { label: "Basic Information", icon: <FaInfoCircle /> },
  { label: "Payment", icon: <FaCreditCard /> },
  { label: "Conformation", icon: <FaCheck /> },
];

function convertTimeStr(isoTime) {
  const dateObj = new Date(isoTime);
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const date = dateObj.getDate().toString().padStart(2, "0");
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const seconds = dateObj.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}

let isType = 0; //1天 2小时

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [endTime, setEndTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [seconds, setSeconds] = useState(sessionStorage.seconds || 5 * 60);
  const [subscriptionPlan, setSubscriptionPlan] = useState("");
  const [userInfo, setUserInfo] = useState(JSON.parse(sessionStorage.userInfo));
  const [typeNum, setTypeNum] = useState(window.location.href.split("type="));
  const history = useNavigate();

  let payItem = sessionStorage.item ? JSON.parse(sessionStorage.item) : {};
  const [formData, setFormData] = useState({
    publisherName: "",
    subscriptionPlan: "",
    paymentMethod: "",
    cardNumber: "",
    expirationDate: "",
    securityCode: "",
    cardNumber: userInfo.bank_card,
    cardName: userInfo.name,
    securityCode: userInfo.bank_code,
    expirationDate: userInfo.bank_time,
  });

  const [intergral, setIntergral] = useState(0);
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    try {
      setTypeNum(typeNum[1]);
      if (typeNum[1]) {
        let setItem = JSON.parse(sessionStorage.payItem);
        setFormData({
          ...setItem.parking,
          publisherName: setItem.parking.name,
          expirationDate: setItem.expirationDate,
          securityCode: setItem.securityCode,
          price_per_hour: setItem.parking.price_per_day,
          price_per_hour: setItem.parking.price_per_hour,
          cardNumber: setItem.bank_card,
          cardName: setItem.bank_name,
          securityCode: setItem.bank_code,
          start_time: setItem.start_time,
          end_time: setItem.end_time,
          price: setItem.price,
          expirationDate: setItem.bank_time,
        });
        setActiveStep(typeNum[1] - 1);
      }
    } catch (error) {
      setTypeNum("");
    }
  }, []);

  useEffect(() => {
    fetch(
      "/user/" + userInfo.id,
      {
        method: "get",
      },
      res => {
        setUserInfo(res.data);
      }
    );
  }, []);

  const handleNext = () => {
    if (activeStep === 0) {
      if (!startTime || !endTime) {
        return Alert("Please select a start and end time");
      }
      if (new Date(startTime).getTime() >= new Date(endTime).getTime()) {
        return Alert("The end time should be before the start time");
      }
    } else if (activeStep === 1) {
      if (!formData.cardName) {
        return Alert("The name of the cardholder is blank");
      }
      if (!formData.cardNumber) {
        return Alert("The cardholder card number is empty");
      }
      if (!formData.expirationDate) {
        return Alert("The cardholder expiration time is empty");
      }
      if (!formData.securityCode) {
        return Alert("The security code is empty");
      }
    }

    setActiveStep(activeStep + 1);
  };

  const onBlur = event => {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;
    if (
      new Date(`${event.target.value}`).getTime() < new Date(`${year}-${month}-01`).getTime()
    ) {
      setFormData(res => ({
        ...res,
        expirationDate: '',
      }))
      return Alert('The card has expired and cannot be paid')
    }
  };
  
  const handleBack = () => {
    if (typeNum) {
      history("/table/history");
      return;
    }
    setActiveStep(activeStep - 1);
  };

  const goClick = async () => {
    
    // 计算自己的积分 (实际积分的积分)
    await fetch(
      "/user/" + userInfo.id,
      {
        method: "get",
      },
      async res => {
        if (res.code === "200") {
          const jf = Number(res.data.integral || 0) -
            parseInt(Number(intergral));
          // 计算自己的积分
          await fetch(
            "/user/" + userInfo.id,
            {
              method: "PUT",
              body: JSON.stringify({
                ...userInfo,
                integral: jf,
              }),
            },
            res => {}
          );
        }
      }
    );
    const data = {
      user_id: userInfo.id,
      start_time: convertTimeStr(startTime),
      end_time: convertTimeStr(endTime),
      service_change: amount * 0.15,
      bank_card: formData.cardNumber,
      bank_name: formData.cardName,
      bank_code: formData.securityCode,
      bank_time: formData.expirationDate,
      price: amount,
      integral: Number(parseInt(amount / 10)),//能获得多少积分
      type: isType,
      parking_id: payItem.id,
      total_prices: amount,
      state: 4,
    };
    await fetch(
      "/reserve",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      res => {
        if (res.code === "200") {
          Alert("success");
          setTimeout(() => {
            history("/table/history");
          }, 1000);
        }
      }
    );
    return;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const amount = useMemo(() => {
    if (!startTime || !endTime) {
      return 0;
    }
    const newStartTime = new Date(convertTimeStr(startTime));
    const newEndTime = new Date(convertTimeStr(endTime));
    const totalMs = Math.abs(newEndTime - newStartTime); // 计算两个时间的时间差（毫秒）
    const totalHours = totalMs / (60 * 60 * 1000); // 将时间差转换为小时数
    // 算出有多少天
    let toDay = parseInt(totalHours / 24);
    // 算出剩余多少小时
    let toHour = totalHours % 24;
    toHour = Math.ceil(toHour);
    let amount =
      toDay * payItem.price_per_day + toHour * payItem.price_per_hour;
    return amount - intergral / 10;
  }, [startTime, endTime, intergral]);

  const isSelect = (startTime, endTime) => {
    if (!startTime || !endTime) {
      return true;
    }
    const { reserve } = JSON.parse(sessionStorage.item);
    let is = true;
    // 要选择的时间段
    if (endTime) {
      const newStartTime = new Date(startTime);
      reserve.map(item => {
        if (item.state < 4) {
          return;
        }
        const existingStartTime = new Date(item.start_time);
        const existingEndTime = new Date(item.end_time);
        const newEndTime = new Date(endTime);

        if (
          newEndTime <= existingStartTime ||
          newStartTime >= existingEndTime
        ) {
        } else {
          is = false;
        }
      });
    }
    !is && Alert("Time conflicts, cannot be selected!");
    return is;
  };

  useEffect(() => {
    var startName = document.querySelector('[name="startTime"]');
    var endName = document.querySelector('[name="endTime"]');
    const { start_time, end_time } = JSON.parse(sessionStorage.item);
    startName.setAttribute(
      "min",
      moment(start_time).format("YYYY-MM-DDTHH:mm")
    );
    startName.setAttribute("max", moment(end_time).format("YYYY-MM-DDTHH:mm"));

    endName.setAttribute("min", moment(start_time).format("YYYY-MM-DDTHH:mm"));
    endName.setAttribute("max", moment(end_time).format("YYYY-MM-DDTHH:mm"));
  }, []);

  useEffect(() => {
    if (typeNum) {
      return;
    }
    const timer = setInterval(() => {
      setSeconds(prevSeconds => {
        sessionStorage.seconds = prevSeconds - 1;
        return prevSeconds - 1;
      });
    }, 1000);

    if (seconds === 0) {
      clearInterval(timer);
      Alert("Order closed");
      window.location.href = "/map";
    }

    return () => clearInterval(timer);
  }, [seconds, typeNum]);

  const startTimeFun = e => {
    // 已有的时间段

    var s = isSelect(e.target.value, endTime);

    s && setStartTime(e.target.value);
  };

  const endTimeFun = e => {
    // 已有的时间段

    var s = isSelect(startTime, e.target.value);

    s && setEndTime(e.target.value);
  };
  const integralChange = e => {
    console.log(e.target.value);
    if (!e.target.value) {
      setIntergral("");
      return;
    }
    if (isNaN(parseInt(e.target.value))) {
      return;
    }
    if (e.target.value > Number(userInfo.integral)) {
      return;
    }
    setIntergral(parseInt(e.target.value));
  };

  return (
    <div className="checkout">
      <div className="checkout__form">
        <Typography variant="h6" gutterBottom>
          payment information
        </Typography>

        {!typeNum && (
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(step => (
              <Step key={step.label}>
                <StepLabel icon={step.icon}>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        <div>
          {activeStep === 0 && (
            <div
              style={{
                lineHeight: "75px",
                paddingTop: "20px",
              }}
            >
              <TextField
                label="Provider"
                name="publisherName"
                fullWidth
                disabled
                value={payItem.info?.name}
                InputProps={{
                  startAdornment: <FaUser style={{ marginRight: "8px" }} />,
                }}
              />
              <TextField
                label="Location"
                name="parkingLocation"
                onChange={handleChange}
                disabled
                value={payItem.description}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <FaMapMarkerAlt style={{ marginRight: "8px" }} />
                  ),
                }}
              />
              <TextField
                label="Car type"
                name="parkingPrice"
                fullWidth
                disabled
                value={payItem.standard}
                InputProps={{
                  startAdornment: <FaParking style={{ marginRight: "8px" }} />,
                }}
              />

              <TextField
                label="Reservation type"
                name="subscriptionPlan"
                select
                fullWidth
                SelectProps={{ native: true }}
                value={subscriptionPlan}
                onChange={e => setSubscriptionPlan(e.target.value)}
                InputProps={{
                  startAdornment: <FaParking style={{ marginRight: "8px" }} />,
                }}
              >
                <option value="day">${payItem.price_per_day}/Day</option>
                <option value="hour">${payItem.price_per_hour}/Hour</option>
              </TextField>
              <TextField
                label="Start Time"
                name="startTime"
                fullWidth
                value={startTime}
                onChange={e => startTimeFun(e)}
                type={"datetime-local"}
                InputProps={{
                  startAdornment: (
                    <div className="startAdornment">
                      <FaCalendarAlt style={{ marginRight: "8px" }} />
                    </div>
                  ),
                }}
              />

              <TextField
                label="End Time"
                name="endTime"
                fullWidth
                value={endTime}
                min={startTime}
                onChange={e => endTimeFun(e)}
                type={"datetime-local"}
                InputProps={{
                  startAdornment: (
                    <div className="startAdornment">
                      <FaCalendarAlt style={{ marginRight: "8px" }} />
                    </div>
                  ),
                }}
              />

              <TextField
                label="Point"
                name="publisherName"
                onChange={e => integralChange(e)}
                value={intergral}
                InputProps={{
                  startAdornment: <FaUser style={{ marginRight: "8px" }} />,
                }}
              />
              <p className="inter">
                Rules for points: 10 points for 1 dollar.Point balance: {userInfo.integral}
              </p>
              <div className="pay_p">
                <p style={{ textAlign: "right" }}>
                  Point Discount：{intergral / 10}
                </p>
                <p style={{ textAlign: "right" }}>
                  Total Balance：{amount + intergral / 10}
                </p>
                <p style={{ textAlign: "right" }}>Payment：{amount}</p>
              </div>
            </div>
          )}
          {activeStep === 1 && (
            <div
              style={{
                lineHeight: "75px",
                paddingTop: "20px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                payment information
              </Typography>
              <TextField
                label="card holder"
                InputProps={{
                  startAdornment: <FaUser style={{ marginRight: "8px" }} />,
                }}
                name="cardName"
                value={formData.cardName}
                onChange={event =>
                  setFormData(res => ({ ...res, cardName: event.target.value }))
                }
                fullWidth
              />
              <TextField
                label="card number"
                InputProps={{
                  startAdornment: (
                    <FaCreditCard style={{ marginRight: "8px" }} />
                  ),
                }}
                name="cardNumber"
                onChange={event =>
                  setFormData(res => ({
                    ...res,
                    cardNumber: event.target.value,
                  }))
                }
                value={formData.cardNumber}
                fullWidth
              />
              <TextField
                label="expiration date"
                name="expirationDate" 
                className="muiFormControl-root-date"
                onBlur={onBlur}
                type={"date"}
                InputProps={{
                  startAdornment: (
                    <FaCalendarAlt style={{ marginRight: "8px" }} />
                  ),
                }}
                onChange={event =>
                  setFormData(res => ({
                    ...res,
                    expirationDate: event.target.value,
                  }))
                }
                value={formData.expirationDate}
              />
              <TextField
                label="CVC"
                name="securityCode"
                InputProps={{
                  startAdornment: <FaLock style={{ marginRight: "8px" }} />,
                }}
                value={formData.securityCode}
                onChange={event =>
                  setFormData(res => ({
                    ...res,
                    securityCode: event.target.value,
                  }))
                }
                fullWidth
              />
            </div>
          )}
          {activeStep === 2 && (
            <div>
              {!typeNum && (
                <Typography variant="h6" gutterBottom>
                  确认订单
                </Typography>
              )}

              <div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">name</Typography>
                  <Typography variant="subtitle1">{formData?.name}</Typography>
                </div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">address</Typography>
                  <Typography variant="subtitle1">{payItem.address}</Typography>
                </div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">card holder</Typography>
                  <Typography variant="subtitle1">
                    {formData.cardName}
                  </Typography>
                </div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">card number</Typography>
                  <Typography variant="subtitle1">
                    {formData.cardNumber}
                  </Typography>
                </div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">expiration date</Typography>
                  <Typography variant="subtitle1">
                    {formData.expirationDate}
                  </Typography>
                </div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">CVC</Typography>
                  <Typography variant="subtitle1">
                    {formData.securityCode}
                  </Typography>
                </div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">Predetermined type</Typography>
                  <Typography variant="subtitle1">
                    $
                    {subscriptionPlan === "day"
                      ? (formData.price_per_day || payItem.price_per_day) +
                        "/day"
                      : (formData.price_per_hour || payItem.price_per_hour) +
                        "/hour"}
                  </Typography>
                </div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">start time</Typography>
                  <Typography variant="subtitle1">
                    {!typeNum ? convertTimeStr(startTime) : formData.start_time}
                  </Typography>
                </div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">end time</Typography>
                  <Typography variant="subtitle1">
                    {!typeNum ? convertTimeStr(endTime) : formData.end_time}
                  </Typography>
                </div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">Parking spaces</Typography>
                  <Typography variant="subtitle1">
                    {!typeNum
                      ? amount + intergral / 10
                      : Number(formData.price)}
                  </Typography>
                </div>
                {/* <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">手续费</Typography>
                  <Typography variant="subtitle1">
                    {!typeNum ? (amount + (intergral / 10)) * 0.15 : formData.price * 0.15}
                  </Typography>
                </div> */}
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">Point deduction</Typography>
                  <Typography variant="subtitle1">{intergral / 10}</Typography>
                </div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">total money</Typography>
                  <Typography variant="subtitle1">
                    {!typeNum
                      ? Number(amount)
                      : Number(formData.price) + Number(formData.price) * 0.15}
                  </Typography>
                </div>
              </div>
            </div>
          )}
          <div className="checkout__actions">
            {activeStep === 0 ? (
              <div></div>
            ) : (
              <Button onClick={handleBack}>
                {typeNum ? "go back" : "previous"}
              </Button>
            )}
            {!typeNum && activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => goClick()}
              >
                submit
              </Button>
            ) : (
              !typeNum && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )
            )}
            {!typeNum && <div style={{ color: "red" }}>timer：{seconds}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
