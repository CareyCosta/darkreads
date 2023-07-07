import axios, { AxiosResponse } from "axios";
import { BookProps, CategoryProps, SearchStateProps } from "./types";

// local requests

const sanitizedCategories = (categories: CategoryProps[]) =>
  categories.map((c: CategoryProps) => (c.id ? c : { name: c.name }));

export const createBookEntry = async ({
  googleId,
  // ISBN10,
  // ISBN13,
  categories,
}: {
  googleId: string;
  categories: CategoryProps[];
}) => {
  const localInstance = axios.create({
    baseURL: "http://localhost:5000",
  });

  const response = await localInstance.post(`/api/book/`, {
    googleId,
    // ISBN10,
    // ISBN13,
    categories: sanitizedCategories(categories),
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

export const getLocalBook = async (bookId: string) => {
  const localInstance = axios.create({
    baseURL: "http://localhost:5000",
  });

  const response = await localInstance.get(`/api/book/googleId/${bookId}`);

  return response;
};

// google api requests

const googleURL = "https://www.googleapis.com/books/v1/";
const apiKey = "AIzaSyBbgOtmMrBOZ6ie66zJXV2h_IG8UcUX_VI";

const sanitizedSearchTerm = (searchTerm: string): string =>
  `"${searchTerm.replace(/ /g, "+")}"`;

const sanitizedBookResponse = ({
  item,
  searchTerms,
}: {
  item: any;
  searchTerms: { title?: string; author?: string };
}) => {
  const {
    title,
    authors,
    description,
    categories,
    publishedDate,
    previewLink,
    imageLinks,
    industryIdentifiers,
  } = item.volumeInfo;

  const { id } = item;

  const getISBNs = (
    identifiers: { type: string | undefined; identifier: string | undefined }[]
  ) => {
    return {
      ISBN10: identifiers?.find((i) => i.type === "ISBN_10")?.identifier,
      ISBN13: identifiers?.find((i) => i.type === "ISBN_13")?.identifier,
    };
  };

  const validISBNs = industryIdentifiers?.find(
    (i: any) => i.type === "ISBN_10" || i.type === "ISBN_13"
  );

  const lowerCaseGoogleTitle = title?.toLowerCase();
  const lowerCaseGoogleAuthors = authors?.map((t: string) => t.toLowerCase());

  if (
    (lowerCaseGoogleTitle?.includes(searchTerms.title?.toLowerCase()) ||
      lowerCaseGoogleAuthors?.includes(
        searchTerms.author?.toLocaleLowerCase()
      )) &&
    validISBNs
  ) {
    return {
      id,
      title,
      authors,
      description,
      categories,
      publishedDate: new Date(publishedDate),
      previewLink,
      imageLink: imageLinks?.thumbnail,
      ISBNs: getISBNs(industryIdentifiers),
    };
  } else {
    console.log("rejects", { title, authors, industryIdentifiers });
  }
};

export const getBooks = async (searchTerms: SearchStateProps) => {
  const { title = "", author = "" } = searchTerms;
  try {
    const { data } = await axios.get(
      `${googleURL}volumes?q=${sanitizedSearchTerm(title)}${
        author && `+inauthor:${sanitizedSearchTerm(author)}`
      }&maxResults=40&key=${apiKey}`
    );
    const bookList =
      data.items
        ?.map((i: any) => sanitizedBookResponse({ item: i, searchTerms }))
        .filter((i: any) => !!i) || [];

    return bookList;
  } catch (e) {
    console.log(e);
  }
};
