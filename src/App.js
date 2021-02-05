import 'materialize-css/dist/css/materialize.min.css';

import Navbar from './components/Navbar';
import About from './components/About';
import Home from './components/Home';


import GoogleAuthFn from './components/GoogleAuthFn';
import { UserLoggedInContext } from './contexts/loggedInState';

import React, {useEffect, useState} from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


function App() {
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

  function signInBtnFn(){
    setSigningIn(true)
    let props = {
      isAuth: setAuthState,
      setSigningIn: setSigningIn,
      setAuthScopeState: setauthorizedScopeState,
      initSignIn: "initSignIn"
    }

    GoogleAuthFn(props);
    console.log("Sign In Clicked");
  }
  function signOutBtnFn(){
    let props = {
      isAuth: setAuthState,
      setSigningIn: setSigningIn,
      setAuthScopeState: setauthorizedScopeState,
      initSignOut: "initSignOut"
    }
    GoogleAuthFn(props);
    console.log("Sign Out Clicked");
  }
  return signingIn ? (
    <h1>Signing In</h1>
    
  ) :
  (
    <>
      <UserLoggedInContext.Provider value={authstate}>
        <Router>
          {authstate ? <Navbar onSignOutBtnClick={signOutBtnFn}/> : <Navbar onSignInBtnClick={signInBtnFn}/>}
          <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route path="/about">
              <About />
            </Route>
          </Switch>
        </Router>
      </UserLoggedInContext.Provider>  
    </>
  )
}

export default App;
