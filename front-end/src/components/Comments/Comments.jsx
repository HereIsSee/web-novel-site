import { EditorContent, EditorProvider, useEditor } from "@tiptap/react";
import { postComment, deleteComment } from "../../api/comment";
import { useToast } from "../../context/useToast";
import styles from "./Comments.module.css";
import StarterKit from "@tiptap/starter-kit";
import DOMPurify from "dompurify";
import TextEditor from "../FormFields/TextEditor/TextEditor";
import Comment from "./Comment";

const Comments = ({ userId, chapterId, comments, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });
  const { showToast } = useToast();

  const onPost = async () => {
    const rawHTML = editor.getHTML();
    const safeHTML = DOMPurify.sanitize(rawHTML);

    const payload = {
      Content: safeHTML,
      ChapterId: chapterId,
    };
    try {
      await postComment(payload);
      showToast("Comment posted successfully", "success");
      editor.commands.clearContent();
      onChange();
    } catch (err) {
      showToast(err.message, "error");
      console.error(err);
    }
  };
  const onCommentDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      showToast("Comment deleted successfully", "success");
      onChange();
    } catch (err) {
      showToast(err.message, "error");
      console.error(err);
    }
  };

  return (
    <div className={`card ${styles.container}`}>
      <div className={styles.header}>Comments</div>

      <div className={styles.commentEditor}>
        <TextEditor small={true} editor={editor} />
        <button onClick={() => onPost()} className={styles.post}>
          Post
        </button>
      </div>

      <div className={styles.comments}>
        {comments && comments.length > 0 ? (
          comments.map((comment) => {
            return (
              <Comment
                key={comment.id}
                comment={comment}
                userId={userId}
                onDelete={onCommentDelete}
              />
            );
          })
        ) : (
          <div className={styles.noCommentsMessage}>
            No comments posted, be the first!
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
