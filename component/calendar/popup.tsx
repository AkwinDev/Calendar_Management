"use client";
import { useSelector, useDispatch } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tooltip as MuiTooltip,
  Button,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { RootState } from "@/store";
import {
  clearSelectedDate,
  editEventData,
  deleteEventData,
} from "@/store/calendarSlice";
import AddTaskModal from "./addTask";

export default function EventPopup() {
  const dispatch = useDispatch();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTaskName, setEditTaskName] = useState<string>("");
  const [editPriority, setEditPriority] = useState<number | "">("");

  const selectedDate = useSelector(
    (state: RootState) => state.calendar.selectedDate
  );
  const events = useSelector((state: RootState) => state.calendar.events);

  if (!selectedDate) return null;

  const data = events[selectedDate.date];
  const chartData = data?.map((item: any) => ({
    name: Object.keys(item)[0],
    value: (Object.values(item)[0] as any)!.priority,
  }));

  const handleEdit = (taskObj: any) => {
    const [name, details] = (Object.entries(taskObj)[0])as any;
    setEditingTask(name);
    setEditTaskName(name);
    setEditPriority(details.priority);
  };

  const handleSaveEdit = (oldTaskName: string) => {
    if (!selectedDate?.date || editTaskName === "" || editPriority === "") return;

    dispatch(
      editEventData({
        date: selectedDate.date,
        oldTaskName: oldTaskName,
        newTaskName: editTaskName,
        priority: Number(editPriority),
        startTime: selectedDate!.start,
        endTime: selectedDate!.end,
      })
    );

    setEditingTask(null);
    setEditTaskName("");
    setEditPriority("");
  };

  const handleDelete = (taskName: string) => {
    if (!selectedDate?.date) return;
    dispatch(deleteEventData({ date: selectedDate.date, taskName }));
  };

  return (
    <>
      <Modal
        open={!!selectedDate.date}
        onClose={() => dispatch(clearSelectedDate())}
        aria-labelledby="event-popup-title"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 3,
            width: { xs: "90%", sm: 450 },
            position: "relative",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <IconButton
            onClick={() => dispatch(clearSelectedDate())}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          <div className="flex items-center gap-1 justify-between mx-4">
            <Typography
              id="event-popup-title"
              variant="h6"
              component="h2"
              align="center"
              gutterBottom
            >
              Tasks for {selectedDate.date}
            </Typography>

            <div>
              <div className="border rounded-md border-blue-600">
                <IconButton
                  size="small"
                  onClick={() => setOpenAddModal(true)}
                  color="primary"
                >
                  <AddIcon />
                </IconButton>
              </div>
            </div>
          </div>

          {!data ? (
            <Box
              sx={{
                border: "2px dotted green",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                backgroundColor: "#f0fff0",
                maxWidth: 400,
                margin: "20px auto",
              }}
            >
              <Typography variant="body1" color="error" fontWeight="medium">
                No task found for the selected date.
              </Typography>
              <Button
                variant="contained"
                color="success"
                onClick={() => setOpenAddModal(true)}
                sx={{ textTransform: "none" }}
              >
                Add Task
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <BarChart width={300} height={200} data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1976d2" />
                </BarChart>
              </Box>

              <Typography variant="subtitle1" gutterBottom>
                Task Details
              </Typography>
              <List>
                {data.map((item: any, idx: number) => {
                  const [task, value] = Object.entries(item)[0] as any;
                  const isEditing = editingTask === task;

                  return (
                    <Box key={idx}>
                      <ListItem
                        secondaryAction={
                          isEditing ? (
                            <Button
                              onClick={() => handleSaveEdit(task)}
                              color="success"
                              size="small"
                            >
                              Save
                            </Button>
                          ) : (
                            <>
                              <IconButton
                                onClick={() => handleEdit(item)}
                                color="primary"
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDelete(task)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </>
                          )
                        }
                      >
                        {isEditing ? (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <TextField
                              label="Task Name"
                              value={editTaskName}
                              onChange={(e) => setEditTaskName(e.target.value)}
                              size="small"
                              sx={{ flex: 1 }}
                            />
                            <TextField
                              label="Priority"
                              type="number"
                              value={editPriority}
                              onChange={(e) => setEditPriority(Number(e.target.value))}
                              size="small"
                              sx={{ width: "80px" }}
                            />
                          </Box>
                        ) : (
                          <ListItemText
                            primary={task}
                            secondary={`Priority: ${value.priority}`}
                          />
                        )}
                      </ListItem>
                      {idx < data.length - 1 && <Divider />}
                    </Box>
                  );
                })}
              </List>
            </>
          )}
        </Box>
      </Modal>

      <AddTaskModal
        open={openAddModal}
        date={selectedDate.date}
        onClose={() => setOpenAddModal(false)}
      />
    </>
  );
}
