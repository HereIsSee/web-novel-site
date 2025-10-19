import { useState, useRef } from 'react';
import styles from './DropDownListSelection.module.css';

const allTags = [
  'Anti-Hero Lead',
  'Romantic Comedy',
  'Tragic Hero',
  'Redemption Arc',
  'Found Family',
  'Enemies to Lovers'
];

const DropDownListSelection = () => {
  const [showTagSelection, setShowTagSelection] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const searchField = useRef(null);

  const filteredTags = allTags.filter(
    (tag) =>
      tag.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.includes(tag)
  );

  const handleTagClick = (tag) => {
    setSelectedTags([...selectedTags, tag]);
    setInputValue('');
    setShowTagSelection(false);
    searchField.current.focus();
  };

  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={styles.selection}>
      <div
        className={styles.inputContainer}
        onClick={() => searchField.current.focus()}
      >
        {selectedTags.map((tag) => (
          <div key={tag} className={styles.selectedTag}>
            <span>{tag}</span>
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => handleRemoveTag(tag)}
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
          onClick={() => setShowTagSelection(!showTagSelection)}
          onBlur={() => setShowTagSelection(false)} 
          placeholder="Search tags..."
          className={styles.input}
        />
      </div>

      {showTagSelection && filteredTags.length > 0 && (
        <div className={styles.tagSelection}>
          {filteredTags.map((tag) => (
            <div
              key={tag}
              className={styles.tag}
              onMouseDown={() => handleTagClick(tag)}
            >
              <div className={styles.tagName}>{tag}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDownListSelection;
