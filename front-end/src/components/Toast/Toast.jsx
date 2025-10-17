// components/Toast.jsx
import React from "react";
import styles from "./Toast.module.css";

const Toast = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className={`${styles.toastContainer} ${styles[type]}`}>
      <span>{message}</span>
      <button className={styles.closeButton} onClick={onClose}>
        X
      </button>
    </div>
  );
};

export default Toast;
