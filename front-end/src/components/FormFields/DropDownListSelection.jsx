import { useRef, useState } from "react";
import styles from "./DropDownListSelection.module.css";

const DropDownListSelection = ({
  items,
  placeholder,
  selectedItems,
  inputValue,
  onInputChange,
  onAddItem,
  onRemoveItem,
  keyPair = false, // if the items are a key pair and not an item with id, name, description.
}) => {
  const searchField = useRef(null);
  const [showItemSelection, setShowItemSelection] = useState(false);

  const filteredItems = items.filter((item) =>
    keyPair
      ? item.key.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedItems.some((selected) => selected.value === item.value)
      : item.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedItems.some((selected) => selected.id === item.id),
  );

  const handleItemClick = (item) => {
    onAddItem(item);
    onInputChange("");
    setShowItemSelection(false);
    searchField.current.focus();
  };

  return (
    <div className={styles.selection}>
      <div
        className={styles.inputContainer}
        onClick={() => searchField.current.focus()}
      >
        {selectedItems.map((item) => (
          <div
            key={keyPair ? item.value : item.id}
            className={styles.selectedItem}
          >
            <span>{keyPair ? item.key : item.name}</span>
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => onRemoveItem(item)}
            >
              ×
            </button>
          </div>
        ))}

        <input
          ref={searchField}
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onClick={() => setShowItemSelection(!showItemSelection)}
          onBlur={() => setShowItemSelection(false)}
          placeholder={placeholder}
          className={styles.input}
        />
      </div>

      {showItemSelection && filteredItems.length > 0 && (
        <div className={styles.itemSelection}>
          {filteredItems.map((item) => {
            if (keyPair) {
              return (
                <div
                  key={item.value}
                  className={styles.item}
                  onMouseDown={() => handleItemClick(item)}
                >
                  <div className={styles.itemName}>{item.key}</div>
                </div>
              );
            }
            return (
              <div
                key={item.id}
                className={styles.item}
                onMouseDown={() => handleItemClick(item)}
              >
                <div className={styles.itemName}>{item.name}</div>
                <div className={styles.itemDescription}>{item.description}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropDownListSelection;
