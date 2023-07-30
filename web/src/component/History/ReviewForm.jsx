import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Rating,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const ReviewFormDialog = ({ open, onClose, onClick }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleCommentChange = event => {
    setComment(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    // 在这里提交评论到后端等等处理逻辑
    onClick && onClick({
      rating,
      comment
    })
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>请您对 MUI 进行评价</DialogTitle>
      <DialogContent>
        <Rating name="rating" value={rating} onChange={handleRatingChange} />
        <TextField
          name="comment"
          value={comment}
          onChange={handleCommentChange}
          placeholder="请输入您的评价"
          multiline
          rows={4}
          margin="normal"
          fullWidth
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={handleSubmit} color="primary">
          提交
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewFormDialog;
