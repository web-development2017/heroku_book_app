import { useEffect, useState } from "react";

import "materialize-css/dist/css/materialize.min.css";
import M from "materialize-css/dist/js/materialize.min.js";

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
  
  const [all_books_read_data, setAllBooksReadData] = useState([]);
  const [reading_now_data, setReadingNowData] = useState([]);
  const [abr_already_in_collection_volumeid, setABRvolId] = useState([]);
  const [reading_now_data_already_in_collection_volumeid, setRNDvolId] = useState([]); 
  const [arb_loading, abr_setLoading] = useState(true);

  useEffect(()=>{
    console.log(all_books_read_data)
    if(all_books_read_data.length > 0){
      abr_setLoading(false);
    }
  },[all_books_read_data]);

  useEffect(()=>{
    console.log(reading_now_data)

  },[reading_now_data])

  useEffect(()=>{
    console.log(abr_already_in_collection_volumeid)

  },[abr_already_in_collection_volumeid])
  useEffect(()=>{
    console.log(reading_now_data_already_in_collection_volumeid)

  },[reading_now_data_already_in_collection_volumeid])

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
        {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        AFTER LOGIN NAV + HOME then NAV + USER RENDERED
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
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
                reading_now_data = { reading_now_data }
                setReadingNowData = { setReadingNowData }
                arb_loading = { arb_loading }
                abr_setLoading = { abr_setLoading }
                setABRvolId = { setABRvolId }
                setRNDvolId = { setRNDvolId }
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
                reading_now_data_already_in_collection_volumeid={reading_now_data_already_in_collection_volumeid}
                setAllBooksReadData = { setAllBooksReadData }
                setABRvolId = { setABRvolId }
                abr_setLoading = { abr_setLoading }
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