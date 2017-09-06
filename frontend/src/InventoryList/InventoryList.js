import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import './InventoryList.css';

class InventoryList extends Component {

  static propTypes = {
    items: PropTypes.object.isRequired,
    selectedItem: PropTypes.string,
    onClickRemove: PropTypes.func,
  }

  handleRemove = (itemId, e) => {
    e.preventDefault();
    e.stopPropagation()
    this.props.onClickRemove(itemId);
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
            <div
              className="item-remove"
              onClick={this.handleRemove.bind(null, key)}>
              ×
            </div>
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
