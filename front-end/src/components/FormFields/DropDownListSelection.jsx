import { useState, useRef } from 'react';
import styles from './DropDownListSelection.module.css';

const DropDownListSelection = ({items, placeholder}) => {
  const [showItemSelection, setShowItemSelection] = useState(false);
  const [selectedItems, setselectedItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const searchField = useRef(null);

  const filteredItems = items.filter(
    (item) =>
      item.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedItems.includes(item)
  );

  const handleItemClick = (item) => {
    setselectedItems([...selectedItems, item]);
    setInputValue('');
    setShowItemSelection(false);
    searchField.current.focus();
  };

  const handleRemoveItem = (itemToRemove) => {
    setselectedItems(selectedItems.filter((item) => item !== itemToRemove));
  };

  return (
    <div className={styles.selection}>
      <div
        className={styles.inputContainer}
        onClick={() => searchField.current.focus()}
      >
        {selectedItems.map((item) => (
          <div key={item} className={styles.selectedItem}>
            <span>{item}</span>
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => handleRemoveItem(item)}
            >
              ×
            </button>
          </div>
        ))}

        <input
          ref={searchField}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
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
              key={item}
              className={styles.item}
              onMouseDown={() => handleItemClick(item)}
            >
              <div className={styles.itemName}>{item}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDownListSelection;
