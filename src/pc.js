import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
// import { Router, browserHistory } from 'react-router';
import { Router,browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import "./static/css/sassCore/_base.scss";