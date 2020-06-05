import React, { Component } from "react";

class Search extends Component {
  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }

  render() {
    const {
      searchTerm,
      onSearchChange,
      onSearchSubmit,
      children
    } = this.props;

    return (
      <form onSubmit={onSearchSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          ref={el => this.input = el}
        />
        <button type="submit">
          {children}
        </button>
      </form>
    );
  }
}

export default Search;
