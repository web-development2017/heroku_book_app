// Favorites: 0
// Purchased: 1
// To Read: 2
// Reading Now: 3
// Have Read: 4
// Reviewed: 5
// Recently Viewed: 6
// My eBooks: 7
// Books For You: 8 If we have no recommendations for the user, this shelf does not exist.

export const getData = async({ url, controller }, sorted_data_callback)=>{
    
    const fetchUserData = new Promise(function(resolve, reject){
        controller.signal.addEventListener('abort', () => {
            reject([])
        });
        const request = window.gapi.client.request({
            'method': 'GET',
            'path': url
        });

        // // Execute the API request.
        request.execute( function(response) {
            // const obj = response.result;
            resolve(response);
            
            reject("Error");          
    
        });   
    });

    fetchUserData.then((value)=>{
        sorted_data_callback(value);       
        
    }).catch((error)=>{
        console.log(error)//error shows an empty array when controller abort called
    });
    
}
export const postData = ({ msg, setBookAdded, volumeid, controller, abr_setLoading, setAllBooksReadData, setABRvolId }) => { 
    let bookShelfID;
    let action;

    if(msg === "deleteBook_ABR_04"){
        action = 'removeVolume?';
        bookShelfID = '4';
        // ################
        abr_setLoading(true);
        // ################
    }
    else if(msg === "deleteBook_ReadingNow_03"){
        action = 'removeVolume?';
        bookShelfID = '3'
    }
    else if(msg === "to_add_to_ABR"){
        action = 'addVolume?';
        bookShelfID = '4';
    }
    else{
        console.log(msg)
    }


    const postPromise = new Promise(function(resolve, reject){
        controller.signal.addEventListener('abort', () => {
            reject([])
        });
        const request = window.gapi.client.request({
            'method': 'POST',
            'path': `books/v1/mylibrary/bookshelves/${bookShelfID}/${action}volumeId=${volumeid}`,
        });
        // // Execute the API request.
        request.execute( function(response) {
            const obj = response;
            resolve(obj);
            reject("Error");
        });
    });
    
    postPromise.then(
        function(result){
            console.log(result);
            
            if(msg === "to_add_to_ABR"){
                setBookAdded(true);
            }

            //RE-FETCH ABR
            let props = {
                msg: "userFetch",
                controller: controller,
                setAllBooksReadData: setAllBooksReadData,
                setABRvolId: setABRvolId
            }
            getData(props);                
        },
        function(error){
            console.log(error)
        }
    );
}