import { useRef, useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import {
  createReview,
  updateReview,
  getUserNovelReview,
} from "../../api/reviews";
import { useToast } from "../../context/useToast";
import styles from "./ReviewModal.module.css";
import Button from "../FormFields/Button";
import InputField from "../FormFields/InputField";
import StarterKit from "@tiptap/starter-kit";
import DOMPurify from "dompurify";
import TextEditor from "../FormFields/TextEditor/TextEditor";
const ReviewModal = ({ userId, novelId, showModal, onClose }) => {
  const [reviewInputs, setReviewInputs] = useState({
    Title: "",
    OverallScore: "",
    StyleScore: "",
    StoryScore: "",
    GrammarScore: "",
    CharacterScore: "",
    ReviewContent: "",
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Write your review here...</p>",
  });

  const [reviewAlreadyExists, setReviewAlreadyExists] = useState(false);

  const { showToast } = useToast();

  const dialogRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const review = await getUserNovelReview(userId, novelId);

        console.log(review);

        setReviewInputs({
          Title: review.title || "",
          OverallScore: review.overallScore ?? "",
          StyleScore: review.styleScore ?? "",
          StoryScore: review.storyScore ?? "",
          GrammarScore: review.grammarScore ?? "",
          CharacterScore: review.characterScore ?? "",
          ReviewContent: review.reviewContent || "",
        });

        editor.commands.setContent(
          review.reviewContent || "<p>Write your review here...</p>",
        );
        setReviewAlreadyExists(true);
      } catch (err) {
        console.log("Caught error in fetchData:", err);
        setReviewAlreadyExists(false);
      }
    };
    fetchData();
  }, [userId, novelId, editor]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (showModal) {
      dialog.showModal();
    }

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);

    return () => dialog.removeEventListener("close", handleClose);
  }, [showModal, onClose]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!editor) return;

    const rawHTML = editor.getHTML();
    const safeHTML = DOMPurify.sanitize(rawHTML);

    const formData = {
      ...reviewInputs,
      ReviewContent: safeHTML,
    };

    try {
      let response;
      if (reviewAlreadyExists) {
        response = await updateReview(novelId, formData);
      } else {
        response = await createReview(novelId, formData);
      }

      showToast("Review submited successfully", "success");
      setReviewAlreadyExists(true);
      console.log(response);
    } catch (err) {
      showToast(err.message, "error");
      console.log(err);
    }

    dialogRef.current.close();
  };
  const onNumberInputChange = (e, key) => {
    const { value } = e.target;

    if (value === "") {
      setReviewInputs((prev) => ({ ...prev, [key]: "" }));
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
