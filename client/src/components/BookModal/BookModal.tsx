import { Modal } from "../../BuildingBlocks/Modal/Modal";
import { BookModalProps } from "./types";

import { createBookEntry } from "../repository";

import styles from "./BookModal.module.scss";
import { CategoryPicker } from "../../BuildingBlocks/MultiSelect";

const {
  bookModalWrapper,
  bookInfoWrapper,
  bookTitle,
  bookDescription,
  imageContainer,
} = styles;

const handleAddToDB = async (params: {
  googleId: string | undefined;
  categories: string[];
}) => {
  if (!params.googleId || !params.categories.length) {
    return;
  }

  const newBook = await createBookEntry({
    googleId: params.googleId,
    categories: params.categories,
  });

  return { newBook };
};

export const BookModal = ({ handleShowModal, book }: BookModalProps) => {
  return (
    <Modal handleClose={() => handleShowModal(null)}>
      {!book ? (
        <div>no book</div>
      ) : (
        <div className={bookModalWrapper}>
          <div className={bookInfoWrapper}>
            <div className={bookTitle}>{book.title}</div>
            <div>{book?.authors}</div>
            <div className={bookDescription}>{book.description}</div>
            <CategoryPicker />
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
  );
};
