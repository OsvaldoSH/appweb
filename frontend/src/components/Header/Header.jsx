import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [ isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () =>{
        setIsMenuOpen(!isMenuOpen);
    }

    const closeMenu = () => {
        setIsMenuOpen(false);
    }

    return (
        <header className="header">
            <div className="header_container">
                {/*Logo*/}
                <div className="header_logo">
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit'}}>
                    <h2>Zacapoaxtla</h2>
                    </Link>
                </div>

                {/*Menu Desktop */}
                <nav className="header_nav desktop-menu">
                    <Link to="/" className="nav_link" onClick={closeMenu}>Home</Link>
                    <Link to="/control-vacio" className="nav_link" onClick={closeMenu}>Control de vacio</Link>
                </nav>

                { /* Boton Hamburguesa*/}
                <button className="header_hamburguer" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                { /* Menu Movil*/}
                <nav className={`header_nav mobile-menu ${isMenuOpen ? 'mobile-menu--open' : ''}`}>
                    <Link to="/" className="nav_link" onClick={closeMenu}>Home</Link>
                    <Link to="/control-vacio" className="nav_link" onClick={closeMenu}>Control de vacio</Link>
                </nav>
            </div>
        </header>    
    );
};

export default Header;