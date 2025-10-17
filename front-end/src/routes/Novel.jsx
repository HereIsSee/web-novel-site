import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import App from '../App';

import NovelHeader from '../components/Novel/NovelHeader';
import NovelInfo from '../components/Novel/NovelInfo';
import NovelStatistics from '../components/Novel/NovelStatistics';
import NovelActionButtons from '../components/Novel/NovelActionButtons';
import NovelTableOfContents from '../components/Novel/NovelTableOfContents';

const Novel = () =>{
    const { id } = useParams();

    useEffect(()=>{
        const novelData = () =>{

        };

        novelData();
    },[id])
    

    return(
        <App>
            
            <div className="novel container">
                <NovelHeader />

                <NovelInfo />

                <NovelStatistics />

                <NovelActionButtons />

                <NovelTableOfContents />

                <div>Comments</div>
            </div>
        </App>
    );
}

export default Novel;