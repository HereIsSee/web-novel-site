import { useState, useEffect } from "react";
import { getTags } from "../api/tags";
import { novelStatusData } from "../helpers/novelStatusData";
import { getNovels } from "../api/novel";
import toSlug from "../helpers/toSlug";
import App from "../App";
import InputField from "../components/FormFields/InputField";
import Button from "../components/FormFields/Button";
import DropDownListSelection from "../components/FormFields/DropDownListSelection";
import MultiRangeSlider from "../components/FormFields/MultiRangeSlider";
import DropDown from "../components/FormFields/DropDown";
import NovelCard from "../components/NovelCards/NovelCard";

const orderBy = [
  "Last Update",
  "Release Date",
  "Followers",
  "Number of Pages",
  "Views",
  "Title",
  "Author",
];

const Search = () => {
  // Form data
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const [showAdvancedSearch, setShowAdvancedSearch] = useState([]);

  // Search fields inputs
  const [inputTagsValue, setInputTagsValue] = useState("");
  const [inputStatusValue, setInputStatusValue] = useState("");

  // Data for selection like tags and novel status
  const [tags, setTags] = useState([]);

  // Fetched novels
  const [novels, setNovels] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getTags();

        console.log(response);

        setTags(response);
      } catch (err) {
        console.error("Error while gettings tags: ", err);
      }
    };
    const fetchNovels = async () => {
      try {
        const response = await getNovels();
        console.log(response);
        setNovels(response);
      } catch (err) {
        console.error("Error while fetching novels: ", err);
      }
    };

    fetchTags();
    fetchNovels();
  }, []);

  return (
    <App>
      <form className="search card">
        <div className="basic-search">
          <InputField styleType="search" placeholder="Search for title..." />
          <Button>Search</Button>
        </div>
        <Button
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          align="left"
        >
          Advanced Search
        </Button>

        {showAdvancedSearch && (
          <div className="advanced-search">
            <div className="search-item">
              <label htmlFor="author-name">Author Name</label>
              <InputField
                styleType="search"
                placeholder="Author..."
                name="author-name"
                id="author-name"
              />
            </div>

            <div className="search-item">
              <label htmlFor="tags">Tags</label>

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

            <div className="search-item">
              <label htmlFor="pages-interval">Number of Pages</label>
              <MultiRangeSlider />
            </div>

            <div className="search-item">
              <label htmlFor="rating-interval">Rating</label>

              <MultiRangeSlider
                minValue="0"
                maxValue="5"
                step="0.01"
                wholeNumbers={false}
              />
            </div>

            <div className="search-item">
              <label htmlFor="status">Status</label>

              <DropDownListSelection
                items={novelStatusData}
                placeholder="Search status..."
                selectedItems={selectedStatuses}
                inputValue={inputStatusValue}
                onInputChange={(value) => setInputStatusValue(value)}
                onAddItem={(status) =>
                  setSelectedStatuses((prev) => [...prev, status])
                }
                onRemoveItem={(itemToRemove) =>
                  setSelectedStatuses((prev) =>
                    prev.filter((i) => i !== itemToRemove),
                  )
                }
              />
            </div>

            <div className="search-item">
              <label htmlFor="">Order by</label>
              <div className="order-by">
                <DropDown items={orderBy} name="orderBy" id="orderBy" />

                <DropDown
                  items={["Descending", "Ascending"]}
                  name="sortOrder"
                  id="sortOrder"
                />
              </div>
            </div>

            <Button align="stretch">Search</Button>
          </div>
        )}
      </form>

      <div className="search-results card">
        {novels.map((novel) => {
          return (
            <NovelCard
              key={novel.id}
              id={novel.id}
              title={novel.title}
              novelSlog={toSlug(novel.title)}
              synopsis={novel.synopsis}
              coverImageUrl={novel.coverImageUrl}
              createdAt={novel.createdAt}
              tags={novel.tags}
              stats={novel.stats}
            />
          );
        })}
      </div>
    </App>
  );
};

export default Search;
