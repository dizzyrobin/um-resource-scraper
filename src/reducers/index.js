import {combineReducers} from 'redux';

import subjects from './subjects';
import log from './log';
import nav from './nav';

const reducers = combineReducers({
  subjects,
  log,
  nav,
});

export default reducers;
