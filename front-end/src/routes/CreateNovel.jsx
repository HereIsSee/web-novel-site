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

const CreateNovel = () => {
  const [title, setTitle] = useState("");
  // const [converURL, setCoverUrl] = useState("");

  const [coverFile, setCoverFile] = useState(null);
  const [tempFileId, setTempFileId] = useState(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Write your synopsis here...</p>",
  });

  if (!isLoggedIn) return <Navigate to="/" replace />;

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // client-side quick checks
    if (!file.type.startsWith("image/"))
      return showToast("Please select an image", "error");
    if (file.size > 5 * 1024 * 1024) return showToast("Max 5MB", "error");

    setCoverFile(file);
    // upload immediately
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const response = await uploadCoverTemp(fd);

      console.log(response);

      // if (!res.ok) {
      //   const err = await res.text();
      //   alert("Upload failed: " + err);
      //   setIsUploading(false);
      //   return;
      // }

      // const data = await res.json();
      // setTempFileId(data.tempFileId);
      // setCoverPreviewUrl(data.url);
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
      title,
      tempCoverFileId: tempFileId, //File if possible instead of url
      synopsis: safeHTML,
    };

    try {
      const response = await CreateNovel(formData);
      console.log("Submit response: ", response);
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
          />
        </div>

        <div>
          <label htmlFor="coverURL">Cover URL</label>
          {/* <input
            type="url"
            name="coverURL"
            value={converURL}
            onChange={(e) => setCoverUrl(e.target.value)}
            className=""
          /> */}
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

        <button type="submit">Submit</button>
      </form>
    </AuthorDashboardLayout>
  );
};

export default CreateNovel;

// import { useState } from "react";
// import DOMPurify from "dompurify";

// const CreateNovelTemp = () => {
//   const [title, setTitle] = useState("");
//   const [coverFile, setCoverFile] = useState(null);
//   const [tempFileId, setTempFileId] = useState(null);
//   const [coverPreviewUrl, setCoverPreviewUrl] = useState("");
//   const [isUploading, setIsUploading] = useState(false);

//   const handleCoverChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     // client-side quick checks
//     if (!file.type.startsWith("image/"))
//       return showToast("Please select an image", "error");
//     if (file.size > 5 * 1024 * 1024) return showToast("Max 5MB", "error");

//     setCoverFile(file);
//     // upload immediately
//     setIsUploading(true);
//     try {
//       const fd = new FormData();
//       fd.append("file", file);

//       // const res = await fetch("/api/upload/cover-temp", {
//       //   method: "POST",
//       //   // include auth cookies / headers if necessary
//       //   body: fd,
//       // });

//       const response = await uploadCoverTemp(fd);

//       // if (!res.ok) {
//       //   const err = await res.text();
//       //   alert("Upload failed: " + err);
//       //   setIsUploading(false);
//       //   return;
//       // }

//       // const data = await res.json();
//       // setTempFileId(data.tempFileId);
//       // setCoverPreviewUrl(data.url);
//     } catch (err) {
//       console.error("Upload erro: ", err);
//       showToast(err.message, "error");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const safeHTML = DOMPurify.sanitize(
//       /* whatever editor html */ "<p>...</p>",
//     );

//     const payload = {
//       title,
//       synopsis: safeHTML,
//       tempCoverFileId: tempFileId,
//     };

//     const res = await fetch("/api/novels", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (res.ok) {
//       const json = await res.json();
//       console.log("Created", json);
//       // navigate away
//     } else {
//       const err = await res.text();
//       alert("Create failed: " + err);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label>Title</label>
//         <input value={title} onChange={(e) => setTitle(e.target.value)} />
//       </div>

//       <div>
//         <label>Cover Image</label>
//         <input type="file" accept="image/*" onChange={handleCoverChange} />
//         {isUploading && <p>Uploading…</p>}
//         {coverPreviewUrl && (
//           <img
//             src={coverPreviewUrl}
//             alt="cover preview"
//             style={{ maxWidth: 200 }}
//           />
//         )}
//       </div>

//       <button type="submit">Submit Novel</button>
//     </form>
//   );
// };

// export { CreateNovelTemp };
