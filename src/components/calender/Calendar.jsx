import React, { useRef, useState } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  addEvent,
  deleteEvent,
  selectCalendarState,
  updateEvent,
} from "./calendarSlice";
import Modal from "../modal/Modal";
import styles from "./calendar.module.css";
import { timeConversion } from "../../helper/utils";
import moment from "moment";

function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState();
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const events = useSelector(selectCalendarState);
  const calendarRef = useRef(null);
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    title: "",
    type: "",
    start: "",
    end: "",
  });
  const [selectedUsers, setSelectedUsers] = useState([]);

  const eventSelectOptions = ["type1", "type2", "type3"];
  const options = [
    { value: "user01", label: "user01" },
    { value: "user02", label: "user02" },
    { value: "user03", label: "user03" },
  ];

  const handleInputs = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleDateClick = (arg) => {
    isCreateMode && setInputs("");
    setIsCreateMode(true);
    setShowModal(true);
    setSelectedDate({ date: arg.date, dateStr: arg.dateStr });
  };

  const setTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes()}`;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const event = {
      id: isCreateMode ? Date.now() : inputs?.id,
      title: inputs.title,
      start: selectedDate?.dateStr + "T" + inputs.start + ":00",
      end: selectedDate?.dateStr + "T" + inputs.end + ":00",
      type: inputs?.type ?? "message",
      backgroundColor: getEventBackgroundColor(inputs?.type),
      users: selectedUsers,
    };
    isCreateMode ? dispatch(addEvent(event)) : dispatch(updateEvent(event));
    setShowModal(false);

    setInputs("");
    setSelectedUsers([]);
    // setSelectedDate();
  };

  const handleEventClick = (arg) => {
    setIsCreateMode(false);
    setShowModal(true);
    const id = { ...arg.event.toPlainObject() }.id;
    const eventData = events.filter((event) => +event.id === +id);
    setInputs({
      ...eventData[0],
      start: setTime(eventData[0]?.start),
      end: setTime(eventData[0]?.end),
    });
    setSelectedUsers(eventData[0].users);
    setSelectedDate(eventData[0]);
    setSelectedDate({
      dateStr: `${arg.event.startStr?.split("T")[0]}`,
      date: `${arg.event.start}`,
    });
  };

  const isSelectable = (info) => {
    const date = info.date;
    const today = new Date();
    return date >= today;
  };

  const handleEventRender = ({ event, el, info }) => {
    el.className = `fc-event-${event.extendedProps.type}`;
  };

  const getEventBackgroundColor = (eventType) => {
    switch (eventType?.toLowerCase()) {
      case "type1":
        return "#FF0000";
      case "type2":
        return "#00FF00";
      case "type3":
        return "#0000FF";
      default:
        return "gray";
    }
  };

  // Set the valid range to today and later
  const validRange = {
    start: moment().startOf("day").toISOString(),
    end: null,
  };

  const handleMultiSelectChange = (selectedUsers) => {
    setSelectedUsers(selectedUsers);
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
          <form onSubmit={handleFormSubmit}>
            <div className={styles.calModal}>
              <h2>Create event on {timeConversion(selectedDate?.date)}</h2>
              <input
                name="title"
                placeholder="Add title"
                onChange={handleInputs}
                value={inputs.title}
                required
              />
              <select
                name="type"
                onChange={handleInputs}
                className={styles.calSelect}
                value={inputs.type}
                required
              >
                <option>Select type</option>
                {eventSelectOptions.map((option, index) => {
                  return <option key={index}>{option}</option>;
                })}
              </select>
              <div className={styles.calSelectTime}>
                <div className={styles.timeInput}>
                  <label>Select start time</label>
                  <input
                    onChange={handleInputs}
                    name="start"
                    type="time"
                    value={inputs.start}
                    min={new Date()}
                    required
                  />
                </div>
                <div className={styles.timeInput}>
                  <label>Select end time</label>
                  <input
                    onChange={handleInputs}
                    name="end"
                    value={inputs.end}
                    type="time"
                    required
                  />
                </div>
              </div>
              <Select
                name="users"
                isMulti
                value={selectedUsers}
                onChange={handleMultiSelectChange}
                options={options}
              />

              <div className={styles.calButton}>
                <button type="submit">
                  {isCreateMode ? "Save" : "Update"}
                </button>
                {!isCreateMode && (
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(deleteEvent(inputs?.id));
                      setShowModal(false);
                    }}
                  >
                    Delete
                  </button>
                )}
                <button onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default MyCalendar;
