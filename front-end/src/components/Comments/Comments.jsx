import { EditorContent, EditorProvider, useEditor } from "@tiptap/react";
import { postComment, deleteComment } from "../../api/comment";
import { useToast } from "../../context/useToast";
import { timeAgo } from "../../helpers/timeFormating";
import SectionWrapper from "../SectionWrapper";
import styles from "./Comments.module.css";
import DefaultImage from "/avatar_default.webp";
import StarterKit from "@tiptap/starter-kit";
import DOMPurify from "dompurify";
import TextEditor from "../FormFields/TextEditor/TextEditor";
import Button from "../FormFields/Button";

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
              <div key={comment.id} className={styles.comment}>
                <div className={styles.commentAvatar}>
                  <img
                    src={comment.author.avatarUrl ?? DefaultImage}
                    alt="Profile image"
                  />
                </div>

                <div className={styles.commentBody}>
                  <div className={styles.commentAuthor}>
                    {comment.author.userName}
                  </div>
                  <div className={styles.commentTimestamp}>
                    {timeAgo(comment.createdAt)}
                  </div>
                  <div
                    className={styles.commentContent}
                    dangerouslySetInnerHTML={{ __html: comment.content }}
                  ></div>
                  {comment.author.id == userId && (
                    <button
                      onClick={() => onCommentDelete(comment.id)}
                      className={styles.commentDeleteButton}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
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
