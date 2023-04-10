import {
  ADD_EVENT,
  DELETE_EVENT,
  SET_EVENT,
  UPDATE_EVENT,
} from "./calendarTypes";

export const setEvent = (data) => {
  return {
    type: SET_EVENT,
    payload: data,
  };
};

export const addEvent = (data) => {
  return {
    type: ADD_EVENT,
    payload: data,
  };
};

export const updateEvent = (data) => {
  return {
    type: UPDATE_EVENT,
    payload: data,
  };
};

export const deleteEvent = (eventID) => {
  return {
    type: DELETE_EVENT,
    payload: eventID,
  };
};

export const postEventData = (events) => {
  return (dispatch) => {
    const storedData = localStorage.getItem("calEvents");
    if (storedData) {
      const myArray = JSON.parse(storedData);
      localStorage?.setItem(
        "calEvents",
        JSON.stringify([...myArray, ...events])
      );
    }else{
        localStorage.setItem("calEvents",JSON.stringify(events))
    }
  };
};

export const fetchEventData = () => {
  return (dispatch) => {
    const storedData = localStorage.getItem("calEvents");
    if (storedData) {
      const myArray = JSON.parse(storedData);
      dispatch(setEvent(myArray));
    }
  };
};
