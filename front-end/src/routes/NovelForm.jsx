import { Link, useNavigate, Navigate, useParams } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { useToast } from "../context/useToast";
import {
  uploadCoverTemp,
  createNovel,
  getNovel,
  updateNovel,
  getNovelStatusValues,
} from "../api/novel";
import { getTags } from "../api/tags";
import StarterKit from "@tiptap/starter-kit";
import DOMPurify from "dompurify";
import AuthorDashboardLayout from "../components/AuthorDashboardLayout";
import TextEditor from "../components/FormFields/TextEditor/TextEditor";
import checkImageRatio from "../helpers/checkImageRatio";
import InputField from "../components/FormFields/InputField";
import Button from "../components/FormFields/Button";
import DropDown from "../components/FormFields/DropDown";
import DropDownListSelection from "../components/FormFields/DropDownListSelection";

const NovelForm = () => {
  const { userId, novelId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  //Novel data
  const [title, setTitle] = useState("");
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Write your synopsis here...</p>",
  });
  const [novelStatus, setNovelStatus] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);

  // Search fields inputs
  const [inputTagsValue, setInputTagsValue] = useState("");
  const [novelStatusArray, setNovelStatusArray] = useState([]);
  // Preview of uploaded image
  const [tempFileId, setTempFileId] = useState(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Data for selection like tags and novel status
  const [tags, setTags] = useState([]);

  useEffect(() => {
    console.log(novelId);
    if (!novelId) return;
    const novelData = async () => {
      try {
        const novel = await getNovel(novelId);
        // Set fields initial data
        setTitle(novel.title);
        editor.commands.setContent(novel.synopsis);
        setCoverPreviewUrl(novel.coverImageUrl);
        setTempFileId(novel.coverImageId);
        setNovelStatus(novel.status);
        setSelectedTags(novel.tags);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    novelData();
  }, [novelId, editor]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const [tags, novelStatusArrayData] = await Promise.all([
          getTags(),
          getNovelStatusValues(),
        ]);

        setTags(tags);
        setNovelStatusArray(novelStatusArrayData);
        console.log(novelStatusArrayData);
      } catch (err) {
        console.error("Error while gettings tags: ", err);
      }
    };
    fetchTags();
  }, []);

  const { showToast } = useToast();

  const navigate = useNavigate();

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
      Status: Number(novelStatus),
      Tags: selectedTags,
    };

    try {
      let response;
      if (novelId != null) {
        response = await updateNovel(novelId, formData);
        showToast("Novel updated successfully", "success");
        navigate(`/author-dashboard/${userId}/novel/${novelId}`);
      } else {
        response = await createNovel(formData);
        showToast("Novel created successfully", "success");
        navigate(`/novels/${response.id}/:novelSlug`);
      }
    } catch (err) {
      console.log(err);
      showToast(err.message, "error");
    }
  };

  return (
    <AuthorDashboardLayout subTitle="Create Novel">
      {isLoading && novelId !== null ? (
        <>
          <h1>Loading...</h1>
        </>
      ) : error ? (
        <>
          <h1>Error: {error}</h1>
        </>
      ) : (
        <form className="novel-form card" onSubmit={(e) => handleSubmit(e)}>
          <div>
            <label htmlFor="title">Title</label>
            <InputField
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className=""
              required={true}
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

          {novelId && (
            <div>
              <label htmlFor="novelStatus">Novel Status</label>
              <DropDown
                items={novelStatusArray}
                name="novelStatus"
                id="novelStatus"
                selectedValue={novelStatus}
                onChange={setNovelStatus}
              />
            </div>
          )}

          <div>
            <label htmlFor="">Novel tags</label>
            <DropDownListSelection
              items={tags}
              placeholder="Select tags..."
              selectedItems={selectedTags}
              inputValue={inputTagsValue}
              onInputChange={(value) => setInputTagsValue(value)}
              onAddItem={(tag) => setSelectedTags((prev) => [...prev, tag])}
              onRemoveItem={(itemToRemove) =>
                setSelectedTags((prev) =>
                  prev.filter((i) => i !== itemToRemove),
                )
              }
            />
          </div>

          <div>
            <label htmlFor="synopsis">Synopsis</label>
            <TextEditor editor={editor} />
          </div>

          <Button type="submit">Submit</Button>
        </form>
      )}
    </AuthorDashboardLayout>
  );
};

export default NovelForm;
