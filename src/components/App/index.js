import React, { Component } from "react";
import axios from "axios";
import { sortBy } from "lodash";
import classNames from "classnames";
import Search from "../Search";
import Table from "../Table";
import "./index.css";
import Button, { SubmitButton, SaveButton, CancelButton } from "../Buttons";
import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP,
} from "../../constants";

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, "title"),
  AUTHOR: (list) => sortBy(list, "author"),
  COMMENTS: (list) => sortBy(list, "num_comments").reverse(),
  POINTS: (list) => sortBy(list, "points").reverse(),
};

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
  const { searchKey, results } = prevState;
  const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
  const updatedHits = [...oldHits, ...hits];
  return {
    results: { ...results, [searchKey]: { hits: updatedHits, page } },
    isLoading: false,
  };
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse =
      this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });

    axios(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then((result) => this.setSearchTopStories(result.data))
      .catch((error) => this.setState({ error }));
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }

    event.preventDefault();
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    this.setState(updateSearchTopStoriesState(hits, page));
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = (item) => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } },
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const {
      searchTerm,
      results,
      searchKey,
      error,
      isLoading,
    } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
            searchTerm={searchTerm}
            onSearchChange={this.onSearchChange}
            onSearchSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {error ? (
          <div className="interactions">
            <p>Something went wrong.</p>
          </div>
        ) : (
          <Table list={list} onDismiss={this.onDismiss} />
        )}
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

const Loading = () => <div>Loading ...</div>;

const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />;

const ButtonWithLoading = withLoading(Button);

const Sort = ({ sortKey, activeSortKey, onSort, children }) => {
  const sortClass = classNames("button-inline", {
    "button-active": sortKey === activeSortKey,
  });
  return (
    <Button onClick={() => onSort(sortKey)} className={sortClass}>
      {children}
    </Button>
  );
};

export default App;

export { Button, Search, Table, Sort, SORTS };
