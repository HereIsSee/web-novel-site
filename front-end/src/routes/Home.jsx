import { useState, useEffect } from 'react';
import NovelCard from '../components/NovelCard';
import App from '../App';

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
                        <h1>{error}</h1>
                    </>
                ) : (
                    <div className='card'>
                        {novels.map((novel) => {
                            console.log(novel);
                             return (
                                <NovelCard 
                                    key={novel.id}
                                    id={novel.id}
                                    title={novel.title}
                                    synopsis={novel.synopsis}
                                    coverImageUrl={novel.coverImageUrl}

                                    stats={novel.views}
                                />
                            )
                        })}
                        {/* <NovelCard />
                        <NovelCard />
                        <NovelCard /> */}
                        {console.log(novels)}
                    </div>
                )}
            </div>
        </App>
    );
}

export default Home;