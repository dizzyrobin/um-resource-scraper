import {
  TOGGLE_SUBJECT,
  FETCH_SUBJECTS,
} from '../actions/types';

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_SUBJECTS:
      return action.subjects.map(s => {
        s.checked = false;
        return s;
      });
    case TOGGLE_SUBJECT: {
      const newState = JSON.parse(JSON.stringify(state));
      const found = newState.findIndex(e => e.resource === action.resource);
      newState[found].checked = !newState[found].checked;
      return newState;
    }
    default:
      return state;
  }
};
