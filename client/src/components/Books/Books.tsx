import { useState } from "react";
import { BookProps } from "../types";
import { BookModal } from "../BookModal/BookModal";
import styles from "./Books.module.scss";

const {
  booksContainer,
  bookItem,
  bookInfoWrapper,
  bookTitle,
  bookDescription,
  imageContainer,
} = styles;

const getSanitizedDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return [day, month, year].join("/");
};

export const Books = (props: { booksList: BookProps[] }) => {
  const [showBookModal, setShowBookModal] = useState<BookProps | null>(null);
  const { booksList } = props;
  return (
    <div className={booksContainer}>
      {showBookModal !== null && (
        <BookModal handleShowModal={setShowBookModal} book={showBookModal} />
      )}
      {booksList.length ? (
        booksList.map((b) => (
          <div className={bookItem} key={`book-${b.id}`}>
            <div className={bookInfoWrapper}>
              <div className={bookTitle}>{b.title}</div>
              <div>{b.authors}</div>
              <div>{getSanitizedDate(b.publishedDate)}</div>
              <div className={bookDescription}>{b.description}</div>
              <button onClick={() => setShowBookModal(b)}>show modal</button>
            </div>
            <div className={imageContainer}>
              <img src={b.imageLink} />
            </div>
          </div>
        ))
      ) : (
        <div>no books</div>
      )}
    </div>
  );
};
