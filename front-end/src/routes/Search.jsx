import { useState } from 'react';
import App from '../App';
import InputField from '../components/FormFields/InputField';
import Button from '../components/FormFields/Button';
import DropDownListSelection from '../components/FormFields/DropDownListSelection';
import MultiRangeSlider from '../components/FormFields/MultiRangeSlider';

const Search = () =>{
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);


    return(
        <App>
            <form className='search card'>
                <div className='basic-search'>
                    <InputField 
                        styleType='search'
                        placeholder='Search for title...'
                    />
                    <Button>
                        Search
                    </Button>
                </div>
                <Button
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                    align='left'
                >
                    Advanced Search
                </Button>

                {showAdvancedSearch && (
                    <div className='advanced-search'>
                        <div className='search-item'>
                            <label 
                                htmlFor="author-name"
                            >
                                Author Name
                            </label>
                            <InputField 
                                styleType='search'
                                placeholder='Author...'
                                name='author-name'
                                id='author-name'
                            />
                        </div>

                        <div className='search-item'>
                            <label 
                                htmlFor="tags"
                            >
                                Tags
                            </label>
                            
                            <DropDownListSelection />
                        </div>
                        
                        <div className="search-item">
                            <label htmlFor="pages-interval"
                            >
                                Number of Pages
                            </label>
                            <MultiRangeSlider/>
                        </div>

                        <div className="search-item">
                            <label htmlFor="rating-interval"
                            >
                                Rating
                            </label>

                            <MultiRangeSlider
                                minValue="0"
                                maxValue="5"
                                step="0.01"
                                wholeNumbers={false}
                            />
                        </div>

                        <div className="search-item">
                            <label htmlFor="status"
                            >
                                Status
                            </label>
                        </div>

                        <div className="search-item">
                            <label htmlFor=""
                            >
                                Order by
                            </label>
                        </div>

                        <Button align='stretch'>
                            Search
                        </Button>
                    </div>
                )}
            </form>

            <div className='search-results card'>

            </div>
        </App>
    );
}

export default Search;