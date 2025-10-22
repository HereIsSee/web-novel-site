import { Link, useNavigate, Navigate } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";
import { uploadCoverTemp, createNovel } from "../api/novel";
import StarterKit from "@tiptap/starter-kit";
import DOMPurify from "dompurify";
import AuthorDashboardLayout from "../components/AuthorDashboardLayout";
import TextEditor from "../components/FormFields/TextEditor/TextEditor";
import checkImageRatio from "../helpers/checkImageRatio";
import DropDown from "../components/FormFields/DropDown";

const novelStatusArray = { Draft: 0, Published: 1, Hidden: 3 };

const CreateNovel = () => {
  const [title, setTitle] = useState("");
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Write your synopsis here...</p>",
  });
  const [novelStatus, setNovelStatus] = useState(0);

  const [tempFileId, setTempFileId] = useState(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();

  const navigate = useNavigate();

  if (!isLoggedIn) return <Navigate to="/" replace />;

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/"))
      return showToast("Please select an image", "error");
    if (file.size > 5 * 1024 * 1024) return showToast("Max 5MB", "error");

    try {
      await checkImageRatio(file, 2, 3);
    } catch (err) {
      return showToast(err, "error");
    }

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const response = await uploadCoverTemp(fd);

      console.log(response);

      setTempFileId(response.tempFileId);
      setCoverPreviewUrl(response.url);

      showToast("Image uploaded successfully", "success");
    } catch (err) {
      console.error("Upload erro: ", err);
      showToast(err.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editor) return;

    const rawHTML = editor.getHTML();
    const safeHTML = DOMPurify.sanitize(rawHTML);

    const formData = {
      Title: title,
      Synopsis: safeHTML,
      CoverImageId: tempFileId,
      Status: novelStatus,
    };

    try {
      const response = await createNovel(formData);
      console.log("Submit response: ", response);
      showToast("Novel created successfully", "success");
      navigate(`/novels/${response.id}/:novelSlug`);
    } catch (err) {
      console.log(err);
      showToast(err.message, "error");
    }
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
            required
          />
        </div>

        <div>
          <label htmlFor="coverURL">Cover Image</label>
          <input type="file" accept="image/*" onChange={handleCoverChange} />
          {isUploading && <p>Uploading…</p>}
          {coverPreviewUrl && (
            <img
              src={coverPreviewUrl}
              alt="cover preview"
              style={{ maxWidth: 200 }}
            />
          )}
        </div>

        <div>
          <label htmlFor="synopsis">Synopsis</label>
          <TextEditor editor={editor} />
        </div>

        <div>
          <label htmlFor="novelStatus">Novel Status</label>
          <DropDown
            items={novelStatusArray}
            name="novelStatus"
            id="novelStatus"
            onChange={setNovelStatus}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </AuthorDashboardLayout>
  );
};

export default CreateNovel;
