import { Link, useNavigate, Navigate } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import { useState } from "react";
import { useAuth } from "../context/useAuth";
import StarterKit from "@tiptap/starter-kit";
import DOMPurify from "dompurify";
import AuthorDashboardLayout from "../components/AuthorDashboardLayout";
import TextEditor from "../components/FormFields/TextEditor/TextEditor";

const CreateNovel = () => {
  const [title, setTitle] = useState("");
  const [converURL, setCoverUrl] = useState("");
  const { isLoggedIn } = useAuth();
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Write your synopsis here...</p>",
  });

  if (!isLoggedIn) return <Navigate to="/" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editor) return;

    const rawHTML = editor.getHTML();
    const safeHTML = DOMPurify.sanitize(rawHTML);

    const formData = {
      title,
      converURL,
      synopsis: safeHTML,
    };

    console.log("Form data ready to submit:", formData);
  };

  return (
    <AuthorDashboardLayout subTitle="Create Novel">
      <form className="novel-form card" onSubmit={(e) => handleSubmit(e)}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className=""
          />
        </div>

        <div>
          <label htmlFor="coverURL">Cover URL</label>
          <input
            type="url"
            name="coverURL"
            value={converURL}
            onChange={(e) => setCoverUrl(e.target.value)}
            className=""
          />
        </div>

        <label htmlFor="synopsis">Synopsis</label>
        <TextEditor editor={editor} />

        <button type="submit">Submit</button>
      </form>
    </AuthorDashboardLayout>
  );
};

export default CreateNovel;
