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
  { label: "基础信息", icon: <FaInfoCircle /> },
  { label: "支付确认", icon: <FaCreditCard /> },
  { label: "确认订单", icon: <FaCheck /> },
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
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    if (typeNum) {
      history("/table/history");
      return;
    }
    setActiveStep(activeStep - 1);
  };

  const goClick = () => {
    // 处理钱 拿到之前的 然后计算后从新用
    const { user_id } = JSON.parse(sessionStorage.item);
    fetch(
      "/user/" + user_id,
      {
        method: "get",
      },
      res => {
        if (res.code === "200") {
          // 计算商家的金额
          var cw = amount + intergral / 10;
          fetch(
            "/user/" + user_id,
            {
              method: "PUT",
              body: JSON.stringify({
                ...res.data,
                point_minute: Number(res.data.point_minute) + cw * 0.85,
              }),
            },
            res => {}
          );
          const integral =
            Number(res.data.integral || 0) + Number(parseInt(amount / 10));
          // 计算自己的积分
          fetch(
            "/user/" + userInfo.id,
            {
              method: "PUT",
              body: JSON.stringify({
                ...userInfo,
                integral,
              }),
            },
            res => {
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
                integral,
                type: isType,
                parking_id: payItem.id,
                total_prices: amount + amount * 0.15,
                state: 4,
              };
              fetch(
                "/reserve",
                {
                  method: "POSt",
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
            }
          );
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
    if (totalHours <= 9) {
      const amount = Math.ceil(totalHours) * payItem.price_per_hour;
      isType = 2;
      return amount - intergral / 10;
    } else {
      const days = Math.floor(totalHours / 24); // 计算停车的天数
      const remainderHours = totalHours % 24; // 计算除去整天后剩余的小时数
      const amount =
        days * payItem.price_per_day +
        Math.ceil(remainderHours / 9) * payItem.price_per_day;
      isType = 1;
      return amount - intergral / 10;
    }
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
    startName.setAttribute(
      "max",
      moment(end_time).format("YYYY-MM-DDTHH:mm")
    );
    
    endName.setAttribute(
      "min",
      moment(start_time).format("YYYY-MM-DDTHH:mm")
    );
    endName.setAttribute(
      "max",
      moment(end_time).format("YYYY-MM-DDTHH:mm")
    );
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
    console.log(e.target.value)
    if(!e.target.value){
      setIntergral('')
      return
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
          计费信息
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
                label="发布者名称"
                name="publisherName"
                fullWidth
                disabled
                value={payItem.info?.name}
                InputProps={{
                  startAdornment: <FaUser style={{ marginRight: "8px" }} />,
                }}
              />
              <TextField
                label="车位位置"
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
                label="可停放类型"
                name="parkingPrice"
                fullWidth
                disabled
                value={payItem.standard}
                InputProps={{
                  startAdornment: <FaParking style={{ marginRight: "8px" }} />,
                }}
              />

              <TextField
                label="预定类型"
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
                <option value="day">${payItem.price_per_day}/天</option>
                <option value="hour">${payItem.price_per_hour}/小时</option>
              </TextField>
              <TextField
                label="开始时间"
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
                label="结束时间"
                name="endTime"
                fullWidth
                value={endTime}
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
                label="积分抵扣"
                name="publisherName"
                onChange={e => integralChange(e)}
                value={intergral}
                InputProps={{
                  startAdornment: <FaUser style={{ marginRight: "8px" }} />,
                }}
              />
              <p className="inter">
                积分抵扣规则：10积分兑换1美元，可使用积分：{userInfo.integral}
              </p>
              <div className="pay_p">
                <p style={{ textAlign: "right" }}>
                  积分抵扣：{intergral / 10}元
                </p>
                <p style={{ textAlign: "right" }}>
                  总金额：{amount + intergral / 10}元
                </p>
                <p style={{ textAlign: "right" }}>需支付价格：{amount}元</p>
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
                支付信息
              </Typography>
              <TextField
                label="持卡人姓名"
                InputProps={{
                  startAdornment: <FaUser style={{ marginRight: "8px" }} />,
                }}
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="卡号"
                InputProps={{
                  startAdornment: (
                    <FaCreditCard style={{ marginRight: "8px" }} />
                  ),
                }}
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="过期日期"
                name="expirationDate"
                InputProps={{
                  startAdornment: (
                    <FaCalendarAlt style={{ marginRight: "8px" }} />
                  ),
                }}
                value={formData.expirationDate}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="安全码"
                name="securityCode"
                InputProps={{
                  startAdornment: <FaLock style={{ marginRight: "8px" }} />,
                }}
                value={formData.securityCode}
                onChange={handleChange}
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
                  <Typography variant="subtitle1">发布者名称</Typography>
                  <Typography variant="subtitle1">{formData?.name}</Typography>
                </div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">车位位置</Typography>
                  <Typography variant="subtitle1">{payItem.address}</Typography>
                </div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">姓名</Typography>
                  <Typography variant="subtitle1">
                    {formData.cardName}
                  </Typography>
                </div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">卡号</Typography>
                  <Typography variant="subtitle1">
                    {formData.cardNumber}
                  </Typography>
                </div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">过期日期</Typography>
                  <Typography variant="subtitle1">
                    {formData.expirationDate}
                  </Typography>
                </div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">安全码</Typography>
                  <Typography variant="subtitle1">
                    {formData.securityCode}
                  </Typography>
                </div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">预定类型</Typography>
                  <Typography variant="subtitle1">
                    $
                    {subscriptionPlan === "day"
                      ? (formData.price_per_day || payItem.price_per_day) +
                        "/天"
                      : (formData.price_per_hour || payItem.price_per_hour) +
                        "/小时"}
                  </Typography>
                </div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">开始时间</Typography>
                  <Typography variant="subtitle1">
                    {!typeNum ? convertTimeStr(startTime) : formData.start_time}
                  </Typography>
                </div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">结束时间</Typography>
                  <Typography variant="subtitle1">
                    {!typeNum ? convertTimeStr(endTime) : formData.end_time}
                  </Typography>
                </div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">车位价格</Typography>
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
                  <Typography variant="subtitle1">积分抵扣</Typography>
                  <Typography variant="subtitle1">{intergral / 10}</Typography>
                </div>
                <div className="checkout__confirmationRow">
                  <Typography variant="subtitle1">总金额</Typography>
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
                {typeNum ? "返回" : "上一步"}
              </Button>
            )}
            {!typeNum && activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => goClick()}
              >
                提交订单
              </Button>
            ) : (
              !typeNum && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  下一步
                </Button>
              )
            )}
            {!typeNum && <div style={{ color: "red" }}>有效期：{seconds}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
