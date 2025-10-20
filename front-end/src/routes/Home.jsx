import { useState, useEffect } from 'react';
import App from '../App';
import SectionWrapper from '../components/SectionWrapper';
// import NovelCard from '../components/NovelCard';
import NovelLatestUpdateMiniCard from '../components/NovelCards/NovelLatestUpdateMiniCard';
import NovelBasicMiniCard from '../components/NovelCards/NovelBasicMiniCard';
import { FaRegClock, FaTrophy } from "react-icons/fa";
import { AiFillPlaySquare } from "react-icons/ai";

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

    if(isLoading){
        return(
            <App>
                <h1>Loading...</h1>
            </App>
        )
    }
    if(error){
        return(
            <App>
                <h1>Something went wrong</h1>
            </App>
        )
    }

    return(
        <App>
            <SectionWrapper
                title="Latest Updates"
                Icon={FaRegClock}
            >
                {novels.map((novel, index) => {
                    if (index > 4) return;
                    return (
                        <NovelLatestUpdateMiniCard 
                            key={novel.id}
                            id={novel.id}
                            title={novel.title}
                        />
                    );
                })}
            </SectionWrapper>

            <div className='novel-categories'>
                <SectionWrapper
                    title="Best Completed"
                    Icon={FaTrophy}
                >
                    {novels.map((novel, index) => {
                        if (index > 4) return;
                        return (
                            <NovelBasicMiniCard 
                                key={novel.id}
                                id={novel.id}
                                title={novel.title}
                            />
                        );
                    })}
                </SectionWrapper>

                <SectionWrapper
                    title="Best Ongoing"
                    Icon={AiFillPlaySquare}
                >
                    {novels.map((novel, index) => {
                        if (index > 4) return;
                        return (
                            <NovelBasicMiniCard 
                                key={novel.id}
                                id={novel.id}
                                title={novel.title}
                            />
                        );
                    })}
                </SectionWrapper>
            </div>
        </App>
    );
}

export default Home;