import axios, { AxiosResponse } from "axios";
import { BookProps } from "./types";

// local requests

export const createBookEntry = async ({
  googleId,
  categories,
}: {
  googleId: string;
  categories: string[];
}) => {
  const localInstance = axios.create({
    baseURL: "http://localhost:5000",
  });

  const response = await localInstance.post(`/api/book/`, {
    googleId,
    categories: categories.map((c) => ({
      name: c,
    })),
  });

  return response.data;
};

export const createCategoryEntry = async ({
  categoryName,
}: {
  categoryName: string;
}) => {
  const localInstance = axios.create({
    baseURL: "http://localhost:5000",
  });

  console.log(categoryName);
  return await localInstance.post(`/api/category/`, {
    name: categoryName,
  });
};

export const createBulkCategoryEntries = async ({
  categories,
}: {
  categories: string[];
}) => {
  const localInstance = axios.create({
    baseURL: "http://localhost:5000",
  });

  const response = await localInstance.post(`/api/category/bulk/`, {
    categories: categories.map((c) => ({ name: c })),
  });

  return response.data;
};

export const getAllCategories = async () => {
  const localInstance = axios.create({
    baseURL: "http://localhost:5000",
  });

  const response = await localInstance.get(`/api/category`);
  return response.data;
};

export const addCategoriesToBook = async (
  bookId: string,
  categories: AxiosResponse<any, any>
) => {
  const localInstance = axios.create({
    baseURL: "http://localhost:5000",
  });

  return await localInstance.post(`/api/book/addCategories`, {
    categories,
    bookId,
  });
};

export const getLocalBooks = async () => {
  const localInstance = axios.create({
    baseURL: "http://localhost:5000",
  });

  const response = await localInstance.get(`/api/books/`);

  return response;
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
