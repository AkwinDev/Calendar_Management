import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dummyData from "../json/dummy.json";

interface TaskData {
  priority: number;
  startTime: string;
  endTime: string;
}

interface SelectedDateObj {
  start:string;
  end:string;
  date:string;
}

interface CalendarState {
  events: Record<string, any[]>;
  selectedDate: SelectedDateObj | null;
}

const initialState: CalendarState = {
  events: dummyData,
  selectedDate: null,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,

  reducers: {
    selectDate: (state, action: PayloadAction<SelectedDateObj>) => {
      state.selectedDate = action.payload;
    },

    // ✅ Add or update a task for a specific date
    addEventData: (
      state,
      action: PayloadAction<{
        date: string;
        taskName: string;
        priority: number;
        startTime: string;
        endTime: string;
      }>
    ) => {
      const { date, taskName, priority, startTime, endTime } = action.payload;

      // Create the date entry if not present
      if (!state.events[date]) {
        state.events[date] = [];
      }

      const newTask = { [taskName]: { priority, startTime, endTime } };

      // Check if this task already exists for that date
      const existingTaskIndex = state.events[date].findIndex(
        (taskObj) => Object.keys(taskObj)[0] === taskName
      );

      if (existingTaskIndex >= 0) {
        // Update existing task
        state.events[date][existingTaskIndex][taskName] = {
          priority,
          startTime,
          endTime,
        };
      } else {
        // Add new task
        state.events[date].push(newTask);
      }
    },
    editEventData: (
  state,
  action: PayloadAction<{
    date: string;
    oldTaskName: string;
    newTaskName: string;
    priority: number;
    startTime: string;
    endTime: string;
  }>
) => {
  const { date, oldTaskName, newTaskName, priority, startTime, endTime } =
    action.payload;
  if (!state.events[date]) return;

  const taskIndex = state.events[date].findIndex(
    (t) => Object.keys(t)[0] === oldTaskName
  );

  if (taskIndex >= 0) {
    state.events[date][taskIndex] = {
      [newTaskName]: { priority, startTime, endTime },
    };
  }
},
deleteEventData: (
  state,
  action: PayloadAction<{ date: string; taskName: string }>
) => {
  const { date, taskName } = action.payload;
  if (state.events[date]) {
    state.events[date] = state.events[date].filter(
      (t) => Object.keys(t)[0] !== taskName
    );
  }
},

    clearSelectedDate: (state) => {
      state.selectedDate = null;
    },
  },
});

export const { selectDate, addEventData, clearSelectedDate,deleteEventData,editEventData } =
  calendarSlice.actions;

export default calendarSlice.reducer;
