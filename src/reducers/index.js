import {combineReducers} from 'redux';

import subjects from './subjects';
import log from './log';

const reducers = combineReducers({
  subjects,
  log,
});

export default reducers;
