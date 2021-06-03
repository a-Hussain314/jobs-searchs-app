import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from "./Header.module.scss";

const Header: React.FC = () => {
    return (
        <>
            <header className={styles.header}>
                <div className="container">
                    <div className={styles.header_wrapper}>
                        <NavLink exact to="/"> <h2>JobsNow</h2> </NavLink>

                        <div className={styles.navLinks}>
                            <NavLink activeClassName="activeLink" exact to="/">{"Home"}</NavLink>
                            <NavLink activeClassName="activeLink" to="/search">Search</NavLink>
                        </div>

                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;