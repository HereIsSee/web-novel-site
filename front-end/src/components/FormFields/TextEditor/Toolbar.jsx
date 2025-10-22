import { useEffect, useState } from "react";
import { FaBold, FaItalic } from "react-icons/fa";
import { MdFormatListBulleted } from "react-icons/md";
import { GoListOrdered } from "react-icons/go";
import styles from "./TextEditor.module.css";

const iconStyles = {
  display: "inline",
  verticalAlign: "middle",
  color: "inherit",
};
const iconSize = "22px";

const Toolbar = ({ editor }) => {
  const [, forceUpdate] = useState(0);
  const rerender = () => forceUpdate((x) => x + 1);

  useEffect(() => {
    if (!editor) return;

    editor.on("update", rerender);
    editor.on("selectionUpdate", rerender);

    return () => {
      editor.off("update", rerender);
      editor.off("selectionUpdate", rerender);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div className={styles["toolbar"]}>
      <button
        type="button"
        onClick={() => {
          editor.chain().focus().toggleBold().run();
          rerender();
        }}
        className={editor.isActive("bold") ? styles["active"] : ""}
      >
        <FaBold style={iconStyles} size={iconSize} />
      </button>

      <button
        type="button"
        onClick={() => {
          editor.chain().focus().toggleItalic().run();
          rerender();
        }}
        className={editor.isActive("italic") ? styles["active"] : ""}
      >
        <FaItalic style={iconStyles} size={iconSize} />
      </button>

      <button
        type="button"
        onClick={() => {
          editor.chain().focus().toggleBulletList().run();
          rerender();
        }}
        className={editor.isActive("bulletList") ? styles["active"] : ""}
      >
        <MdFormatListBulleted style={iconStyles} size={iconSize} />
      </button>

      <button
        type="button"
        onClick={() => {
          editor.chain().focus().toggleOrderedList().run();
          rerender();
        }}
        className={editor.isActive("orderedList") ? styles["active"] : ""}
      >
        <GoListOrdered style={iconStyles} size={iconSize} />
      </button>
    </div>
  );
};

export default Toolbar;
