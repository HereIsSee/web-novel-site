import DefaultAvatarImage from '/avatar_default.webp';

const Header = function(){
    
    return(
        <header>
            <nav>
                <h1 className='logo'>FableBound</h1>

                <div className='options'>
                    <img src={DefaultAvatarImage} alt="user image" />
                    <div className='display-name'>UserName</div>
                    <div>|||</div>
                </div>
            </nav>
        </header>
    );
}

export default Header;