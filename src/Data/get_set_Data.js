import { sortData } from "../Utils/SortData";
export const getData = ({ msg, setAllBooksReadData, controller, setABRvolId })=>{
    let url;
    msg === "userFetch" ? url = 'books/v1/mylibrary/bookshelves/4/volumes?fields=totalItems, items(id, volumeInfo/title, volumeInfo/authors, volumeInfo/publishedDate, volumeInfo/industryIdentifiers, volumeInfo/imageLinks)'
    :
    console.log(msg)

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
        // console.log(value);
        if(value.totalItems > 0){
            // INITIAL REQUEST FOR DATA AND RE-FETCH
            if(msg === "userFetch"){
                let props = {
                msg: "sort_ABR_Data_User",
                value: value,
                setAllBooksReadData: setAllBooksReadData,
                setABRvolId: setABRvolId
                }
                sortData(props);
            }
            else{console.log(msg);}
            
          }else{
            setAllBooksReadData(value);
          }
        
    }).catch((error)=>{
        console.log(error)//error shows an empty array when controller abort called
    });

}
export const postData = ({ msg, setBookAdded, volumeid, controller, abr_isLoading, setAllBooksReadData, setABRvolId}) => { 
    let bookShelfID;
    let action;

    if(msg === "deleteBook_ABR_04"){
        action = 'removeVolume?';
        bookShelfID = '4';
        // ################
        abr_isLoading(true);
        // ################
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
            msg === "to_add_to_ABR" ? setBookAdded(true) : console.log(msg)
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