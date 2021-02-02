import { Link } from 'react-router-dom';
function Home(){
    return (
        <>
            <Link to="/about">About</Link>
            <h1>Home Page</h1>
        </>
    );
}
export default Home;