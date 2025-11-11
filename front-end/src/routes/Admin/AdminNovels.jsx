import { useEffect, useState, useCallback } from "react";
import { getNovels } from "../../api/admin";
import styles from "./Admin.module.css";
import InputField from "../../components/FormFields/InputField";
import Button from "../../components/FormFields/Button";
import Pagination from "../../components/Pagination/Pagination";
import NovelCard from "../../components/NovelCards/NovelCard";

const PAGE_SIZE = 5;

const AdminNovels = () => {
  const [search, setSearch] = useState("");
  const [novels, setNovels] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const fetchNovels = useCallback(async (pageNumber = 1, searchTerm = "") => {
    const response = await getNovels(searchTerm, pageNumber, PAGE_SIZE);
    console.log("NOVELS: ", response.novels);
    setNovels(response.novels);
    setTotalCount(response.totalCount);
    setPage(pageNumber);
  }, []);

  useEffect(() => {
    fetchNovels();
  }, [fetchNovels]);

  const handleSearch = () => {
    fetchNovels(1, search);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <>
      <div className="basic-search">
        <InputField
          type="text"
          styleType="search"
          placeholder="Search for title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <div className={styles.content}>
        {console.log(novels)}
        {novels && novels.length > 0 ? (
          novels.map((novel) => {
            return (
              <NovelCard
                key={novel.id}
                id={novel.id}
                title={novel.title}
                synopsis={novel.synopsis}
                coverImageUrl={novel.coverImageUrl}
                createdAt={novel.createdAt}
                tags={novel.tags}
                stats={novel.stats}
                link={`/admin-dashboard/novels/${novel.id}/novel-info`}
              />
            );
          })
        ) : (
          <h3>No novels found</h3>
        )}
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={page}
        onPageChange={(newPage) => fetchNovels(newPage, search)}
      />
    </>
  );
};

export default AdminNovels;
