import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  calendarState: [],
};

export const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    addEvent: (state, { payload }) => {
      state.calendarState = [...state.calendarState, payload];
    },
    updateEvent: (state, { payload }) => {
      state.calendarState = state.calendarState.map((event) =>
        +event.id === +payload.id ? payload : event
      );
    },
    deleteEvent: (state, { payload }) => {
      state.calendarState = state.calendarState.filter((event) => +event.id !== +payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { addEvent, updateEvent, deleteEvent } = calendarSlice.actions;

export const selectCalendarState = (state) => state.calendar.calendarState;

export default calendarSlice.reducer;
