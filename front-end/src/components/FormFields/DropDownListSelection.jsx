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
}) => {
  const searchField = useRef(null);
  const [showItemSelection, setShowItemSelection] = useState(false);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedItems.includes(item),
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
          <div key={item.id} className={styles.selectedItem}>
            <span>{item.name}</span>
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
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={styles.item}
              onMouseDown={() => handleItemClick(item)}
            >
              <div className={styles.itemName}>{item.name}</div>
              <div className={styles.itemDescription}>{item.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDownListSelection;
