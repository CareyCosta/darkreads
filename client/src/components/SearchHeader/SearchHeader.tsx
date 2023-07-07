import { useEffect, useState } from "react";
import { sortBy } from "lodash";
import {
  BookProps,
  SearchStateProps,
  SortConfigProps,
  SearchHeaderProps,
} from "../types";
import { getBooks } from "../repository";

import styles from "./SearchHeader.module.scss";
const { headerContainer, inputWrapper, searchButton } = styles;

const localStorageState = localStorage.getItem("searchState");
const initialState = localStorageState ? JSON.parse(localStorageState) : {};

const sortBooks = (booksList: BookProps[], direction: string): BookProps[] => {
  if (direction === "ASC") {
    return sortBy(booksList, (item: BookProps) => item.publishedDate);
  } else {
    return sortBy(booksList, (item: BookProps) => item.publishedDate).reverse();
  }
};

export const SearchHeader = (props: SearchHeaderProps) => {
  const { handleSetBooks, books } = props;

  const [searchState, setSearchState] =
    useState<SearchStateProps>(initialState);

  const [sortConfig, setSortConfig] = useState<SortConfigProps>({
    direction: "ASC",
  });

  // get books initially
  useEffect(() => {
    if (!Object.keys(searchState).length) {
      return;
    }
    getBooks(searchState).then((response) => handleSetBooks(response));
  }, []);

  useEffect(() => {
    localStorage.setItem("searchState", JSON.stringify(searchState));
  }, [searchState]);

  // when the sortDirection changes, update the book state
  useEffect(() => {
    handleSetBooks(sortBooks(books, sortConfig.direction));
  }, [sortConfig.direction]);

  const toggleSortDirection = () => {
    if (sortConfig.direction === "ASC") {
      setSortConfig((state) => ({ ...state, direction: "DESC" }));
    } else {
      setSortConfig((state) => ({ ...state, direction: "ASC" }));
    }
  };

  // fetch books with current state parameters
  const handleGetBooks = async () => {
    if (!Object.keys(searchState).length) {
      return;
    }
    const response = await getBooks(searchState);
    handleSetBooks(response);
  };

  return (
    <>
      <div className={headerContainer}>
        <h1>darkreads 🕷</h1>
        <div>
          <div className={inputWrapper}>
            <input
              type="text"
              placeholder="book title"
              onChange={(e) =>
                setSearchState((state) => ({ ...state, title: e.target.value }))
              }
              value={searchState?.title}
            />
            <input
              type="text"
              placeholder="author"
              onChange={(e) =>
                setSearchState((state) => ({
                  ...state,
                  author: e.target.value,
                }))
              }
              value={searchState?.author}
            />
            <button className={searchButton} onClick={handleGetBooks}>
              <span>💀</span>
            </button>
            {!!books.length && (
              <button onClick={toggleSortDirection}>
                {sortConfig.direction}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
