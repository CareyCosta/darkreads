import { useCombobox, useMultipleSelection, useSelect } from "downshift";
import { useEffect, useMemo, useState } from "react";

import {
  createCategoryEntry,
  getAllCategories,
} from "../components/repository";

type Option = { [key: string]: string };

type MultiSelectProps = {
  altButtonFunc: ({
    name,
    list,
  }: {
    name: string;
    list: Option[];
  }) => Promise<void>;
  options: Option[];
};

const searchFunction = (option: Option, inputValue: string): boolean => {
  const lowerCasedInputValue = inputValue.toLowerCase();
  return option.name.toLowerCase().includes(lowerCasedInputValue);
};

const MultiSelect = ({ options, altButtonFunc }: MultiSelectProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<Option[]>([]);

  const items = useMemo(() => {
    return options.filter((o) => searchFunction(o, inputValue));
  }, [options, inputValue]);

  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
    useMultipleSelection({
      selectedItems,
      onStateChange({ selectedItems: newSelectedItems, type }) {
        switch (type) {
          case useMultipleSelection.stateChangeTypes
            .SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          // case useMultipleSelection.stateChangeTypes.FunctionSetSelectedItems:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            if (newSelectedItems) {
              setSelectedItems(newSelectedItems);
            }
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
  } = useCombobox({
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
            <button
              aria-label="toggle menu"
              className="px-2"
              type="button"
              {...getToggleButtonProps({
                onClick: () => altButtonFunc({ name: inputValue, list: items }),
              })}
            >
              &#8595;
            </button>
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

export const CategoryPicker = () => {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      const categoriesResponse = await getAllCategories();
      setOptions(categoriesResponse);
    };

    getCategories();
  }, []);

  const createNewCategory = async ({
    name,
    list,
  }: {
    name: string;
    list: Option[];
  }) => {
    if (!name || list.length) {
      return;
    }
    const response = await createCategoryEntry({ categoryName: name });
    setOptions((prev) => [...prev, response.data]);
  };

  return <MultiSelect options={options} altButtonFunc={createNewCategory} />;
};
