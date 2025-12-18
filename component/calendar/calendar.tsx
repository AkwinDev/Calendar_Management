"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { parse, startOfWeek, getDay, format } from 'date-fns';
import { RootState } from "../../store";
import { selectDate } from "../../store/calendarSlice";

const CalendarComp = () => {
  const {Calendar,dateFnsLocalizer} = require("react-big-calendar");
  const locales = { "en-US": require("date-fns/locale/en-US") };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  const dispatch = useDispatch();
  const events = useSelector((state: RootState) => state.calendar.events);
  const eventList = Object.keys(events).map((date) => ({
    title: "temp",
    start: new Date(date.split("-").reverse().join("-")),
    end: new Date(date.split("-").reverse().join("-")),
  }));
  console.log(events, "eventListeventList", eventList);

  const handleSelect = (slotInfo: any) => {
    const dateStr = format(slotInfo.start, "dd-MM-yyyy");
    dispatch(selectDate(dateStr));
  };
  return (
    <Calendar
      localizer={localizer}
      events={eventList}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      selectable
      onSelectSlot={handleSelect}
      onSelectEvent={handleSelect}
    />
  );
};
export default CalendarComp;
