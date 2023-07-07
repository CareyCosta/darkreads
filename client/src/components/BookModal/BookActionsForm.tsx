import { useState, useEffect } from "react";
import { useFormik, FormikProps } from "formik";

import { MultiSelect } from "../../BuildingBlocks/MultiSelect/MultiSelect";
import { LocalBookProps, CategoryProps, BookProps } from "../types";
import { getAllCategories, createBookEntry } from "../../components/repository";

type NewCategoryProps = Pick<CategoryProps, "name">;

interface BookActionsFormProps {
  // bookId: string | undefined;
  googleBookInfo: string;
  categories: CategoryProps[] | undefined;
}

export const BookActionsForm = ({
  // bookId,
  googleBookInfo,
  categories,
}: BookActionsFormProps) => {
  const [allCategories, setAllCategoryOptions] = useState<CategoryProps[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      const categoriesResponse = await getAllCategories();
      setAllCategoryOptions(categoriesResponse);
    };

    getCategories();
  }, []);

  const handleAddToDB = async (categories: CategoryProps[]) => {
    await createBookEntry({
      googleId: googleBookInfo,
      // ISBN10: googleBookInfo.ISBN,
      categories,
    });
  };

  const initialValues = {
    categories: categories || [],
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => handleAddToDB(values.categories),
  });

  const handleCategorySelect = (newValues: NewCategoryProps[]) => {
    formik.setFieldValue("categories", newValues);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <MultiSelect
        options={allCategories}
        setOptions={setAllCategoryOptions}
        values={formik.values.categories}
        name="bookCategories"
        onChange={handleCategorySelect}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
