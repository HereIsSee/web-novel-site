import { useState, useEffect } from 'react';

const Home = () =>{
    const [isLoading, setIsLoading] = useState(true);
    const [novels, SetNovels] = useState();
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
        <div className='container'>
            <h1>Home Page</h1>
            {isLoading ? (
                <div>
                    <h1>Loading...</h1>
                </div>

            ) : error ? (
                <div>
                    <h1>{error}</h1>
                </div>
            ) : (
                <div>
                    {console.log(novels)}
                </div>
            )}
        </div>
    );
}

export default Home;