import { useCombobox, useMultipleSelection } from "downshift";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

import {
  createBulkCategoryEntries,
  getAllCategories,
} from "../components/repository";

type CategoryOption = { [key: string]: string };

type MultiSelectProps = {
  altButtonFunc?: ({ name }: { name: string }) => Promise<void>;
  options: CategoryOption[];
  setCategoryOptions: Dispatch<SetStateAction<CategoryOption[]>>;
  values: CategoryOption[] | undefined;
  name: string;
  onChange: (newValues: CategoryOption[]) => void;
};

const searchFunction = (
  option: CategoryOption,
  inputValue: string
): boolean => {
  const lowerCasedInputValue = inputValue.toLowerCase();
  return option.name.toLowerCase().includes(lowerCasedInputValue);
};

const MultiSelect = ({
  options,
  setCategoryOptions,
  values,
  name,
  onChange,
}: MultiSelectProps) => {
  const [inputValue, setInputValue] = useState<string>("");

  const items = useMemo(() => {
    return options.filter((o) => searchFunction(o, inputValue));
  }, [options, inputValue]);

  const {
    getSelectedItemProps,
    getDropdownProps,
    removeSelectedItem,
    selectedItems,
    setSelectedItems,
  } = useMultipleSelection({
    initialSelectedItems: values,
    onStateChange({ selectedItems: newSelectedItems, type }) {
      switch (type) {
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
        case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.FunctionSetSelectedItems:
        case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
          onChange(newSelectedItems || []);
          break;
        default:
          break;
      }
    },
  });

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getItemProps,
    openMenu,
  } = useCombobox({
    id: name,
    selectedItem: null,
    items,
    itemToString(item) {
      return item ? item.name : "";
    },
    inputValue,
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep the menu open after selection.
          };
        default:
          return changes;
      }
    },
    onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (newSelectedItem && !selectedItems.includes(newSelectedItem)) {
            setSelectedItems([...selectedItems, newSelectedItem]);
          }
          break;

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue || "");
          break;
        default:
          break;
      }
    },
  });

  const addNewCategoryOption = (optionName: string): void => {
    setSelectedItems([...selectedItems, { name: optionName }]);
    setCategoryOptions((prev) => [...prev, { name: optionName }]);
    setInputValue("");
    openMenu();
  };

  return (
    <div className="w-[592px]">
      <div className="flex flex-col gap-1">
        <label className="w-fit" {...getLabelProps()}>
          Select Categories:
        </label>
        <div className="shadow-sm bg-white inline-flex gap-2 items-center flex-wrap p-1.5">
          {selectedItems.map((selectItem, index) => {
            return (
              <span
                className="bg-gray-100 rounded-md px-1 focus:bg-red-400"
                key={`selected-item-${index}`}
                {...getSelectedItemProps({
                  selectedItem: selectItem,
                  index,
                })}
              >
                {selectItem.name}
                <span
                  className="px-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedItem(selectItem);
                  }}
                >
                  &#10005;
                </span>
              </span>
            );
          })}
          <div className="flex gap-0.5 grow">
            <input
              placeholder="Best book ever"
              className="w-full"
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
            />
            {inputValue && !items.length ? (
              <button onClick={() => addNewCategoryOption(inputValue)}>
                +
              </button>
            ) : (
              <button
                aria-label="toggle menu"
                className="px-2"
                type="button"
                {...getToggleButtonProps()}
              >
                &#8595;
              </button>
            )}
          </div>
        </div>
      </div>
      <ul
        className={`absolute w-inherit bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 ${
          !(isOpen && options.length) && "hidden"
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              key={`${item.value}${index}`}
              {...getItemProps({ item, index })}
            >
              <span>{item.name}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};

type CategoryPickerProps = {
  onChange: (newValues: CategoryOption[]) => void;
  name: string;
  values: CategoryOption[];
};

export const CategoryPicker = ({
  onChange,
  name,
  values,
}: CategoryPickerProps) => {
  const [options, setCategoryOptions] = useState<CategoryOption[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      const categoriesResponse = await getAllCategories();
      setCategoryOptions(categoriesResponse);
    };

    getCategories();
  }, []);

  //   const createBulkCategories = async ({ name }: { name: string }) => {
  //     const response = await createBulkCategoryEntries({
  //       categories: name,
  //     });
  //     setCategoryOptions((prev) => [...prev, response.data]);
  //   };

  return (
    <MultiSelect
      options={options}
      setCategoryOptions={setCategoryOptions}
      values={values}
      name={name}
      onChange={onChange}
    />
  );
};
