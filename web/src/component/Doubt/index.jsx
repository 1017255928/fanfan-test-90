import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import fetch from "../../fetch";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import { TextField, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { useState } from "react";

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

export default function CustomizedTables() {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState([]);
  const [issue, setIssue] = useState("");
  const [answer, setAnswer] = useState("");
  const [state, setState] = useState("");
  const [msg, setMsg] = useState("");
  useEffect(() => {
    fetch("/explain", {}, res => {
      setData(res.data);
    });
  }, []);
  useEffect(() => {
    if (msg) {
      setIssue(msg.issue);
      setAnswer(msg.answer);
      setState(msg.state);
    } else {
    }
  }, [msg]);
  useEffect(() => {
    if(open){
      return
    }
    setIssue("");
    setAnswer("");
    setState("");
  }, [open]);
  const addOrUpdate = () => {
    const data = {
      issue,
      answer,
      state,
    };
    if (msg) {
      fetch(
        "/explain/" + msg.id,
        {
          method: "PUT",
          body: JSON.stringify(data),
        },
        res => {
          setOpen(false);
          fetch("/explain", {}, res => {
            setData(res.data);
          });
        }
      );
      return;
    }
    fetch(
      "/explain",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      res => {
        setOpen(false);
        fetch("/explain", {}, res => {
          setData(res.data);
        });
      }
    );
  };

  const deleteFun = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("确定要执行这个操作吗？")) {
      fetch(
        "/parking/" + msg.id,
        {
          method: "delete",
        },
        res => {
          fetch("/explain", {}, res => {
            setData(res.data);
          });
        }
      );
    }
  };
  return (
    <div style={{ width: "97%", margin: "0 auto" }}>
      <div style={{height: '15px'}}></div>
      <Button
        style={{ marginBottom: "10px" }}
        onClick={() => [setMsg(""), setOpen(true)]}
        variant="contained"
      >
        新增
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>问题</StyledTableCell>
              <StyledTableCell align="right">答案</StyledTableCell>
              <StyledTableCell align="right">状态</StyledTableCell>
              <StyledTableCell align="right">操作</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(row => (
              <StyledTableRow key={row.name}>
                <StyledTableCell component="th" scope="row">
                  {row.issue}
                </StyledTableCell>
                <StyledTableCell align="right">{row.answer}</StyledTableCell>
                <StyledTableCell align="right">
                  {row.state == 1 ? "启用" : "禁用"}
                </StyledTableCell>
                <StyledTableCell align="right" component="th" scope="row">
                  <div>
                    <Button onClick={() => [setMsg(row), setOpen(true)]}>
                      修改
                    </Button>
                    <Button onClick={() => deleteFun()}>删除</Button>
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Drawer width="400px" anchor={"right"} open={open}>
        <div className="drawer">
          <div>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-controlled"
                label="问题"
                value={issue}
                variant="standard"
                onChange={event => {
                  setIssue(event.target.value);
                }}
              />
              <TextField
                id="outlined-uncontrolled"
                variant="standard"
                label="答案"
                value={answer}
                onChange={event => {
                  setAnswer(event.target.value);
                }}
              />
              <p>状态</p>
              <RadioGroup
                aria-label="answer"
                onChange={event => {
                  setState(event.target.value);
                }}
                value={state}
                name="answer"
              >
                <FormControlLabel value="1" control={<Radio />} label="启用" />
                <FormControlLabel value="2" control={<Radio />} label="禁用" />
              </RadioGroup>
            </Box>
          </div>
          <div>
            <Button variant="contained" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button
              style={{ marginLeft: "10px" }}
              onClick={addOrUpdate}
              variant="contained"
            >
              {msg ? "修改" : "新增"}
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
