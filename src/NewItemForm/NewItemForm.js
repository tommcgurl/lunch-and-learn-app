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
    this.props.onSubmitNewItem({
      id: name.toLowerCase().replace(/\s/g, '_'),
      name: name,
      description: description,
      votes: 0,
      flavors: {},
    });
  }

  renderFlavorFormIfNeeded() {
    if (this.state.addingFlavor) {
      return (
        <div className="flavor-form">
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
