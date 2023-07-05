import axios from "axios";
import { BookProps } from "./types";

// local requests

export const createBookEntry = async ({ googleId }: { googleId: string }) => {
  const localInstance = axios.create({
    baseURL: "http://localhost:5000",
  });

  return await localInstance.post(`/api/book/`, {
    googleId,
  });
};

export const createBulkCategoryEntries = async ({
  categories,
}: {
  categories: string[];
}) => {
  console.log("categories????", categories);

  const localInstance = axios.create({
    baseURL: "http://localhost:5000",
  });

  return await localInstance.post(`/api/category/bulk/`, {
    categories: categories.map((c) => ({ name: c })),
  });
};

export const createCategoryEntry = async ({
  categoryName,
}: {
  categoryName: string;
}) => {
  const localInstance = axios.create({
    baseURL: "http://localhost:5000",
  });

  return await localInstance.post(`/api/category/`, {
    category: categoryName,
  });
};

export const getLocalBooks = async () => {
  const localInstance = axios.create({
    baseURL: "http://localhost:5000",
  });

  const response = await localInstance.get(`/api/books/`);

  // return response;
};

// google api requests

const googleURL = "https://www.googleapis.com/books/v1/";
const apiKey = "AIzaSyBbgOtmMrBOZ6ie66zJXV2h_IG8UcUX_VI";

const sanitizedSearchTerm = (searchTerm: string): string =>
  searchTerm.replace(/ /g, "+");

const sanitizedBookResponse = (item: Record<string, any>): BookProps => {
  const {
    title,
    authors,
    description,
    categories,
    publishedDate,
    previewLink,
    imageLinks,
  } = item.volumeInfo;

  const { id } = item;

  return {
    id,
    title,
    authors,
    description,
    categories,
    publishedDate: new Date(publishedDate),
    previewLink,
    imageLink: imageLinks?.thumbnail,
  };
};

export const getBooks = async (title = "", author = "") => {
  const searchParams = `${googleURL}volumes?q=${
    title && `+intitle:${sanitizedSearchTerm(title)}`
  }${
    author && `+inauthor:${sanitizedSearchTerm(author)}`
  }+subject:fiction&langRestrict=en&maxResults=40&key=${apiKey}`;

  try {
    const { data } = await axios.get(searchParams);
    const bookList = data.items.map(sanitizedBookResponse);
    return bookList;
  } catch (e) {
    console.log(e);
  }
};
