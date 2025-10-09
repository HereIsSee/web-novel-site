import { useState } from 'react';

const DropDownMenu = function(){
    const [showMenu, setShowMenu] = useState(false);

    const handleClick = () =>{
        setShowMenu(!showMenu);
    }

    return(
        <div className='drop-down-menu-container'>
            <button onClick={handleClick}>☰</button>
            {showMenu && (
                <div className='drop-down-menu'>
                    <div>My profile</div>
                    <div>Author Dashboard</div>
                    <hr />
                    <div>Search</div>
                    <div>Follow list</div>
                    <div>Read Later</div>
                    <div>Favorites</div>
                </div>
            )}
        </div>
    );
}

export default DropDownMenu;