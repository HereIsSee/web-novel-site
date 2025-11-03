import { useState, useEffect } from "react";
import { getTags } from "../api/tags";
import { getPublicNovels, getNovelStatusValues } from "../api/novel";
import { getOrderByOptions } from "../api/search";
import toSlug from "../helpers/toSlug";
import App from "../App";
import InputField from "../components/FormFields/InputField";
import Button from "../components/FormFields/Button";
import DropDownListSelection from "../components/FormFields/DropDownListSelection";
import MultiRangeSlider from "../components/FormFields/MultiRangeSlider";
import DropDown from "../components/FormFields/DropDown";
import NovelCard from "../components/NovelCards/NovelCard";

const Search = () => {
  // Form data
  const [title, setTitle] = useState("");
  const [authorUsername, setAuthorUsername] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [pages, setPages] = useState({ From: 0, To: 20000 });
  const [rating, setRating] = useState({ From: 0, To: 5 });
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedOrderBy, setSelectedOrderBy] = useState(0);
  const [ascending, setAscending] = useState(false);

  // Search fields inputs
  const [inputTagsValue, setInputTagsValue] = useState("");
  const [inputStatusValue, setInputStatusValue] = useState("");

  // Data for selection like tags and novel status
  const [tags, setTags] = useState([]);
  const [novelStatus, setNovelStatus] = useState([]);
  const [orderByValues, setOrderByValues] = useState([]);

  // Fetched novels
  const [novels, setNovels] = useState([]);

  // Show advanced search
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const [tagsData, novelStatusData, orderBy] = await Promise.all([
          getTags(),
          getNovelStatusValues(),
          getOrderByOptions(),
        ]);

        setTags(tagsData);
        setNovelStatus(novelStatusData);
        setOrderByValues(orderBy);
      } catch (err) {
        console.error("Error while gettings tags: ", err);
      }
    };
    const fetchNovels = async () => {
      try {
        const response = await getPublicNovels();
        console.log(response);
        setNovels(response);
      } catch (err) {
        console.error("Error while fetching novels: ", err);
      }
    };

    fetchTags();
    fetchNovels();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      Title: title,
      ...(showAdvancedSearch && {
        AuthorUsername: authorUsername,
        TagsIds: selectedTags.map((t) => t.id),
        Pages: pages,
        Rating: rating,
        StatusEnumValues: selectedStatuses.map((s) => s.value),
        OrderBy: selectedOrderBy,
        Ascending: ascending,
      }),
    };

    console.log("PAYLOAD: ", payload);
    // try{

    // } catch(err){

    // } finally{

    // }
  };

  return (
    <App>
      <form className="search card" onSubmit={onSubmit}>
        <div className="basic-search">
          <InputField
            type="text"
            styleType="search"
            placeholder="Search for title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button type="submit">Search</Button>
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
                type="text"
                value={authorUsername}
                onChange={(e) => setAuthorUsername(e.target.value)}
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
              <MultiRangeSlider
                minValue={0}
                maxValue={20000}
                step={0}
                min={pages.From}
                max={pages.To}
                onMinChange={(value) =>
                  setPages((prev) => ({ ...prev, From: Number(value) }))
                }
                onMaxChange={(value) =>
                  setPages((prev) => ({ ...prev, To: Number(value) }))
                }
              />
            </div>

            <div className="search-item">
              <label htmlFor="rating-interval">Rating</label>

              <MultiRangeSlider
                minValue="0"
                maxValue="5"
                step="0.01"
                wholeNumbers={false}
                min={rating.From}
                max={rating.To}
                onMinChange={(value) =>
                  setRating((prev) => ({ ...prev, From: Number(value) }))
                }
                onMaxChange={(value) =>
                  setRating((prev) => ({ ...prev, To: Number(value) }))
                }
              />
            </div>

            <div className="search-item">
              <label htmlFor="status">Status</label>

              <DropDownListSelection
                items={novelStatus}
                placeholder="Search status..."
                selectedItems={selectedStatuses}
                inputValue={inputStatusValue}
                keyPair={true}
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
                <DropDown
                  items={orderByValues}
                  name="orderBy"
                  id="orderBy"
                  onChange={(value) => setSelectedOrderBy(value)}
                />

                <DropDown
                  items={["Descending", "Ascending"]}
                  name="sortOrder"
                  id="sortOrder"
                  onChange={(value) =>
                    value === "Descending"
                      ? setAscending(false)
                      : setAscending(true)
                  }
                />
              </div>
            </div>

            <Button type="submit" align="stretch">
              Search
            </Button>
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
              novelSlug={toSlug(novel.title)}
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
