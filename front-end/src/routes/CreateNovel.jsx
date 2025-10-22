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
      converURL, //File if possible instead of url
      synopsis: safeHTML,
    };

    console.log("Form data ready to submit:", formData);
    //Assume that this will already make a post request with a the cover file if possible and then
    //in the database the cover link will be saved into the table as normal
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

// const CreateNovel = () => {
//   const [title, setTitle] = useState("");
//   const [coverFile, setCoverFile] = useState(null);
//   const [tempFileId, setTempFileId] = useState(null);
//   const [coverPreviewUrl, setCoverPreviewUrl] = useState("");
//   const [isUploading, setIsUploading] = useState(false);

//   const handleCoverChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     // client-side quick checks
//     if (!file.type.startsWith("image/")) return alert("Please select an image.");
//     if (file.size > 5 * 1024 * 1024) return alert("Max 5MB.");

//     setCoverFile(file);
//     // upload immediately
//     setIsUploading(true);
//     try {
//       const fd = new FormData();
//       fd.append("file", file);

//       const res = await fetch("/api/upload/cover-temp", {
//         method: "POST",
//         // include auth cookies / headers if necessary
//         body: fd,
//       });

//       if (!res.ok) {
//         const err = await res.text();
//         alert("Upload failed: " + err);
//         setIsUploading(false);
//         return;
//       }

//       const data = await res.json();
//       setTempFileId(data.tempFileId);
//       setCoverPreviewUrl(data.url);
//     } catch (err) {
//       console.error(err);
//       alert("Upload error");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const safeHTML = DOMPurify.sanitize(/* whatever editor html */ "<p>...</p>");

//     const payload = {
//       title,
//       synopsis: safeHTML,
//       userId: /* your user id source */,
//       status: "Draft",
//       tempCoverFileId: tempFileId // or null
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
//         <input value={title} onChange={e => setTitle(e.target.value)} />
//       </div>

//       <div>
//         <label>Cover Image</label>
//         <input type="file" accept="image/*" onChange={handleCoverChange} />
//         {isUploading && <p>Uploading…</p>}
//         {coverPreviewUrl && <img src={coverPreviewUrl} alt="cover preview" style={{ maxWidth: 200 }} />}
//       </div>

//       <button type="submit">Submit Novel</button>
//     </form>
//   );
// };

// export default CreateNovel;
