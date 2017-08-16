import React, { Component, PropTypes } from 'react';
import './NewItemForm.css';

class NewItemForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addingFlavor: false
    };
  }

  static propTypes = {
    onSubmitNewItem: PropTypes.func.isRequired,
  }

  onClickAddFlavor = () => {
    this.setState({
      addingFlavor: true
    });
  }

  onClickSubmit = () => {
    const name = this.refs.nameInput.value;
    const description = this.refs.descriptionInput.value;
    /*
    "kind_bars": {
      "id": 1,
      "name": "Kind Bars",
      "description": "A healthy candy bar alternative.",
      "votes": 12,
      "flavors": {
        "seaSaltCaramel": {
          "name": "Sea Salt Caramel",
          "favorites": 0,
          "description": "The best flavor."
        }
      }
    }
    */
    const itemId = name.toLowerCase().replace(/\s/g, '_');
    this.props.onSubmitNewItem({
      id: itemId,
      name: name,
      description: description,
      votes: 0,
      flavors: this.state.flavors,
    });
    window.location.pathname = '/' + itemId;
  }
  handleFlavorSubmit = () => {
    const flavorName = this.refs.flavorNameInput.value;
    const flavorDescription = this.refs.flavorDescriptionInput.value;
    const flavorId = flavorName.toLowerCase().replace(/\s/g, '_');
    const newFlavor = {
      name: flavorName,
      description: flavorDescription,
      favorites: 0,
    }
    this.setState({
      flavors: {
        ...this.state.flavors,
        [flavorId]: newFlavor,
      },
      addingFlavor: false,
    });
  }

  renderAddedFlavorsIfNeeded() {
    // No need to render if object is empty.
    if (!this.state.flavors) {
      return;
    }

    const flavorItems = Object.keys(this.state.flavors).map(flavorId => {
      const flavor = this.state.flavors[flavorId];
      return (
        <li className="added-flavor-item">
          <p className="added-flavor-name">{flavor.name}</p>
          <p className="added-flavor-description">{flavor.description}</p>
        </li>
      );
    });
    return (
      <ul className="added-flavors-container">
        {flavorItems}
      </ul>
    );
  }

  renderFlavorFormIfNeeded() {
    if (this.state.addingFlavor) {
      return (
        <div className="flavor-form-container">
          <input
            type="text"
            placeholder="Enter a flavor name"
            ref="flavorNameInput"
          />
          <textarea
            type="text"
            placeholder="Enter a flavor description"
            ref="flavorDescriptionInput"
          />
          <button
            onClick={this.handleFlavorSubmit}
            className="add-flavor-submit-button">
            Submit
          </button>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="item-form-container">
        <input
          type="text"
          placeholder="Enter a name"
          ref="nameInput"
        />
        <textarea
          type="text"
          placeholder="Enter a description"
          ref="descriptionInput"
        />
        {this.renderAddedFlavorsIfNeeded()}
        {this.renderFlavorFormIfNeeded()}
        <button onClick={this.onClickAddFlavor}>Add a Flavor</button>
        <button onClick={this.onClickSubmit}>
          Submit
        </button>
      </div>
    );
  }
}

export default NewItemForm;
