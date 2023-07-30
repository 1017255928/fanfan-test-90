import React from "react";
import Accordion from "../../component/Accordion";
import Images from "../../component/Images";
import Map from "../Map";
import InputBase from "../../component/InputBase";
import "./index.scss";
const style = { width: "100%", margin: "0 auto" };
function MyComponent() {
  return (
    <div className="home">
      <div className="home-banner">
        <p className="home-banner-flex">
          <img
            style={{ opacity: 0 }}
            src="https://img0.baidu.com/it/u=713751486,276319268&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800"
          />
        </p>
        <div>
          <InputBase />
        </div>
      </div>
      {/* <div style={style}>
        <div>
          <Images />
        </div>
      </div> */}
      <div style={{ ...style, height: "700px" }}>
        <div style={{ height: "100%" }}>
          <Map visibleLeft={false} />
        </div>
      </div>
      {/* <div style={{ ...style, padding: "31px" }}>
        <div>
          <span className="home-qa">QA 疑问</span>
          <Accordion />
        </div>
      </div> */}
    </div>
  );
}
export default React.memo(MyComponent);
