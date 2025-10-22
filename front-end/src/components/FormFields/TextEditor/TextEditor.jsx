import { EditorContent } from "@tiptap/react";
import styles from "./TextEditor.module.css";
import Toolbar from "./Toolbar";

const TextEditor = ({ editor }) => {
  return (
    <div className={styles["text-editor"]}>
      <Toolbar editor={editor} />
      <EditorContent className={styles["text-area"]} editor={editor} />
    </div>
  );
};

export default TextEditor;
