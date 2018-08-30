import {
  TOGGLE_SUBJECT,
  FETCH_SUBJECTS,
} from './types';

export const fetchSubjects = subjects => {
  return {
    type: FETCH_SUBJECTS,
    subjects,
  };
};

export const toggleSubject = resource => {
  return {
    type: TOGGLE_SUBJECT,
    resource,
  };
};
