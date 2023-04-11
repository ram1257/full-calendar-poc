import { legacy_createStore as createStore,applyMiddleware} from 'redux'
import thunk from 'redux-thunk';

import calendarReducer from './calendar/calendarReducer';

const store = createStore(calendarReducer,applyMiddleware(thunk))


export default store;

















// import { configureStore } from "@reduxjs/toolkit";
// import calendarReducer from "../components/calender/calendarSlice";

// export const store = configureStore({
//   reducer: {
//     calendar: calendarReducer,
//   },
// });


