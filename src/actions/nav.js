import {
  SET_BROWSER,
  SET_PAGE,
} from './types';

export const setBrowser = browser => {
  return {
    type: SET_BROWSER,
    browser,
  };
};

export const setPage = page => {
  return {
    type: SET_PAGE,
    page,
  };
};
