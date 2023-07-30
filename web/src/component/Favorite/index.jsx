import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import fetch from "../../fetch";
import Button from "@mui/material/Button";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

let message = {};
export default function Favorite() {
  const [data, setData] = React.useState([]);
  const userInfo = sessionStorage.userInfo
    ? JSON.parse(sessionStorage.userInfo)
    : {};

  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    fetch("/favorite?id=" + userInfo.id, {}, res => {
      setData(res.data);
    });
  }, [index]);

  const deleteIcon = row => {
    var confirmed = window.confirm("确定要执行此操作吗？");
    if (!confirmed) {
      return;
    }
    fetch(
      "/favorite/" + row.id,
      {
        method: "DELETE",
      },
      res => {
        setIndex(res => res + 1);
      }
    );
  };

  const linkMap = row => {
    window.location = `/map?id=${row.parkingId}`;
  };

  return (
    <div style={{ width: "97%", margin: "0 auto" }}>
      <div style={{ height: "15px" }}></div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align="right">Price/hour</StyledTableCell>
              <StyledTableCell align="right">Price/dat</StyledTableCell>
              <StyledTableCell>Address</StyledTableCell>
              <StyledTableCell>Size</StyledTableCell>
              <StyledTableCell>Navigation</StyledTableCell>
              <StyledTableCell align="right">Option</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(row => (
              <StyledTableRow key={row.name}>
                <StyledTableCell>{row.userName}</StyledTableCell>
                <StyledTableCell>{row.price_per_hour}</StyledTableCell>
                <StyledTableCell align="right">
                  {row.price_per_day}
                </StyledTableCell>
                <StyledTableCell align="left">{row.address}</StyledTableCell>
                <StyledTableCell align="left">
                  {row.standard || "-"}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <OpenInNewIcon onClick={() => linkMap(row)}></OpenInNewIcon>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <div>
                    <Button onClick={() => deleteIcon(row)}>Delete From Collection</Button>
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
