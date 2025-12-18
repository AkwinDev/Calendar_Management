import EventPopup from "@/component/calendar/popup";
import CalendarComp from "../../component/calendar/calendar";

const CalendarPage = () => {
      
  return (
    <div className="h-screen">
      <div className="">
      <CalendarComp/>
      </div>
      <EventPopup/>
    </div>
  );
};
export default CalendarPage;
