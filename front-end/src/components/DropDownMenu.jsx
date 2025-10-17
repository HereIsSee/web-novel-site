import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './FormFields/Button';

const DropDownMenu = function(){
    const [showMenu, setShowMenu] = useState(false);

    const handleClick = () =>{
        setShowMenu(!showMenu);
    }

    return(
        <div className='drop-down-menu-container'>
            <Button styleType='text-only-gray'onClick={handleClick}>☰</Button>
            {showMenu && (
                <div className='drop-down-menu'>
                    <Link to="/profile/1">My Profile</Link> {/* Id needs to be changed into a dynamic one */}
                    <Link to="/author-dashboard/:id">Author Dashboard</Link> {/* Id needs to be changed into a dynamic one */}
                    <hr />
                    <Link to="/search">Search</Link>
                    <Link to="/follows">Follow List</Link>
                    <Link to="/read-later">Read Later</Link>
                    <Link to="/favorites">Favorites</Link>
                    <Link to="/login">Log in</Link>
                </div>
            )}
        </div>
    );
}

export default DropDownMenu;