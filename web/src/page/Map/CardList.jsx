import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Card from "./Card";
import { TextField } from "@mui/material";
import Datetime from "react-datetime";
import AutoComplete from "react-google-autocomplete";
import DirectionsIcon from "@mui/icons-material/Directions";
import "./cardList.scss";
import "react-datetime/css/react-datetime.css";
const searchParams = new URLSearchParams(window.location.search);
const cradId = searchParams.get("id"); // 'John'
export default function RecipeReviewCard(props) {
  const [visible, setVisible] = React.useState(true);
  const [message, setMessage] = React.useState(null);
  const [isItem, setIsItem] = React.useState(false);
  const [startTime, setStartTime] = React.useState(false);
  const [endTime, setEndTime] = React.useState(false);
  const [center, setCenter] = React.useState(null);
  const [pay, setPay] = React.useState({});
  const [distance, setDistance] = React.useState({});
  const [searchType, setSearchType] = React.useState(0);
  const [more, setMore] = React.useState(0);
  const [collect, setCollect] = React.useState(false);
  const [isFirstRender, setIsFirstRender] = React.useState(false);

  React.useEffect(() => {
    props.setMessage && props.setMessage(message);
  }, [message]);

  React.useEffect(() => {
    if (props.cardMessage) {
      setIsItem(true);
      setMessage(props.cardMessage);
    }
  }, [props.cardMessage]);

  React.useEffect(() => {
    if (!isFirstRender) {
      setIsFirstRender(true);
      return
    }
    props.onType &&
      props.onType({
        pay,
        distance,
        collect,
        more,
      });
  }, [pay, distance, collect,more]);

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (endTime && startTime) {
        props.setTime({
          endTime,
          startTime,
        });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [startTime, endTime]);

  React.useEffect(() => {
    if (props.card && props.card.length) {
      var item = props.card.filter(item => item.id == cradId);
      //  && setMessage(item[0]) && setVisible(true)
      if (item && item[0]) {
        setMessage(item[0]);
        setIsItem(true);
      }
    }
  }, [props.card]);
  const distanceChange = (start, end) => {
    setDistance(event => ({
      start: start === "none" ? event.start : start,
      end: end === "none" ? event.end : end,
    }));
  };
  const payChange = (start, end) => {
    setPay(event => ({
      start: start === "none" ? event.start : start,
      end: end === "none" ? event.end : end,
    }));
  };
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const onPlaceSelected = res => {
    if (res.geometry && res.geometry.location && res.geometry.location.lng) {
      setCenter({
        lng: res.geometry.location.lng(),
        lat: res.geometry.location.lat(),
      });
    }
  };
  return (
    <div style={{ display: "flex" }}>
      <div>
        <div className="card-search">
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              marginBottom: "4px",
            }}
          >
            <IconButton sx={{ p: "10px" }} aria-label="menu">
              <MenuIcon onClick={() => setVisible(val => !val)} />
            </IconButton>
            <AutoComplete
              className="location-search"
              onPlaceSelected={onPlaceSelected}
              apiKey="AIzaSyA-Tm0Wf5xc4QvSEcoy43Hc1l_JlESU3fk"
              fields={["address_components", "geometry.location"]}
            />
            <IconButton
              onClick={() => (center ? props.setCenter(center) : "")}
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton
              onClick={() =>
                window.open("https://www.google.com/maps/?hl=zh-CN")
              }
              color="primary"
              sx={{ p: "10px" }}
              aria-label="directions"
            >
              <DirectionsIcon />
            </IconButton>
          </Paper>
          <div className="search-type">
            <span onClick={() => setSearchType(1)}>price</span>
            <span onClick={() => setSearchType(2)}>date</span>
            <span onClick={() => setSearchType(3)}>distance</span>
            <span onClick={() => setSearchType(4)}>more</span>
            <span onClick={() => setCollect(res => !res)}>{collect ? 'Collection' : 'Default'}</span>
          </div>
          {searchType === 1 && (
            <div
              style={{
                background: "#fff",
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <TextField
                label="start"
                defaultValue={pay?.start || ''}
                onChange={e => payChange(e.target.value, "none")}
                name="securityCode"
              />
              <span style={{ width: "21px", textAlign: "center" }}>-</span>
              <TextField
                label="end"
                defaultValue={pay?.end || ''}
                onChange={e => payChange("none", e.target.value)}
                name="securityCode"
              />
            </div>
          )}
          {searchType === 3 && (
            <div
              style={{
                background: "#fff",
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <TextField
                label="nearest"
                defaultValue={distance?.start || ''}
                onChange={e => distanceChange(e.target.value, "none")}
                name="securityCode"
              />
              <span style={{ width: "21px", textAlign: "center" }}>-</span>
              <TextField
                label="farthest"
                defaultValue={distance?.end || ''}
                onChange={e => distanceChange("none", e.target.value)}
                name="securityCode"
              />
            </div>
          )}

          {searchType === 4 && (
            <div style={{ background: "#fff", width: "100%" }}>
              <TextField
                onChange={e => setMore(e.target.value)}
                placeholder="Space type /Way to access /Vehicle type"
                style={{ width: "100%" }}
                label="more"
                name="securityCode"
              />
            </div>
          )}
          {searchType === 2 && visible && (
            <div className="card-search-date-time">
              <div>
                <span>start time</span>
                {/* <Datetime
                  isValidDate={validityCheck}
                  showTimeSelect
                  timeFormat="HH:mm"
                /> */}
                <input
                  defaultValue={startTime || new Date().toISOString().split(".")[0]}
                  min={new Date().toISOString().split(".")[0]}
                  onChange={event => setStartTime(event.target.value)}
                  type="datetime-local"
                />
              </div>
              <div>
                <span>end time</span>
                {/* <Datetime  minDate={minDate} timeFormat="HH:mm" /> */}
                <input
                  defaultValue={endTime || nextWeek.toISOString().slice(0, 16)}
                  min={new Date().toISOString().split(".")[0]}
                  onChange={event => setEndTime(event.target.value)}
                  type="datetime-local"
                />
              </div>
            </div>
          )}
        </div>
        {visible && (
          <div className="card-list">
            {props.card.map(item => (
              <div
                className="card-list-item"
                onClick={() => [
                  props.setIsCenter(true),
                  setMessage(item),
                  setIsItem(true),
                  props.onClick(res => !res),
                ]}
              >
                <img src={item.images?.[0]} alt="" />
                <div>
                  <p>{item.name}</p>
                  <p>{item.description}</p>
                  <p>
                    ${item.price_per_day}/day ${item.price_per_hour}/hour
                  </p>
                  <p>{item.km + "km"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {isItem && (
        <div style={{ width: "400px", overflow: "auto", height: "680px" }}>
          <Card
            clear={() => [setIsItem(false), setMessage("")]}
            message={message}
          />
        </div>
      )}
    </div>
  );
}
