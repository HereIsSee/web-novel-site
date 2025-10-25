import { useRef, useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import styles from "./ReviewModal.module.css";
import Button from "../FormFields/Button";
import InputField from "../FormFields/InputField";
import StarterKit from "@tiptap/starter-kit";
import DOMPurify from "dompurify";
import TextEditor from "../FormFields/TextEditor/TextEditor";
const ReviewModal = ({ onClose }) => {
  const [reviewInputs, setReviewInputs] = useState({
    Title: "",
    OverallScore: null,
    StyleScore: null,
    StoryScore: null,
    GrammarScore: null,
    CharacterScore: null,
    ReviewContent: "",
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Write your review here...</p>",
  });

  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);

    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const onSubmit = (e) => {
    e.preventDefault();

    dialogRef.current.close();
  };
  const onNumberInputChange = (e, key) => {
    const { value } = e.target;

    if (value === "") {
      setReviewInputs((prev) => ({ ...prev, [key]: null }));
      return;
    }

    let num = parseFloat(value);

    const min = 0;
    const max = 5;
    if (num < min) num = min;
    if (num > max) num = max;

    const step = 0.5;
    num = Math.round(num / step) * step;

    setReviewInputs((prev) => ({ ...prev, [key]: num }));
  };

  return (
    <dialog className={styles["review-module"]} ref={dialogRef}>
      <button
        className={styles["close-button"]}
        styleType="blue-white-rounded"
        style={{ position: "absolute", top: "10px", right: "10px" }}
        onClick={() => dialogRef.current.close()}
      >
        X
      </button>
      <h1>Leave a Review!</h1>
      <form className={styles["review-form"]} onSubmit={onSubmit}>
        <div className={styles["field"]}>
          <label htmlFor="title">Review Title</label>
          <InputField
            type="text"
            name="title"
            id="title"
            min={0}
            max={5}
            step={0.5}
            value={reviewInputs.Title}
            required={true}
            onChange={(e) =>
              setReviewInputs((prev) => ({ ...prev, Title: e.target.value }))
            }
          />
        </div>

        <div className={styles["field"]}>
          <label htmlFor="overall-rating">Overall Score</label>
          <InputField
            type="number"
            name="overall-rating"
            id="overall-rating"
            min="0"
            max="5"
            step="0.5"
            value={reviewInputs.OverallScore}
            required={true}
            onChange={(e) => onNumberInputChange(e, "OverallScore")}
          />
        </div>

        <div className={styles["field-container"]}>
          <div className={styles["field"]}>
            <label htmlFor="overall-rating">Grammar Score</label>
            <InputField
              type="number"
              name="overall-rating"
              id="overall-rating"
              min="0"
              max="5"
              step="0.5"
              value={reviewInputs.GrammarScore}
              required={true}
              onChange={(e) => onNumberInputChange(e, "GrammarScore")}
            />
          </div>

          <div className={styles["field"]}>
            <label htmlFor="overall-rating">Style Score</label>
            <InputField
              type="number"
              name="overall-rating"
              id="overall-rating"
              min="0"
              max="5"
              step="0.5"
              value={reviewInputs.StyleScore}
              required={true}
              onChange={(e) => onNumberInputChange(e, "StyleScore")}
            />
          </div>
        </div>

        <div className={styles["field-container"]}>
          <div className={styles["field"]}>
            <label htmlFor="overall-rating">Story Score</label>
            <InputField
              type="number"
              name="overall-rating"
              id="overall-rating"
              min="0"
              max="5"
              step="0.5"
              value={reviewInputs.StoryScore}
              required={true}
              onChange={(e) => onNumberInputChange(e, "StoryScore")}
            />
          </div>

          <div className={styles["field"]}>
            <label htmlFor="overall-rating">Character Score</label>
            <InputField
              type="number"
              name="overall-rating"
              id="overall-rating"
              min="0"
              max="5"
              step="0.5"
              value={reviewInputs.CharacterScore}
              required={true}
              onChange={(e) => onNumberInputChange(e, "CharacterScore")}
            />
          </div>
        </div>
        <div className={styles["field"]}>
          <label htmlFor="synopsis">Synopsis</label>
          <TextEditor editor={editor} />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </dialog>
  );
};

export default ReviewModal;
