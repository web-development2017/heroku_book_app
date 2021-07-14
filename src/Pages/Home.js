import React from "react";
import '../css/home.css';

export const Home = ({ onSignInBtnClick }) =>{
    // console.log("Home Rendered")
    return (
    <div className="container">
        <h1>Home</h1>
        <p>
            Create a  <a target="_blank" rel="noreferrer" href="https://accounts.google.com/signin/v2/identifier?service=print&continue=https%3A%2F%2Fbooks.google.co.uk%2Fbooks%3Fop%3Dlibrary&hl=en&flowName=GlifWebSignIn&flowEntry=ServiceLogin">Google Books</a> account.
        </p>
        <p>
            Once created <a id="homePageSignInLink" onClick={ onSignInBtnClick }>Sign In.</a>
        </p>
        
    </div> 
    )
}
  
export const MemoizedHome = React.memo(Home);