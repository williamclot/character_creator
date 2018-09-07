import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../css/searchbar.css";

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: "",
        };
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange= (event) => {
        this.setState({search: event.target.value});
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.updateSearchValue(this.state.search);
    }

    render() {
        return (
            <form className="abs searchContainer" onSubmit={this.handleSubmit}>
                <input className="searchText" type="text" value={this.state.search} placeholder="Search" onChange={this.handleChange} />                
                <button className="abs searchButton" type="submit">
                    <FontAwesomeIcon className="abs centered" icon="search" />
                </button> 
            </form>
      );
    }
}

export default SearchBar;