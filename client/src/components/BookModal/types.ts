import { Dispatch, SetStateAction } from "react";
import { BookProps } from "../types";

export type BookModalProps = {
  handleShowModal: Dispatch<SetStateAction<string | null>>;
  book: BookProps | undefined;
};
