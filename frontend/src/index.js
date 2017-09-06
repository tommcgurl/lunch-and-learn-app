import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link
} from 'react-router-dom';

import App from './App';
import './index.css';

ReactDOM.render(
  (
    <Router>
      <div>
        <Route path="/:itemId" component={App}/>
      </div>
    </Router>
  ),
  document.getElementById('root')
);
