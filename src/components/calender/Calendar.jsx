import React, { useRef, useState } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent, selectCalendarState, updateEvent } from "./calendarSlice";
import Modal from "../modal/Modal";
import styles from "./calendar.module.css";
import { timeConversion } from "../../helper/utils";
import moment from "moment";

function MyCalendar() {
  const [selectedData, setSelectedDate] = useState();
  const [showModal, setShowModal] = useState(false);
  const events = useSelector(selectCalendarState);
  const calendarRef = useRef(null);
  const dispatch = useDispatch();
  const eventSelectOptions = ["type1", "type2", "type3"];

  const handleDateClick = (arg) => {
    setSelectedDate(arg);
    setShowModal(true);
    // const event = {
    //   id: Date.now(),
    //   title: "New Event",
    //   start: arg.date,
    //   end: moment(arg.date).add(1, "hour").toDate(),
    //   type: arg?.title ?? "message",
    // };
    // dispatch(addEvent(event));
  };

  const handleEventClick = (arg) => {
    arg.info.jsEvent.preventDefault();
    const title = prompt("Enter a new title for the event:")?.trim();
    console.log(title);
    if (title) {
      const event = {
        ...arg.event.toPlainObject(),
        title,
        backgroundColor: getEventBackgroundColor(title),
      };
      dispatch(updateEvent(event));
    } else {
      dispatch(deleteEvent(arg.event.id));
    }
  };

  const isSelectable = (info) => {
    const date = info.date;
    const today = new Date();
    return date >= today;
  };

  const handleEventRender = ({ event, el, info }) => {
    // console.log(event, "event45");
    el.className = `fc-event-${event.extendedProps.type}`;
    // info.el.style.backgroundColor = getEventBackgroundColor(event.type);
  };

  const getEventBackgroundColor = (eventType) => {
    console.log(eventType, "eventtype");
    switch (eventType.toLowerCase()) {
      case "meeting":
        return "#FF0000";
      case "lunch":
        return "#00FF00";
      case "dinner":
        return "#0000FF";
      default:
        return "gray";
    }
  };

  const onOptionChangeHandler = (event) => {
    console.log("User Selected Value - ", event.target.value);
  };

   // Set the valid range to today and later
   const validRange = {
    start: moment().startOf('day').toISOString(),
    end: null,
  };

  return (
    <div>
      <Fullcalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        selectable={isSelectable}
        selectMirror={true}
        displayEventTime={false}
        events={events}
        height={"90vh"}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventRender={handleEventRender}
        validRange={validRange}
      />

      {showModal && (
        <Modal>
          <div className={styles.calModal}>
            <h2>Create event on {timeConversion(selectedData?.date)}</h2>
            <input placeholder="Add title" required />
            <select
              onChange={onOptionChangeHandler}
              className={styles.calSelect}
            >
              <option>Select type</option>
              {eventSelectOptions.map((option, index) => {
                return <option key={index}>{option}</option>;
              })}
            </select>
            <div className={styles.calSelectTime}>
              <div className={styles.timeInput}>
                <label>Select start time</label>
                <input type="time" min={new Date()}/>
              </div>
              <div className={styles.timeInput}>
                <label>Select end time</label>
                <input type="time" />
              </div>
            </div>
            <select
              onChange={onOptionChangeHandler}
              className={styles.calSelect}
            >
              <option>Select users</option>
              {eventSelectOptions.map((option, index) => {
                return <option key={index}>{option}</option>;
              })}
            </select>
            <div className={styles.calButton}>
              <button>Save</button>
              <button>Delete</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default MyCalendar;
