"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { parse, startOfWeek, getDay, format } from 'date-fns';
import { RootState } from "../../store";
import { selectDate } from "../../store/calendarSlice";
import { useState } from "react";

interface TaskData {
  priority: number;
  startTime: string;
  endTime: string;
}

const CalendarComp = () => {
  const { Calendar, dateFnsLocalizer } = require("react-big-calendar");
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

  const eventList = Object.values(events).flatMap(( tasks:any) =>
    tasks.map((task: any) => {
      const [taskName] = Object.entries(task)[0];
      
      return {
        title: `${taskName}`,
        start: new Date(task[taskName].startTime),
        end: new Date(task[taskName].endTime),
      };
    })
  );


  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const handleSelect = (slotInfo: any) => {
    const dateStr = format(slotInfo.start, "dd-MM-yyyy");
    if (view !== 'month') {
      const data = {"start":slotInfo?.start,"end":slotInfo?.end,"date":dateStr}
    dispatch(selectDate(data));
    }
    if (view === 'month') {
      setView('day');
    }
  };
  return (
    <Calendar
      localizer={localizer}
      events={eventList}
      startAccessor="start"
      endAccessor="end"
      style={{ height: '100vh' }}
      selectable
      views={['month', 'week', 'day']}
      onSelectSlot={handleSelect}
      onSelectEvent={handleSelect}
      view={view}
      onView={(newView: 'month' | 'week' | 'day') => setView(newView)}
    />
  );
};

export default CalendarComp;
