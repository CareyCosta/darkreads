import { Modal } from "../../BuildingBlocks/Modal/Modal";
import { BookModalProps } from "./types";

import { createBookEntry, getAllCategories } from "../repository";

import styles from "./BookModal.module.scss";
import { CategoryPicker } from "../../BuildingBlocks/MultiSelect";
import { useEffect, useState } from "react";

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
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const categoriesResponse = await getAllCategories();
      setCategories(categoriesResponse);
    };

    getCategories();
  }, []);

  return (
    <Modal handleClose={() => handleShowModal(null)}>
      <div className={bookModalWrapper}>
        <div className={bookInfoWrapper}>
          <div className={bookTitle}>{book?.title}</div>
          <div>{book?.authors}</div>
          <div className={bookDescription}>{book?.description}</div>
          <CategoryPicker />
        </div>
        <div className={imageContainer}>
          <img src={book?.imageLink} />
          <a href={book?.previewLink} target="_blank">
            View in Google Books
          </a>
        </div>
      </div>
    </Modal>
  );
};
