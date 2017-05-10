import React, { Component, PropTypes } from 'react';
import fetch from 'isomorphic-fetch';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  componentWillMount() {
    fetch('http://localhost:4000/db')
      .then(response => {
        return response.json();
      })
      .then(responsJson => {
        debugger;
        console.log(responsJson);
      });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Inventory</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
