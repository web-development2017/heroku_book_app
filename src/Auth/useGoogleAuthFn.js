import { useState, useEffect } from "react";

const AuthCheck = ({ msg, setAuth, setStartUpFinished, setSigningInOut }) =>{

    const apiKey = process.env.REACT_APP_API_KEY;
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const SCOPE = 'https://www.googleapis.com/auth/books';

    window.gapi.client.init({
        'apiKey': apiKey,
        'clientId': clientId,
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/books/v1/rest'],
        'scope': SCOPE
    }).then(function () {
        const GoogleAuth = window.gapi.auth2.getAuthInstance();

        // Listen for sign-in state changes.
        GoogleAuth.isSignedIn.listen(updateSigninStatus);

        // Handle initial sign-in state. (Determine if user is already signed in.)
        setSigninStatus();

        function setSigninStatus(){
            setAuth(GoogleAuth.isSignedIn.get());          
        }

        function updateSigninStatus() {
            setSigninStatus();
        }

        msg === "initialAuthCheck" ? setStartUpFinished(true) :
        msg === "logIn" ? handleAuth() :
        msg === "logOut" ? SignOut() :
        console.log(msg);

        function SignOut(){
            GoogleAuth.signOut(); 
            setSigningInOut(false);
        }
        

        function handleAuth(){
            GoogleAuth.signIn().then(function (response){
                
                console.log(response);
                if(response !== undefined){
                    setSigningInOut(false);
                }   
            }, function(error){
                if(error.error === 'popup_closed_by_user'){
                    setSigningInOut(false);
                }
            });
        }     
    })
}

const initAuthCheck = ({ msg, setAuth, setStartUpFinished, setSigningInOut}) =>{
    
    msg === "initialAuthCheck"
    ? AuthCheck({msg, setAuth, setStartUpFinished, setSigningInOut })
    // : msg === "errorfromInitialAuthCheck"
    // ? console.log("need to retry loading GOOGLE CLIENT & AUTH2 LIBRARY")
    : msg === "logIn"
    ? AuthCheck({msg, setAuth, setSigningInOut})
    : msg === "logOut"
    ? AuthCheck({msg, setAuth, setSigningInOut})
    : console.log(msg);
    
}

export const useGoogleAuthFn = () =>{
    const [startupfinished, setStartUpFinished] = useState(false);
    const [auth, setAuth] = useState(false);
    const [show_signing_in_out_screen, setSigningInOut] = useState(false);
    const [loggedInOutMsg, setLoggedInOutMsg] = useState("");


    function signInBtnFn(){
        setLoggedInOutMsg("In");
        setSigningInOut(true);
        let props = {
            msg: "logIn",
            setAuth: setAuth,
            setSigningInOut: setSigningInOut,
            setLoggedInOutMsg: setLoggedInOutMsg
        };
        initAuthCheck(props);        
    }
    function signOutBtnFn(){
        setLoggedInOutMsg("In");
        setSigningInOut(true);
        let props = {
            msg: "logOut",
            setAuth: setAuth,
            setSigningInOut: setSigningInOut
        };
        initAuthCheck(props);        
    }

    useEffect(() => {
        const handler = () => {
            let props = {
                msg: "initialAuthCheck",
                setAuth: setAuth,
                setStartUpFinished: setStartUpFinished
            };
            window.gapi.load("client:auth2", {
                callback: function(){
                  initAuthCheck(props);
                },
                onerror: function(){
                  console.log("Gapi Library Faiiled To Load");
                }
            });
        }
      
        if (window.gapi) {
          handler()
        } else {
          window.init = handler
        }        
    }, []);

    return { startupfinished, auth, signInBtnFn, signOutBtnFn, show_signing_in_out_screen, loggedInOutMsg }
}