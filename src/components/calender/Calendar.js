import React from "react";
import moment from "moment";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useDispatch, useSelector } from "react-redux";
import {
  addEvent,
  deleteEvent,
  selectCalendarState,
  updateEvent,
} from "./calendarSlice";

function MyCalendar() {
  const events = useSelector(selectCalendarState);
  const dispatch = useDispatch();

  const handleDateClick = (arg) => {
    const event = {
      id: Date.now(),
      title: "New Event",
      start: arg.date,
      end: moment(arg.date).add(1, "hour").toDate(),
      type: "default",
    };
    dispatch(addEvent(event));
  };

  const handleEventClick = (arg) => {
    console.log("event Click", arg);
    const title = prompt("Enter a new title for the event:").trim();
    console.log(typeof title, "titleClick");
    if (title) {
      const event = {
        ...arg.event.toPlainObject(),
        title,
      };
      dispatch(updateEvent(event));
    } else {
      dispatch(deleteEvent(arg.event.id));
    }
  };

  const handleEventRender = (arg) => {
    arg.el.className = `fc-event-${arg.event.extendedProps.type}`;
  };
  console.log(events, "calState");
  return (
    <div>
      <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today prev,next", // will normally be on the left. if RTL, will be on the right
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay", // will normally be on the right. if RTL, will be on the left
        }}
        selectable={true}
        selectMirror={true}
        displayEventTime={false}
        events={events}
        height={"90vh"}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventRender={handleEventRender}
      />
    </div>
  );
}

export default MyCalendar;
