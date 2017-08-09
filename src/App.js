import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

import fetch from 'isomorphic-fetch';
import logo from './logo.svg';
import InventoryList from './InventoryList/InventoryList';
import ItemDetail from './ItemDetail/ItemDetail';
import NewItemForm from './NewItemForm/NewItemForm';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    let selectedItem = ''
    let addingItem = false;
    if (props.match.params.itemId === 'add_item') {
      addingItem = true;
    } else {
      selectedItem = props.match.params.itemId;
    }
    this.state = {
      fetching: true,
      inventory: {},
      selectedItem: selectedItem,
      addingItem: addingItem,
    };
  }

  updateInventory(newInventory) {
    return fetch('http://localhost:3000/inventory',{
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(newInventory),
    })
    .then(response => {
      return response.json();
    })
  }

  submitNewItem = (newItem) => {
    let newInventory = {
      ...this.state.inventory,
      [newItem.id]: newItem,
    }
    this.updateInventory(newInventory)
      .then(responseJson => {
        console.log(responseJson);
        if (!Object.keys(responseJson).length) {
          console.log('Failed to create new item');
          return;
        }
        this.setState({
          inventory: responseJson
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  handleUpvote = () => {
    let itemToUpvote = this.state.inventory[this.state.selectedItem];
    itemToUpvote.votes += 1;
    let newInventory = {
      ...this.state.inventory,
      [this.state.selectedItem]: itemToUpvote,
    };
    this.updateInventory(newInventory)
      .then(responseJson => {
        console.log(responseJson);
        if (!Object.keys(responseJson).length) {
          console.log('Failed to upvote');
          return;
        }
        this.setState({
          inventory: responseJson
        });
      })
      .catch(err => {
        console.error(err);
      });
    // this.setState({
    //   inventory: newInventory
    // });
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
      if (nextProps.match.params.itemId === 'add_item') {
        this.setState({
          addingItem: true,
        });
      } else {
        this.setState({
          selectedItem: nextProps.match.params.itemId,
          addingItem: false,
        });
      }
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
        items={this.state.inventory}
        selectedItem={this.state.selectedItem}
      />
    );
  }

  renderContentArea() {
    if (this.state.addingItem) {
      return (
        <NewItemForm onSubmitNewItem={this.submitNewItem}/>
      );
    } else {
      return this.renderItemDetailWhenSelected();
    }
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
          onClickUpvote={this.handleUpvote}
        />
      );
    } else {
      return (
        <div className="empty-item-detail"/>
      )
    }
  }

  renderAddItemButton() {
    return (
      <Link
        to="/add_item"
        className="add-item-button">
        Add Item
      </Link>
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
          {this.renderContentArea()}
          {this.renderAddItemButton()}
        </div>
      </div>
    );
  }
}

export default App;
