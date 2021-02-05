import React, { useContext } from 'react';

import './css/NavbarStyle.css'
import { Link } from 'react-router-dom';

import { UserLoggedInContext } from '../contexts/loggedInState';

import 'materialize-css/dist/css/materialize.min.css';
import M from  'materialize-css/dist/js/materialize.min.js';

const Navbar = ({onSignInBtnClick, onSignOutBtnClick}) => {

    const userLoggedInState = useContext(UserLoggedInContext);

    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.sidenav');
        // var instances = M.Sidenav.init(elems, options);
        // var instances = M.Sidenav.init(elems);
        M.Sidenav.init(elems);
    });
    return (
        <header className="Navbar">
            <nav className="blue">
                <div className="nav-wrapper">
                    <Link to="/" className="brand-logo">Home</Link>
                    <a data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                    <ul className="right hide-on-med-and-down sidenav-close">
                        <li><Link to="/about" >About</Link></li>
                        {userLoggedInState ? <button id="signOutLink" className="btn blue" onClick={onSignOutBtnClick}>Sign Out</button> : <button id="signInLink" className="btn blue" onClick={onSignInBtnClick}>Sign In</button>}
                    </ul>
                </div>
            </nav>

            <ul className="sidenav" id="mobile-demo">
                <button className="sidenav-close" id="sideNavClose"><i id="closeIcon" className="material-icons">close</i></button>
                <li><Link to="/about" className="sidenav-close">About</Link></li>
                <li><a href="contact.html">Contact</a></li>
                {userLoggedInState ? <button id="signOutLinkSidenav" onClick={onSignOutBtnClick}>Sign Out</button> : <button className="sidenav-close" id="signInLinkSideNav" onClick={onSignInBtnClick}>Sign In</button>}
            </ul> 
        </header>
    )
}
export default Navbar;