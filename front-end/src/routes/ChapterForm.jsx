import { Link, useNavigate, Navigate, useParams } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { updateChapterAdmin } from "../api/admin";
import { useToast } from "../context/useToast";
import { getChapter, createChapter, updateChapter } from "../api/chapter";
import StarterKit from "@tiptap/starter-kit";
import DOMPurify from "dompurify";
import DashboardLayout from "../components/DashboardLayout";
import TextEditor from "../components/FormFields/TextEditor/TextEditor";
import InputField from "../components/FormFields/InputField";
import Button from "../components/FormFields/Button";

// role: admin or author
const ChapterForm = ({ role }) => {
  const { userId, novelId, chapterId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //Chapter data
  const [title, setTitle] = useState("");
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Write your chapter here...</p>",
  });

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!novelId || !chapterId) return;
    console.log(novelId, chapterId);
    const chapterData = async () => {
      try {
        const chapter = await getChapter(novelId, chapterId);

        setTitle(chapter.title);
        editor.commands.setContent(chapter.content);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    chapterData();
  }, [novelId, chapterId, editor]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editor) return;

    const rawHTML = editor.getHTML();
    const safeHTML = DOMPurify.sanitize(rawHTML);

    const formData = {
      Title: title,
      Content: safeHTML,
      ChapterNumber: 0,
    };

    try {
      if (novelId && chapterId) {
        if (role === "admin") {
          await updateChapterAdmin(chapterId, formData);
          showToast("Chapter updated successfully", "success");
          navigate(`/admin-dashboard/novels/${novelId}/chapters`);
        } else {
          await updateChapter(novelId, chapterId, formData);
          showToast("Chapter updated successfully", "success");
          navigate(`/author-dashboard/${userId}/novel/${novelId}/chapters`);
        }
      } else {
        await createChapter(novelId, formData);
        showToast("Chapter created successfully", "success");
        navigate(`/author-dashboard/${userId}/novel/${novelId}/chapters`);
      }
    } catch (err) {
      console.log(err);
      showToast(err.message, "error");
    }
  };

  return (
    <DashboardLayout title="Author Dashboard" subTitle="Create Chapter">
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
            <label htmlFor="content">Chapter Content</label>
            <TextEditor editor={editor} />
          </div>

          <Button type="submit">Submit</Button>
        </form>
      )}
    </DashboardLayout>
  );
};

export default ChapterForm;
