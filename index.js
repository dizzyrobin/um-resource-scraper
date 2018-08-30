import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';

import store from './src/store';

import App from './app';

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>
, document.getElementById('app'));
