import { Dispatch, SetStateAction } from "react";

export interface BookProps {
  id: string;
  title: string;
  authors: string[];
  description: string;
  categories: string[];
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