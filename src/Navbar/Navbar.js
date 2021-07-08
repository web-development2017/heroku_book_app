import { Link } from "react-router-dom";
import "../css/navBarStyle.css";

export const Navbar = ({ auth, onSidenavClick, onSignInBtnClick, onSignOutBtnClick }) =>{
    console.log("Navbar rendered");
    return (
        <header className="Navbar container">
            <nav className="blue">
                <div className="nav-wrapper">
                    {auth ? <Link to="/user" className="brand-logo">Home</Link> : <Link to="/" className="brand-logo">Home</Link>}
                    <a onClick={onSidenavClick} data-testid="menu" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                    <ul className="right hide-on-med-and-down sidenav-close">
                        <li><Link to="/about">About</Link></li>
                        <li>
                        {
                            auth ? <button data-testid="signOut" id="signOutLink" className="btn blue" onClick={onSignOutBtnClick}>Sign Out</button> 
                            :
                            <button data-testid="signIn" id="signInLink" className="btn blue" onClick={onSignInBtnClick}>Sign In</button>

                        }
                        </li>
                    </ul>
                </div>
            </nav>
            <ul className="sidenav hide-on-large-only" id="mobile-demo">
                <button className="sidenav-close" id="sideNavClose">
                <i id="closeIcon" className="material-icons">
                    close
                </i>
                </button>
                <li>
                {
                    auth ? 
                    <button className="sidenav-close" id="signOutLinkSidenav" onClick={onSignOutBtnClick}>Sign Out</button> 
                    :
                    <button data-testid="signInSidenav" className="sidenav-close" id="signInLinkSideNav" onClick={onSignInBtnClick}>Sign In</button>
                }
                </li>
                <li><a data-testid="sideNavAbout">About</a></li>
            </ul>
        </header>
    )
}