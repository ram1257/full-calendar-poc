import { configureStore } from "@reduxjs/toolkit";
import calendarReducer from "../components/calender/calendarSlice";

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
  },
});
