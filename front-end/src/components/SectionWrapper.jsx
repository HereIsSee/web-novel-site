import App from '../App';
import { TbStarFilled } from "react-icons/tb";
import NovelFavoriteCard from '../components/NovelFavoriteCard';

const SectionWrapper = ({title, Icon, children}) =>{

    return(
        <App>
            <div className='section-container card'>
                <div className='section-header'>
                    <Icon size='40px'/>
                    <h3>{title}</h3>
                </div>
                <div className='section-novels'>
                    {children}
                </div>
            </div>
        </App>
    );
}

export default SectionWrapper;