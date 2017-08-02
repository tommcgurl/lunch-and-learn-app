import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import './InventoryList.css';

class InventoryList extends Component {

  static propTypes = {
    items: PropTypes.object.isRequired,
    selectedItem: PropTypes.string,
  }

  renderItems() {
    return Object.keys(this.props.items).map(key => {
      const item = this.props.items[key];
      let className = "inventory-container"
      if (key === this.props.selectedItem) {
        // className = className + " selected";
        className += " selected";
      }
      return (
          <Link
            to={`/${key}`}
            key={key}
            className={className} >
            <h3 className="item-name">
              {item.name}
            </h3>
            <p className="item-description">
              {item.description}
            </p>
            <p className="item-votes">
              {item.votes}
            </p>
          </Link>
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
