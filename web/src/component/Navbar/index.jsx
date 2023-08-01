import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import "./index.scss";
export default function NavBar() {
  const history = useNavigate();
  const isHome = window.location.pathname === "/";
  const style = {
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 10,
  };
  const userInfo = sessionStorage.userInfo
    ? JSON.parse(sessionStorage.userInfo)
    : "";
  return (
    <div className="nav-bar" style={isHome ? style : {}}>
      <div>
        <img src="images/logo.jpg" alt="" />
        <div style={{ marginLeft: "6%" }}>
          <Button onClick={() => history("/")}>home</Button>
          <Button onClick={() => history("/map")}>map</Button>
        </div>
      </div>
      <div className="nav-bar-right">
        {!userInfo && (
          <Button onClick={() => history("/register")}>register</Button>
        )}
        {!userInfo && <Button onClick={() => history("/login")}>log in</Button>}
        {userInfo && (
          <Button
            onClick={() => history("/table")}
            size="small"
            variant="contained"
          >
            Information
          </Button>
        )}
      </div>
    </div>
  );
}
