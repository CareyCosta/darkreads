import { useCombobox, useMultipleSelection } from "downshift";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";

import {
  createBulkCategoryEntries,
  getAllCategories,
} from "../components/repository";

type Option = { [key: string]: string };

type MultiSelectProps = {
  altButtonFunc?: ({ name }: { name: string }) => Promise<void>;
  options: Option[];
  setOptions: Dispatch<SetStateAction<Option[]>>;
  values: Option[] | undefined;
};

const searchFunction = (option: Option, inputValue: string): boolean => {
  const lowerCasedInputValue = inputValue.toLowerCase();
  return option.name.toLowerCase().includes(lowerCasedInputValue);
};

const MultiSelect = ({ options, setOptions, values }: MultiSelectProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<Option[]>(values || []);

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
    openMenu,
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

  const addNewOption = (optionName: string): void => {
    setSelectedItems((prev) => [...prev, { name: optionName }]);
    setOptions((prev) => [...prev, { name: optionName }]);
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
              <button onClick={() => addNewOption(inputValue)}>+</button>
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

export const CategoryPicker = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [values, setValues] = useState<Option[] | undefined>();

  useEffect(() => {
    const getCategories = async () => {
      const categoriesResponse = await getAllCategories();
      setOptions(categoriesResponse);
    };

    getCategories();
  }, []);

  //   const createBulkCategories = async ({ name }: { name: string }) => {
  //     const response = await createBulkCategoryEntries({
  //       categories: name,
  //     });
  //     setOptions((prev) => [...prev, response.data]);
  //   };

  return (
    <MultiSelect options={options} setOptions={setOptions} values={values} />
  );
};
