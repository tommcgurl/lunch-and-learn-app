import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { API_ROOT } from './api';

// import fetch from 'isomorphic-fetch';
import logo from './logo.svg';
import InventoryList from './InventoryList/InventoryList';
import ItemDetail from './ItemDetail/ItemDetail';
import NewItemForm from './NewItemForm/NewItemForm';
import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';

let io = sailsIOClient(socketIOClient);

// Set some options:
// (you have to specify the host and port of the Sails backend when using this library from Node.js)
io.sails.url = API_ROOT;

import './App.css';

function getItemId(item) {
  return item.name.replace(/\s/g, '_').toLowerCase();
}

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
    this.socket = io.socket;
  }

  updateItem(itemToUpdate) {
    return fetch(`${API_ROOT}/item/${itemToUpdate.id}`,{
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify(itemToUpdate),
    })
    .then(response => {
      return response.json();
    })
  }

  removeItem = (itemId) => {
    const itemToRemove = this.state.inventory[itemId];
    fetch(`${API_ROOT}/item/${itemToRemove.id}`,{
      method: 'DELETE',
    })
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        const newInventory = this.state.inventory;
        delete newInventory[itemId];
        this.setState({
          inventory: newInventory,
        });
      })
      .catch(err => {
      });
  }

  addItemToInventory = (itemToAdd) => {
    const newInventory = this.state.inventory;
    const itemId = getItemId(itemToAdd);
    newInventory[itemId] = itemToAdd;
    this.setState({
      inventory: newInventory,
    });
  }

  submitNewItem = (newItem) => {
    fetch(`${API_ROOT}/item`,{
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(newItem),
    })
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        const item = responseJson;
        this.addItemToInventory(item);
      })
      .catch(err => {
        console.error(err);
      });
  }

  handleUpvote = () => {
    let itemToUpdate = this.state.inventory[this.state.selectedItem];
    itemToUpdate.votes += 1;
    this.updateItem(itemToUpdate)
      .then(responseJson => {
        const newInventory = {
          ...this.state.inventory,
        };
        const itemId = getItemId(responseJson);
        newInventory[itemId] = responseJson;
        this.setState({
          inventory: newInventory
        });
      })
      .catch(err => {
        console.error(err);
      });
    // this.setState({
    //   inventory: newInventory
    // });
  }

  fetchInitialData = () => {
    io.socket.get('/item',
      (body, JWR) => {
        debugger;
        this.setState({
          fetching: false,
          inventory: body,
        });
      }
    );
  }

  itemChangeHandler = (event) => {
    console.log(`SOCKET ON RESPONSE: ${JSON.stringify(event)}`);
    switch(event.verb) {
      case 'created':
        this.addItemToInventory(event.data);
      case 'destroyed':
        // this.removeItemFromInventory(event.previous);
      default:
        return
    }
  }

  componentWillMount() {
    debugger;
    io.socket.on('item', this.itemChangeHandler)
    this.fetchInitialData();
    // setInterval(this.fetchInitialData, 5000);
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
        onClickRemove={this.removeItem}
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
    if (this.state.selectedItem && this.state.inventory[this.state.selectedItem]) {
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
