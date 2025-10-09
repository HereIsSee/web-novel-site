import DefaultAvatarImage from '/avatar_default.webp';
import DropDownMenu from './DropDownMenu';

const Header = function(){
    
    return(
        <header>
            <nav>
                <h1 className='logo'>FableBound</h1>

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