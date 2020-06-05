import React from "react";

class Search extends Component {
  render(){
    const { searchTerm, onSearchChange, onSearchSubmit, children } = this.props;
    return (
      <form onSubmit={onSearchSubmit}>
        <input type="text" value={searchTerm} onChange={onSearchChange} />
        <button type="submit">{children}</button>
      </form>
    );
  }
}

export default Search;
