/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import rrulePlugin from "@fullcalendar/rrule";
import interactionPlugin from "@fullcalendar/interaction";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
// import {
//   addEvent,
//   deleteEvent,
//   selectCalendarState,
//   updateEvent,
// } from "./calendarSlice";
import Modal from "../modal/Modal";
import styles from "./calendar.module.css";
import "./calendar.css";
import { timeConversion } from "../../helper/utils";
import moment from "moment";
import {
  addEvent,
  deleteEvent,
  fetchEventData,
  postEventData,
  updateEvent,
} from "../../store/calendar/calendarActions";
import NotificationComponent from "../notification/NotificationComponent";
import EventTooltip from "./EventTooltip ";

function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState();
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [isShowRecursive, setIsShowRecursive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [eventDays, setEventDays] = useState([]);
  const [tooltipEvent, setTooltipEvent] = useState(null);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const events = useSelector((state) => state.calendarState);
  const calendarRef = useRef(null);
  const dispatch = useDispatch();
  const [endDate, setEndDate] = useState();
  const [inputs, setInputs] = useState({
    title: "",
    type: "",
    start: "",
    end: "",
    endDate: "",
  });
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchEventData());
  }, [dispatch]);

  useEffect(() => {
    if (events[0]?.id) {
      dispatch(postEventData(events));
    }
  }, [events, events.length]);

  // Clear the state values
  const resetState = () => {
    setEventDays([]);
    setInputs({});
    setSelectedUsers([]);
    setIsShowRecursive(false);
  };

  // To add the event tooltip
  const handleEventMouseEnter = (info) => {
    setTooltipEvent(info.event);
  };

  const handleEventMouseLeave = () => {
    setTooltipEvent(null);
  };

  const handleMouseMove = (e) => {
    setMouseCoords({ x: e.clientX, y: e.clientY });
  };

  //Form drop down option values 
  const eventSelectOptions = ["type1", "type2", "type3"];
  const options = [
    { value: "user01", label: "user01" },
    { value: "user02", label: "user02" },
    { value: "user03", label: "user03" },
  ];
  const weeklyRecurse = [
    { value: "MO", label: "Monday" },
    { value: "TU", label: "TuesDay" },
    { value: "WE", label: "Wednesday" },
    { value: "TH", label: "Thursday" },
    { value: "FR", label: "Friday" },
    { value: "SA", label: "Saturday" },
    { value: "SU", label: "Sunday" },
  ];

  // Handle the form inputs
  const handleInputs = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // To create the new event
  const handleDateClick = (arg) => {
    isCreateMode && setInputs("");
    setIsCreateMode(true);
    setShowModal(true);
    setSelectedDate({ date: arg.date, dateStr: arg.dateStr });
  };

  // Time stamp convert in to hh:mm format
  const setTime = (timestamp) => {
    const date = new Date(timestamp);
    const currentHours = ("0" + date.getHours()).slice(-2);
    const currentMinutes = ("0" + date.getMinutes()).slice(-2);
    return `${currentHours}:${currentMinutes}`;
  };

  // To view or update the existing event
  const handleEventClick = (arg) => {
    setIsCreateMode(false);
    setShowModal(true);
    const id = { ...arg.event.toPlainObject() }.id;
    const eventData = events.filter((event) => +event.id === +id);
    setInputs({
      ...eventData[0],
      start: setTime(eventData[0]?.start),
      end: setTime(eventData[0]?.end),
      endDate: eventData[0]?.end.split("T")[0],
    });
    eventData[0]?.recursiveEvents?.length > 0 && setIsShowRecursive(true);
    setSelectedUsers(eventData[0]?.users);
    setEventDays(eventData[0]?.recursiveEvents);
    setSelectedDate({
      dateStr: `${arg.event.startStr?.split("T")[0]}`,
      date: `${arg.event.start}`,
    });
  };

  // Handle the form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const daysOfWeek = eventDays?.map((a) => a?.value);
    const rrule = `FREQ=WEEKLY;BYDAY=${daysOfWeek?.join(",")}${
      endDate ? ";UNTIL=" + endDate?.split("-")?.join("") : ""
    }`;
    const event = {
      id: isCreateMode ? Date.now() : inputs?.id,
      title: inputs.title,
      start: selectedDate?.dateStr + "T" + inputs.start + ":00",
      end: endDate
        ? endDate + "T" + inputs.end + ":00"
        : selectedDate?.dateStr + "T" + inputs.end + ":00",
      type: inputs?.type ?? "message",
      backgroundColor: getEventBackgroundColor(inputs?.type),
      users: selectedUsers,
      recursiveEvents: eventDays,
    };
    if (eventDays.length > 0) {
      event.rrule = rrule;
    } else {
      event.rrule ?? delete event.rrule;
    }
    isCreateMode ? dispatch(addEvent(event)) : dispatch(updateEvent(event));
    resetState();
    setShowModal(false);
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

  const handleCheckBox = () => {
    setIsShowRecursive((show) => !show);
    setEventDays([]);
  };

  return (
    <div>
      <div className="fullCalendarWrapper" onMouseMove={handleMouseMove}>
        <Fullcalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            rrulePlugin,
          ]}
          businessHours={{
            dow: [1, 2, 3, 4, 5],
            start: "09:00",
            end: "18:00",
          }}
          initialView={"dayGridMonth"}
          headerToolbar={{
            center: "prev,title,next",
            start: "today",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          selectable={isSelectable}
          selectMirror={true}
          // displayEventTime={false}
          className="hello"
          events={events}
          height={"90vh"}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventRender={handleEventRender}
          validRange={validRange}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
            list: "List",
          }}
          eventMouseEnter={handleEventMouseEnter}
          eventMouseLeave={handleEventMouseLeave}
        />
        {tooltipEvent && (
          <EventTooltip event={tooltipEvent} mouseCoords={mouseCoords} />
        )}
      </div>
      <NotificationComponent props={events} />

      {showModal && (
        <Modal>
          <form onSubmit={handleFormSubmit}>
            <div className={styles.calModal}>
              <h2>
                {isCreateMode ? "Create" : "Update"} event on{" "}
                {timeConversion(selectedDate?.date)}
              </h2>
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
              <div className={styles.endDate}>
                <label>Select end date(optional)</label>
                <input
                  name="endDate"
                  type="date"
                  value={endDate}
                  // min={selectedDate.dateStr}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div style={{ textAlign: "left" }}>
                <input
                  type="checkbox"
                  onChange={handleCheckBox}
                  defaultChecked={isShowRecursive}
                />
                Recurring Days:
                {isShowRecursive && (
                  <Select
                    value={eventDays}
                    isMulti
                    onChange={(e) => {
                      setEventDays(e);
                    }}
                    options={weeklyRecurse}
                  />
                )}
              </div>
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
              <div style={{ textAlign: "left" }}>
                <Select
                  name="users"
                  isMulti
                  value={selectedUsers}
                  onChange={handleMultiSelectChange}
                  options={options}
                />
              </div>
              <div className={styles.calButton}>
                <button type="submit" oncClick={() => resetState()}>
                  {isCreateMode ? "Save" : "Update"}
                </button>
                {!isCreateMode && (
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(deleteEvent(inputs?.id));
                      setShowModal(false);
                      resetState();
                    }}
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={() => {
                    resetState();
                    setShowModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default MyCalendar;
