import { Dispatch, SetStateAction } from "react";

export type CategoryProps = { id: string | null; name: string };

export type LocalBookProps = {
  id: string;
  googleId: string;
  categories: CategoryProps[];
} | null;

export interface BookProps {
  id: string;
  title: string;
  authors: string[];
  description: string;
  categories: CategoryProps[];
  publishedDate: Date;
  previewLink: string;
  imageLink: string;
}

export type SearchStateProps = {
  title: string;
  author: string;
};

export type SortConfigProps = {
  direction: "ASC" | "DESC";
};

export type SearchHeaderProps = {
  handleSetBooks: Dispatch<SetStateAction<BookProps[]>>;
  books: BookProps[];
};

export type BookModalProps = {
  handleShowModal: Dispatch<SetStateAction<string | null>>;
  book: BookProps | undefined;
};
