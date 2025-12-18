import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dummyData from "../json/dummy.json";

interface CalendarState {
  events: Record<string, any[]>;
  selectedDate: string | null;
}
const initialState: CalendarState = { events: dummyData, selectedDate: null };

const calendarSlice = createSlice({
  name: "calendar",
  initialState,

  reducers: {
    selectDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    addEventData: (
      state,
      action: PayloadAction<{ date: string; data: any }>
    ) => {
      const { date, data } = action.payload;
      if (!state.events[date]) {
        state.events[date] = [];
      }
      state.events[date].push(data);
    },
    clearSelectedDate: (state) => {
      state.selectedDate = null;
    },
  },
});

export const { selectDate, addEventData, clearSelectedDate } =
  calendarSlice.actions;
export default calendarSlice.reducer;
