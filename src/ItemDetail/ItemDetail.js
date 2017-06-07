import React, { Component, PropTypes } from 'react';
import './ItemDetail.css';

class ItemDetail extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    votes: PropTypes.number.isRequired,
    flavors: PropTypes.object,
  }


  render() {
    return (
      <div className="ItemDetail-container">
        <p className="ItemDetail-name">
          {this.props.name}
        </p>
        <p className="ItemDetail-description">
          {this.props.description}
        </p>
        <p className="ItemDetail-votes">
          {this.props.votes}
        </p>
        <p className="ItemDetail-flavors">
          None
        </p>
      </div>
    );
  }
}

export default ItemDetail;
