import { Link } from 'react-router-dom';
function Home(){
    return (
        <>            
            <header className="Navbar">
                <nav className="blue">
                    <div className="nav-wrapper">
                        <Link to="/" className="brand-logo left">Home</Link>
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            <li><Link to="/about" className="right">About</Link></li>
                        </ul>
                        
                    </div>
                </nav>
                
                <h1>Home Page</h1>
            </header>
        </>
    );
}
export default Home;