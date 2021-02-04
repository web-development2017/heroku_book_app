import React, {useEffect, useState} from 'react';

import GoogleAuthFn from './GoogleAuthFn';

import { Link } from 'react-router-dom';
function Home(){

  const [authstate, setAuthState] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [authorizedScopeState, setauthorizedScopeState] = useState(false);

  let x = function (){

      let props = {
        isAuth: setAuthState,
        setAuthScopeState: setauthorizedScopeState
      }
      GoogleAuthFn(props);
  }

  useEffect(() =>{
    console.log('Loading')
    window.gapi.load('client:auth2', x);
    
  }, []);

  useEffect(() =>{
    console.log('Authorized : ' + authstate)
    if(authstate === true){
      setSigningIn(false)
    }
  }, [authstate]);
  
  useEffect(() =>{
    console.log("signingIn changed to: " + signingIn)
  }, [signingIn]);

  useEffect(() =>{
    console.log("authorizedScopeState changed to: " + authorizedScopeState)
  }, [authorizedScopeState]);

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