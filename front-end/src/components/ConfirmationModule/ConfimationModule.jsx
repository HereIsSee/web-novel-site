import { useEffect, useRef } from "react";
import styles from "./ConfirmationModule.module.css";

const ConfirmationModule = ({ message, onConfirm, onClose, open }) => {
  const dialogRef = useRef(null);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  // Close when clicking outside the dialog content
  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <dialog
      open
      ref={dialogRef}
      className={styles.modal}
      onClick={handleBackdropClick}
    >
      <div className={styles.container}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <p className={styles.message}>{message}</p>

        <div className={styles.buttons}>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Confirm
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmationModule;
