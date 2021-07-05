import "materialize-css/dist/css/materialize.min.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import { useGoogleAuthFn } from "./Auth/useGoogleAuthFn";
import { sidenavFn } from './Navbar/BtnFns';
import { Navbar } from './Navbar/Navbar';

import {MemoizedHome} from './Pages/Home';
import { MemoizedAbout } from "./Pages/About";

import User from './Pages/User'

function App() {
  const { startupfinished, auth, signInBtnFn, signOutBtnFn, show_signing_in_out_screen, loggedInOutMsg} = useGoogleAuthFn();

  return startupfinished ? 
  (
    show_signing_in_out_screen ? <div className="container"><p>Signing {loggedInOutMsg}...</p></div> :
      
    <Router>
      <Navbar auth={auth} onSidenavClick={sidenavFn} onSignInBtnClick={signInBtnFn} onSignOutBtnClick={signOutBtnFn}/>
      
      <Switch>

        {/* Home */}
        <Route exact path="/">
          { auth ? <Redirect to="/user" /> : <MemoizedHome /> }
        </Route>

        {/* Authorised User Only */}
        <Route exact path="/user">
          { auth ? <User /> : <Redirect to="/" /> }
        </Route>
        
        {/* About */}
        <Route exact path="/about">
          <MemoizedAbout />
        </Route>

      </Switch>
    </Router>
  
  ):
  (
    <div className="container">
      <p data-testid="hasStartUpFinished">Loading...</p>
    </div>
    
  )

}

export default App;