import React, { Component, PropTypes } from 'react';

import fetch from 'isomorphic-fetch';
import logo from './logo.svg';
import InventoryList from './InventoryList/InventoryList';
import ItemDetail from './ItemDetail/ItemDetail';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    let selectedItem = props.match.params.itemId;
    this.state = {
      fetching: true,
      inventory: {},
      selectedItem: selectedItem,
    };
  }

  setSelectedItem = (itemId) => {
    this.setState({
      selectedItem: itemId
    });
  }

  componentWillMount() {
    fetch('http://localhost:3000/db')
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        console.log(responseJson);
        this.setState({
          fetching: false,
          inventory: responseJson.inventory,
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  renderInventoryWhenReady() {
    if (this.state.fetching) {
      return (
        <p className="loading-indicator"> Loading ... </p>
      );
    }
    return (
      <InventoryList
        onClickItem={this.setSelectedItem}
        items={this.state.inventory}
        selectedItem={this.state.selectedItem}
      />
    );
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Inventory</h2>
        </div>
        <div className="App-content-container">
          {this.renderInventoryWhenReady()}
          <ItemDetail
            name="This is a test."
            description="The Most delicious snack."
            votes={0}
          />
        </div>
      </div>
    );
  }
}

export default App;
