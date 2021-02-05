import M from  'materialize-css/dist/js/materialize.min.js';
function GoogleAuthFn(props){
    let GoogleAuth;

    const apiKey = process.env.REACT_APP_API_KEY;
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const SCOPE = 'https://www.googleapis.com/auth/books'

    window.gapi.client.init({
      'apiKey': apiKey,
      'clientId': clientId,
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/books/v1/rest'],
      'scope': SCOPE
    }).then(function () {
      GoogleAuth = window.gapi.auth2.getAuthInstance();

      if(props.initSignIn === "initSignIn"){
          handleAuthClick();
          console.log("signin attempt")
        }
        else if(props.initSignOut === "initSignOut"){
          revokeAccess();
        }
        // else if(params === "getAllBooks"){
        //   getAll();
        // }
        else{  
          console.log("else from props check");
        }
      
      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);
  
      // Handle initial sign-in state. (Determine if user is already signed in.)
      setSigninStatus();     
    })

    function handleAuthClick() {
      if (GoogleAuth.isSignedIn.get()) {
        // User is authorized and has clicked "Sign out" button.
        console.log("INSIDE: handleAuthClick functions if statement.");
        GoogleAuth.signOut();
        arr.push(props.isAuth(GoogleAuth.isSignedIn.get()))
          
      } else 
      {
        // User is not signed in. Start Google auth flow.
        GoogleAuth.signIn().then(function (response){
          console.log(response);
        }, function(error){
          if(error.error === 'popup_closed_by_user'){
            props.setSigningIn(false)
            //Otherwise sidenav doesn't work after exit from sign in
            M.AutoInit()
          }
        });
      }
    }

    function revokeAccess() {
      console.log("INSIDE: revokeAccess function");
      GoogleAuth.disconnect();
      GoogleAuth.signOut();
      // setAuthState(GoogleAuth.isSignedIn.get())
      arr.push(props.isAuth(GoogleAuth.isSignedIn.get()))
      arr.push(props.setSigningIn(false))
    }

    function setSigninStatus(){
      arr.push(props.isAuth(GoogleAuth.isSignedIn.get()))
      
      const user = GoogleAuth.currentUser.get();
  
      let isAuthorized = user.hasGrantedScopes(SCOPE);
  
      setScopeAuth(isAuthorized);
    }
    
    function setScopeAuth(isAuthorized){
      props.setAuthScopeState(isAuthorized);
    }

    function updateSigninStatus() {
      M.AutoInit();
      setSigninStatus();
    }

    let arr = []
    
    return arr.map((ar)=>ar)

}

export default GoogleAuthFn;