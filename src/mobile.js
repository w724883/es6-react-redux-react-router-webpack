import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';
// import { Router, browserHistory } from 'react-router';
import { Router,browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes/mobile';

const store = createStore(reducers);
// const history = syncHistoryWithStore(browserHistory, store);

render(
    <Provider store={store}>
        <Router routes={routes} history={browserHistory} />
    </Provider>,
    document.getElementById('app')
);
