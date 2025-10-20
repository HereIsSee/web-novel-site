import { useState, useEffect } from 'react';
import App from '../App';
import SectionWrapper from '../components/SectionWrapper';
// import NovelCard from '../components/NovelCard';
import NovelLatestUpdateCard from '../components/NovelCards/NovelLatestUpdateCard';
import { FaRegClock } from "react-icons/fa";

const Home = () =>{
    const [isLoading, setIsLoading] = useState(true);
    const [novels, SetNovels] = useState([]);
    const [error, SetError] = useState('');

    useEffect(()=>{
        const fetchNovels = () =>{
            fetch('/api/novels').then(response => {
                if (response.status >= 500)
                    throw new Error("Server Error");
                else if (response.status >= 400){
                    throw new Error("Client side Error");
                }
                return response.json();
            })
            .then(response => SetNovels(response))
            .catch(error => SetError(error))
            .finally(()=>setIsLoading(false));
        }

        fetchNovels();
        
    },[]);

    return(
        <App>
            <div className='container'>
                <h1>Home Page</h1>
                {isLoading ? (
                    <>
                        <h1>Loading...</h1>
                    </>

                ) : error ? (
                    <>
                        <h1>Something went wrong</h1>
                    </>
                ) : (
                    <>
                        <SectionWrapper
                            title="Latest Updates"
                            Icon={FaRegClock}
                        >
                            {novels.map((novel) => {
                                console.log(novel);
                                return (
                                    <NovelLatestUpdateCard 
                                        key={novel.id}
                                        id={novel.id}
                                        title={novel.title}
                                        // synopsis={novel.synopsis}
                                        // coverImageUrl={novel.coverImageUrl}

                                        // stats={novel.views}
                                    />
                                )
                            })}
                            
                            {console.log(novels)}
                        </SectionWrapper>


                    </>
                )}
            </div>
        </App>
    );
}

export default Home;