import styles from "./DropDown.module.css";

const DropDown = ({ items = [], name, id }) => {
  return (
    <select className={styles.dropDown} name={name} id={id}>
      {items.map((item, index) => {
        return (
          <option key={item} value={item} selected={index === 0}>
            {item}
          </option>
        );
      })}
    </select>
  );
};

export default DropDown;
