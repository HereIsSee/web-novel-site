import { Link, useNavigate, Navigate, useParams } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { useToast } from "../context/useToast";
import { uploadCoverTemp, createNovel, getNovel } from "../api/novel";
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

import NovelHeader from "../components/Novel/NovelHeader";
import NovelInfo from "../components/Novel/NovelInfo";
import NovelStatistics from "../components/Novel/NovelStatistics";
import NovelActionButtons from "../components/Novel/NovelActionButtons";
import NovelTableOfContents from "../components/Novel/NovelTableOfContents";

const novelStatusArray = { Draft: 0, Published: 1, Hidden: 3 };

const AuthorNovel = () => {
  const { userId, novelId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [novel, setNovel] = useState({});
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const novelData = async () => {
      try {
        const response = await getNovel(novelId);
        setNovel(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    novelData();
  }, [novelId]);

  return (
    <AuthorDashboardLayout subTitle="Novel">
      {isLoading ? (
        <>
          <h1>Loading...</h1>
        </>
      ) : error ? (
        <>
          <h1>Error: {error}</h1>
        </>
      ) : (
        <div className="novel">
          <NovelHeader
            title={novel.title}
            author={novel.author.userName}
            coverImageUrl={novel.coverImageUrl}
            isAuthor={true}
            onClick={() =>
              navigate(`/author-dashboard/${userId}/novel/${novelId}/edit`)
            }
          />

          <NovelInfo tags={novel.tags} synopsis={novel.synopsis} />

          <NovelStatistics />

          <NovelTableOfContents />
        </div>
      )}
    </AuthorDashboardLayout>
  );
};

export default AuthorNovel;
