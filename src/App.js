import React, { Component, PropTypes } from 'react';

import fetch from 'isomorphic-fetch';
import logo from './logo.svg';
import InventoryList from './InventoryList/InventoryList';
import ItemDetail from './ItemDetail/ItemDetail';
import './App.css';

class App extends Component {

  constructor(props) {
    debugger;
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

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.itemId !== nextProps.match.params.itemId) {
      this.setState({
        selectedItem: nextProps.match.params.itemId
      });
    }
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

  renderItemDetailWhenSelected() {
    console.log("Trying to render item")
    if (this.state.selectedItem && this.state.inventory[this.state.selectedItem]) {
      console.log("Rendering item now.")
      const selectedItem = this.state.inventory[this.state.selectedItem]
      return (
        <ItemDetail
          name={selectedItem.name}
          description={selectedItem.description}
          votes={selectedItem.votes}
        />
      );
    }
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
          {this.renderItemDetailWhenSelected()}
        </div>
      </div>
    );
  }
}

export default App;
