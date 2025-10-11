import { Link } from 'react-router';
import DefaultAvatarImage from '/avatar_default.webp';
import DropDownMenu from './DropDownMenu';

const Header = function(){
    
    return(
        <header>
            <nav>
                <Link className="logo" to="/">FableBound</Link>

                <div className='options'>
                    <img src={DefaultAvatarImage} alt="user image" />
                    <div className='display-name'>UserName</div>
                    <DropDownMenu />
                </div>
            </nav>
        </header>
    );
}

export default Header;