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

  //**setAllBooksReadData** -> User/User.js -> Data/getData -> Utils/sortData **WHERE IT IS SET**
  //set with the all books read data returned from Google Books.
  const [all_books_read_data, setAllBooksReadData] = useState([]);

  //**setABRvolId** -> User/User.js -> Data/get_set_Data/getData+postData -> Utils/sortData **WHERE IT IS SET**
  //set with the volume ID of books already in collection so used to make a check and stop books being added
  //that are already in collection.
  const [abr_already_in_collection_volumeid, setABRvolId] = useState([]);  

  //**abr_loading, abr_isLoading ** -> User/User.js
  //**abr_isLoading** -> User/User.js -> User/Display_ABR_Content -> Data/get_set_Data/postData
  //**WHERE IT IS SET TRUE** when book deleted because the data for the User page is re-fetched.
  const [arb_loading, abr_isLoading] = useState(true);

  useEffect(()=>{
    console.log("loading ABR: " + arb_loading)
  },[arb_loading]);

  useEffect(()=>{
    if(all_books_read_data.length > 0){
      abr_isLoading(false);
    }else{
      // isLoading(true)
      console.log('should be 0: ' + all_books_read_data.length);
    }
  },[all_books_read_data]);

  //Passed through to User.js
  function collapsibleFn(){
    // console.log("Collapsible clicked");
    
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
                arb_loading = { arb_loading }
                abr_isLoading = { abr_isLoading }
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
                abr_isLoading = { abr_isLoading }
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