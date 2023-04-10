import { ADD_EVENT, DELETE_EVENT, SET_EVENT, UPDATE_EVENT } from "./calendarTypes";

const initialState = {
  calendarState: [],
};

export const calendarReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EVENT: return {
        ...state,
        calendarState :action.payload
    };
    case ADD_EVENT: return {
        ...state,
        calendarState :[...state.calendarState,action.payload]
    };
    case UPDATE_EVENT: return{
        ...state,
        calendarState: state.calendarState.map((event) =>
        +event.id === +action.payload.id ? action.payload : event)
    };
    case DELETE_EVENT: return{
        ...state,
        calendarState:state.calendarState.filter((event) => +event.id !== +action.payload)
    };
    default:
      return state;
  }
};
