"use client";
import { useSelector, useDispatch } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import {
  Modal,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { RootState } from "@/store";
import { clearSelectedDate } from "@/store/calendarSlice";
import CloseIcon from '@mui/icons-material/Close';

export default function EventPopup() {
  const dispatch = useDispatch();
  const selectedDate = useSelector(
    (state: RootState) => state.calendar.selectedDate
  );
  const events = useSelector((state: RootState) => state.calendar.events);

  if (!selectedDate) return null;

  const data = events[selectedDate];
  const chartData = data?.map((item: any) => ({
    name: Object.keys(item)[0],
    value: Object.values(item)[0],
  }));

  return (
    <Modal
      open={!!selectedDate}
      onClose={() => dispatch(clearSelectedDate())}
      aria-labelledby="event-popup-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 3,
          width: { xs: "90%", sm: 400 },
          position: "relative",
        }}
      >
        <IconButton
          onClick={() => dispatch(clearSelectedDate())}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          id="event-popup-title"
          variant="h6"
          component="h2"
          align="center"
          gutterBottom
        >
          {selectedDate}
        </Typography>

        {!data ? (
          <Typography
            variant="body1"
            color="error"
            align="center"
            fontWeight="medium"
          >
            No data found for the selected date.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <BarChart width={280} height={200} data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1976d2" />
            </BarChart>
          </Box>
        )}
      </Box>
    </Modal>
  );
}
