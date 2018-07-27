import React, { Component } from "react";
import "../css/category.css";
import Selector from "./Selector";

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLeft: true
    };
    this.updateLeft = this.updateLeft;
  }

  // Update the state of parent App from child Component
  updateLeft = (isLeft) => {this.setState({isLeft})};

  render() {
    // Passing throught the state from the properties
    const category = this.props.category;
    const current = this.props.currentCategory;

    //JSX element to display the HTML
    const categoryDiv = [];

    for (let i = 0; i < category.length; i++) {
      let name = category[i].name;
      let file = category[i].imgfile;
      if (name === current) {
        categoryDiv.push(
          <div className="category selected-category" key={i}>
            <img src={"img/graphics_creation/" + file} alt={name} />
          </div>
        );
      } else {
        categoryDiv.push(
          <div
            className="category"
            key={i}
            onClick={() => {
              this.props.updateCategory(name);
            }}
          >
            <img src={"img/graphics_creation/" + file} alt={name} />
          </div>
        );
      }
    }

    if (this.props.UIDisplayed) {
      return (
        <div>
          <div className="abs top left left-side">{categoryDiv}</div>
          <Selector currentCategory={this.props.currentCategory} isLeft={this.state.isLeft} updateLeft={this.updateLeft}/>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

export default Category;
