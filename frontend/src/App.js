import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { API_ROOT } from './api';

// import fetch from 'isomorphic-fetch';
import logo from './logo.svg';
import InventoryList from './InventoryList/InventoryList';
import ItemDetail from './ItemDetail/ItemDetail';
import NewItemForm from './NewItemForm/NewItemForm';

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
        console.log(responseJson);
        const newInventory = this.state.inventory;
        delete newInventory[itemId];
        this.setState({
          inventory: newInventory,
        });
      })
      .catch(err => {
        console.error(err);
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
        console.log(responseJson);
        const item = responseJson;
        const newInventory = this.state.inventory;
        const itemId = getItemId(item);
        newInventory[itemId] = item;
        this.setState({
          inventory: newInventory,
        });
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
        console.log(responseJson);
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
    fetch(`${API_ROOT}/item/sortedMap`)
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        console.log(responseJson);
        this.setState({
          fetching: false,
          inventory: responseJson,
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  componentWillMount() {
    this.fetchInitialData();
    setInterval(this.fetchInitialData, 5000);
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
