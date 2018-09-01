import {
  SET_BROWSER,
  SET_PAGE,
} from '../actions/types';

const defaultState = {
  browser: undefined,
  page: undefined,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_BROWSER:
      state.browser = action.browser;
      return state;
    case SET_PAGE: {
      state.page = action.page;
      return state;
    }
    default:
      return state;
  }
};
