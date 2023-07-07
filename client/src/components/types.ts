import { Dispatch, SetStateAction } from "react";

export type CategoryProps = { id: string | null; name: string };

export type LocalBookProps = {
  id: string;
  googleId: string;
  categories: CategoryProps[];
} | null;

type ISBNProps = {
  ISBN10?: string | undefined;
  ISBN13?: string | undefined;
};

export interface BookProps {
  id: string;
  title: string;
  authors: string[];
  description: string;
  categories: CategoryProps[];
  publishedDate: Date;
  previewLink: string;
  imageLink: string;
  ISBNs: ISBNProps;
}

export type SearchStateProps = {
  title: string | undefined;
  author: string | undefined;
};

export type SortConfigProps = {
  direction: "ASC" | "DESC";
};

export type SearchHeaderProps = {
  handleSetBooks: Dispatch<SetStateAction<BookProps[]>>;
  books: BookProps[];
};

export type BookModalProps = {
  handleShowModal: Dispatch<SetStateAction<BookProps | null>>;
  book: BookProps;
};
