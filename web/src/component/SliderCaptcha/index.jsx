import React, { useState } from "react";
import SliderCaptcha from "rc-slider-captcha";
// import "./index.scss";

function Register({ callback }) {
  return (
    <div>
      <SliderCaptcha
        mode={"float"}
        request={async () => {
          return {
            bgUrl: "/download.jpg",
            puzzleUrl: "/download.png",
          };
        }}
        onVerify={async data => {
          if (data.sliderOffsetX > 93 && data.sliderOffsetX < 106) {
            callback(true);
            return Promise.resolve();
          } else {
            return Promise.reject("e");
          }
        }}
      />
    </div>
  );
}

export default Register;
