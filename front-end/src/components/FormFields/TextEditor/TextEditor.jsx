import { EditorContent } from "@tiptap/react";
import styles from "./TextEditor.module.css";
import Toolbar from "./Toolbar";

const TextEditor = ({ editor, small = false }) => {
  return (
    <div className={styles["text-editor"]}>
      <Toolbar editor={editor} />
      <EditorContent
        className={`${styles["text-area"]} ${small ? styles.small : ""}`}
        editor={editor}
      />
    </div>
  );
};

export default TextEditor;
