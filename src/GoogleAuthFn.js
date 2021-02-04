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
        
        // Listen for sign-in state changes.
        GoogleAuth.isSignedIn.listen(updateSigninStatus);
    
        // Handle initial sign-in state. (Determine if user is already signed in.)
        setSigninStatus();     
    })

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
        setSigninStatus();
    }

    let arr = []
    
    return arr.map((ar)=>ar)

}

export default GoogleAuthFn;