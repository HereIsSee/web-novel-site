import { useMemo } from "react";
import styles from "./DropDown.module.css";
import isPlainObject from "../../helpers/isPlainObject";

const DropDown = ({ items = [], name, id, selectedValue, onChange }) => {
  // Normalize items: if it’s a plain object, convert to array of { key, value }
  const normalizedItems = useMemo(() => {
    if (isPlainObject(items)) {
      return Object.entries(items).map(([key, value]) => ({ key, value }));
    }
    return items;
  }, [items]);

  return (
    <select
      className={styles.dropDown}
      name={name}
      id={id}
      value={selectedValue}
      onChange={(e) => onChange(e.target.value)}
    >
      {normalizedItems.map((item) => {
        if (isPlainObject(item)) {
          return (
            <option key={item.key} value={item.value}>
              {item.key}
            </option>
          );
        }

        return (
          <option key={item} value={item}>
            {item}
          </option>
        );
      })}
    </select>
  );
};

export default DropDown;
