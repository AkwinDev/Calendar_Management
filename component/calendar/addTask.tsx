"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { addEventData, editEventData, deleteEventData } from "@/store/calendarSlice";
import { RootState } from "@/store";

export default function AddTaskModal({
  open,
  date,
  onClose,
}: {
  open: boolean;
  date: string | null;
  onClose: () => void;
}) {
  const dispatch = useDispatch();
  const [taskName, setTaskName] = useState("");
  const [value, setValue] = useState<number | "">("");
  const [editingTask, setEditingTask] = useState<string | null>(null);

  const events = useSelector((state: RootState) => state.calendar.events);
  const selectedDateTasks = date ? events[date] || [] : [];
const selectedDate = useSelector( (state: RootState) => state.calendar.selectedDate ); 
  useEffect(() => {
    if (open) {
      setTaskName("");
      setValue("");
      setEditingTask(null);
    }
  }, [open]);

  const handleAddOrEdit = () => {
    if (!date || !taskName || value === "") return;

    if (editingTask) {
      dispatch(
        editEventData({
          date,
          oldTaskName: editingTask,
          newTaskName: taskName,
          priority: Number(value),
          startTime: selectedDate!.start,
          endTime: selectedDate!.end,
        })
      );
    } else {
      dispatch(
        addEventData({
          date,
          taskName,
          priority: Number(value),
          startTime: selectedDate!.start,
         endTime: selectedDate!.end,
        })
      );
    }

    setTaskName("");
    setValue("");
    setEditingTask(null);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 3,
          width: { xs: "90%", sm: 400 },
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" align="center" gutterBottom>
          {editingTask ? "Edit Task" : "Add Task"} for {date}
        </Typography>

        <TextField
          fullWidth
          label="Task Name"
          placeholder="e.g. Meeting with team"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          type="number"
          label="Priority"
          placeholder="e.g. 5"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          margin="normal"
        />

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button variant="contained" onClick={handleAddOrEdit}>
            {editingTask ? "Update Task" : "Add Task"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
