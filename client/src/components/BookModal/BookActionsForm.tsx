import { useState, useEffect } from "react";
import { useFormik, FormikProps } from "formik";

import { MultiSelect } from "../../BuildingBlocks/MultiSelect/MultiSelect";
import { LocalBookProps, CategoryProps } from "../types";
import { getAllCategories, createBookEntry } from "../../components/repository";

type NewCategoryProps = Pick<CategoryProps, "name">;

interface BookActionsFormProps {
  bookId: string | undefined;
  googleBookId: string;
  categories: CategoryProps[] | undefined;
}

export const BookActionsForm = ({
  bookId,
  googleBookId,
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
    if (!bookId) {
      await createBookEntry({
        googleId: googleBookId,
        categories,
      });
    }
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

  //   const createBulkCategories = async ({ name }: { name: string }) => {
  //     const response = await createBulkCategoryEntries({
  //       categories: name,
  //     });
  //     setAllCategoryOptions((prev) => [...prev, response.data]);
  //   };

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
