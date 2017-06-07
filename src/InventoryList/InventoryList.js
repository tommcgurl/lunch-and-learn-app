import React, { Component, PropTypes } from 'react';
import './InventoryList.css';

class InventoryList extends Component {

  static propTypes = {
    items: PropTypes.object.isRequired,
  }

  renderItems() {
    return Object.keys(this.props.items).map(key => {
      const item = this.props.items[key];
      return (
          <div
            key={key}
            className="inventory-container" >
            <h3 className="item-name">
              {item.name}
            </h3>
            <p className="item-description">
              {item.description}
            </p>
            <p className="item-votes">
              {item.votes}
            </p>
          </div>
      );
    });
  }

  render() {
    return (
      <div className="InventoryList-container" >
        {this.renderItems()}
      </div>
    );
  }
}

export default InventoryList;
