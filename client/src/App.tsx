import { useState, useEffect } from "react";
import { Books } from "./components/Books/Books";
import { SearchHeader } from "./components/SearchHeader/SearchHeader";
import { BookProps } from "./components/types";

import styles from "./App.module.scss";

const { container } = styles;

function App() {
  const [books, setBooks] = useState<BookProps[]>([]);

  return (
    <div className={container}>
      <SearchHeader handleSetBooks={setBooks} books={books} />
      <Books booksList={books} />
    </div>
  );
}

export default App;
