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
                if (response.status >= 400){
                    throw new Error("Server Error");
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
                        <NovelCard />
                        <NovelCard />
                        <NovelCard />
                        {console.log(novels)}
                    </div>
                )}
            </div>
        </App>
    );
}

export default Home;