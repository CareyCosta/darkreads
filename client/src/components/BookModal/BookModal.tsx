import { useFormik, FormikProps } from "formik";
import { Modal } from "../../BuildingBlocks/Modal/Modal";
import { BookModalProps } from "./types";
import { CategoryOption, LocalBookProps } from "../types";

import { createBookEntry, getLocalBook } from "../repository";

import styles from "./BookModal.module.scss";
import { CategoryPicker } from "../../BuildingBlocks/MultiSelect";
import { useEffect, useMemo, useState } from "react";

const {
  bookModalWrapper,
  bookInfoWrapper,
  bookTitle,
  bookDescription,
  imageContainer,
} = styles;

const handleAddToDB = async (params: {
  googleId: string | undefined;
  categories: CategoryOption[];
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
  const [localBook, setLocalBook] = useState<LocalBookProps>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!book) {
      return;
    }
    const handleGetFromDB = async (bookId: string) => {
      setIsPending(true);
      const response = await getLocalBook(bookId);
      setIsPending(false);
      setLocalBook(response.data);
    };
    handleGetFromDB(book.id);
  }, [book]);

  const initialValues: {
    googleId: string | undefined;
    categories: Record<string, string>[];
  } = {
    googleId: book?.id,
    categories: localBook?.categories || [],
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => handleAddToDB(values),
  });

  console.log(formik);

  const handleCategorySelect = (newValues: CategoryOption[]) => {
    formik.setFieldValue("categories", newValues);
  };

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
            <form onSubmit={formik.handleSubmit}>
              <CategoryPicker
                name="categories"
                values={localBook?.categories || []}
                onChange={handleCategorySelect}
              />
              <button type="submit">Submit</button>
            </form>
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
