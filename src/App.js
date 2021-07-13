import { useEffect, useState } from "react";
import "materialize-css/dist/css/materialize.min.css";
import M from  'materialize-css/dist/js/materialize.min.js';
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

import User from './Pages/User/User'
import AddBook from "./Pages/User/AddBook";

function App() {
  //**auth** is set TRUE or FALSE in Auth/useGoogleAuthFn->AuthCheck
  //is passed through to Navbar to set button to display "sign in" or "sign out"
  //also to send signed in user to the user page otherwise home page.

  //**startupfinished** is set to TRUE in Auth/useGoogleAuthFn.js->AuthCheck
  //after google api library has finished loading.

  //**signInBtnFn, signOutBtnFn** are defined in Auth/useGoogleAuthFn
  //passed through to Navbar.


  const { startupfinished, auth, signInBtnFn, signOutBtnFn, show_signing_in_out_screen, loggedInOutMsg} = useGoogleAuthFn();

  //**setAllBooksReadData** passed through to User/User.js
  //set with the all books read data returned from Google Books.

  //**setABRvolId** passed through to User/User.js
  //set with the volume ID of books already in collection so
  //when I eventually set up checking ISBN number it will be used tp make a check and stop books being added
  //that are already in collection.
  const [all_books_read_data, setAllBooksReadData] = useState([]);
  const [abr_already_in_collection_volumeid, setABRvolId] = useState([]);

  useEffect(()=>{
    console.log(abr_already_in_collection_volumeid)

  },[abr_already_in_collection_volumeid])

  //**loading, isLoading ** passed through to User.js
  //**isLoading** AddBook to pass through when re-fetching data
  const [loading, isLoading] = useState(null);

  //Passed through to User.js
  function collapsibleFn(){
    console.log("Collapsible clicked")
    
    var collapsible = document.querySelectorAll('.collapsible');
    M.Collapsible.init(collapsible);
  }

  return startupfinished ? 
  (
    show_signing_in_out_screen ? <div className="container"><p>Signing {loggedInOutMsg}...</p></div> :
      
    <Router>
      <Navbar auth={auth} onSidenavClick={sidenavFn} onSignInBtnClick={signInBtnFn} onSignOutBtnClick={signOutBtnFn}/>
      
      <Switch>

        {/* Home */}
        <Route exact path="/">
          { auth ? <Redirect to="/user" /> : <MemoizedHome onSignInBtnClick={signInBtnFn}/> }
        </Route>

        {/* Authorised User Only */}
        <Route exact path="/user">
          { 
            auth ? 
              <User 
                all_books_read_data = { all_books_read_data }
                setAllBooksReadData = { setAllBooksReadData }
                loading = { loading }
                isLoading = { isLoading }
                setABRvolId = { setABRvolId }
                onCollapsibleClick={collapsibleFn}
              /> 
            : <Redirect to="/" /> 
          }
        </Route>

        {/* Add Book */}
        <Route  path="/addBook">
          {
            auth ? 
              <AddBook 
                abr_already_in_collection_volumeid={abr_already_in_collection_volumeid}
                setAllBooksReadData = { setAllBooksReadData }
                setABRvolId = { setABRvolId }
                isLoading = { isLoading }
              />
            : <Redirect to="/" />
          }

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