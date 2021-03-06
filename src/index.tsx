import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import combineReducers from './Reducers';

import { Provider } from 'react-redux';
import { createStore , applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';

import reportWebVitals from './reportWebVitals';

import './index.scss';

const composeEnhancers = (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const myStore = createStore(combineReducers, composeEnhancers(applyMiddleware(reduxThunk)));


ReactDOM.render(
  <React.StrictMode>
    <Provider store={myStore}>
        <App/>
     </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
