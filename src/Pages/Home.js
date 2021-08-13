import React from "react";
import '../css/home.css';

export const Home = ({ onSignInBtnClick }) =>{
    
    console.log('%c render' , 'color: red');

    return (
    <div className="container">
        <h1 className="paddingToMatchCard">Home</h1>
        
        <div className="row">
            <div className="col s12 m6">
                <div className="card">
                    <div className="card-content">
                        <h4>Step 1</h4>
                        <p>Create a  <a target="_blank" rel="noreferrer" href="https://accounts.google.com/signin/v2/identifier?service=print&continue=https%3A%2F%2Fbooks.google.co.uk%2Fbooks%3Fop%3Dlibrary&hl=en&flowName=GlifWebSignIn&flowEntry=ServiceLogin">Google Books</a> account.</p>
                    </div>
                    <div className="card-action">
                        <a target="_blank" rel="noreferrer" href="https://accounts.google.com/signin/v2/identifier?service=print&continue=https%3A%2F%2Fbooks.google.co.uk%2Fbooks%3Fop%3Dlibrary&hl=en&flowName=GlifWebSignIn&flowEntry=ServiceLogin">Google Books</a>
                    </div>
                </div>
            </div>

            <div className="col s12 m6">
                <div className="card">
                    <div className="card-content">
                        <h4>Step 2</h4>
                        <p>Once created <a id="homePageSignInLink" onClick={ onSignInBtnClick }>Sign In.</a></p>
                    </div>
                    <div className="card-action">
                    <a id="homePageSignInLink" onClick={ onSignInBtnClick }>Sign In</a>
                    </div>
                </div>
            </div>
            
        </div>
        
    </div> 
    )
}
  
export const MemoizedHome = React.memo(Home);