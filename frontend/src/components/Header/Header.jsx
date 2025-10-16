import React, {useState} from 'react';
import './Header.css';

const Header = () => {

    const [ isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () =>{
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <header className="header">
            <div className="header_container">
                {/*Logo*/}
                <div className="header_logo">
                    <h2>React App</h2>
                </div>

                {/*Menu Desktop */}
                <nav className="header_nav desktop-menu">
                    <a href="#inicio" className="nav_link">Home</a>
                    <a href="#control-vacio" className="nav_link">Control de Vacio</a>
                </nav>

                { /* Boton Hamburguesa*/}
                <button className="header_hamburguer" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                { /* Menu Movil*/}
                <nav className={`header_nav mobile-menu ${isMenuOpen ? 'mobile-menu--open' : ''}`}>
                    <a href="#inicio" className="nav_link" onClick={() => setIsMenuOpen(false)}>Home</a>
                    <a href="control-vacio" className="nav_link" onClick={() => setIsMenuOpen(false)}>Control de Vacio</a>
                </nav>
            </div>
        </header>    
    );
};

export default Header;