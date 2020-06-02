import React from "react";

const Search = ({ searchTerm, onSearchChange, onSearchSubmit, children }) => {
  return (
    <form onSubmit={onSearchSubmit}>
      <input type="text" value={searchTerm} onChange={onSearchChange} />
      <button type="submit">{children}</button>
    </form>
  );
}

export default Search;
