import { EditorContent, useEditor } from "@tiptap/react";
import { useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import DOMPurify from "dompurify";

const CreateNovel = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Write your synopsis here...</p>",
  });

  const [title, setTitle] = useState("");
  const [converURL, setCoverUrl] = useState("");
  // const [content, setContent] = useState('');

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

    // Will need to submit it and deal with the success
    // or error later when there is authentication and
    // autherization.
  };

  return (
    <form
      className="novel-form container card"
      onSubmit={(e) => handleSubmit(e)}
    >
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

      <div>
        <label htmlFor="synopsis">Synopsis</label>
        <div className="novel-synopsis-edit">
          <EditorContent editor={editor} />
        </div>
      </div>

      <button type="submit">Submit</button>
    </form>
    //Maybe add a preview of how the novel would look like
  );
};

export default CreateNovel;
