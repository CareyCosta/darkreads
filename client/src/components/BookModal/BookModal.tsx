import { Modal } from "../../BuildingBlocks/Modal/Modal";
import { BookActionsForm } from "./BookActionsForm";
import { LocalBookProps, BookModalProps } from "../types";

import { getLocalBook } from "../repository";

import styles from "./BookModal.module.scss";
import { useEffect, useState } from "react";

const {
  bookModalWrapper,
  bookInfoWrapper,
  bookTitle,
  bookDescription,
  imageContainer,
} = styles;

export const BookModal = ({ handleShowModal, book }: BookModalProps) => {
  const [localBook, setLocalBook] = useState<LocalBookProps>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!book) {
      return;
    }
    const handleGetLocalBook = async (bookId: string) => {
      setIsPending(true);
      try {
        const response = await getLocalBook(bookId);
        setLocalBook(response.data);
      } catch (e) {
        console.log(e);
      }
      setIsPending(false);
    };
    handleGetLocalBook(book.id);
  }, [book]);

  return (
    <>
      {!isPending && (
        <Modal handleClose={() => handleShowModal(null)}>
          {!book ? (
            <div>no book</div>
          ) : (
            <div className={bookModalWrapper}>
              <div className={bookInfoWrapper}>
                <div className={bookTitle}>{book.title}</div>
                <div>{book?.authors}</div>
                <div className={bookDescription}>{book.description}</div>
                <BookActionsForm
                  googleBookId={book?.id}
                  bookId={localBook?.id}
                  categories={localBook?.categories}
                />
              </div>
              <div className={imageContainer}>
                <img src={book.imageLink} />
                <a href={book.previewLink} target="_blank">
                  View in Google Books
                </a>
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};
