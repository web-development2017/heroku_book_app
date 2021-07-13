import { sortData } from "../Utils/SortData";
export const fetchData = ({ msg, setAllBooksReadData, controller, isLoading, setABRvolId })=>{
    let url;
    // let method;
    msg === "userFetch" ? url = 'books/v1/mylibrary/bookshelves/4/volumes?fields=totalItems, items(id, volumeInfo/title, volumeInfo/authors, volumeInfo/publishedDate, volumeInfo/industryIdentifiers, volumeInfo/imageLinks)'
    :
    // msg === "to_add_to_ABR" ? url = `books/v1/mylibrary/bookshelves/4/addVolume?volumeId=${volumeid}`
    // :
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
        console.log(value);
        if(value.totalItems > 0){
            // INITIAL REQUEST FOR DATA
            if(msg === "userFetch"){
                let props = {
                msg: "sort_ABR_Data_User",
                value: value,
                setAllBooksReadData: setAllBooksReadData,
                isLoading: isLoading,
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
export const postData = ({msg, setBookAdded, volumeid, controller, isLoading, setAllBooksReadData, setABRvolId}) => { 
    const postPromise = new Promise(function(resolve, reject){
        controller.signal.addEventListener('abort', () => {
            reject([])
        });
        const request = window.gapi.client.request({
            'method': 'POST',
            'path': `books/v1/mylibrary/bookshelves/4/addVolume?volumeId=${volumeid}`,
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
            setBookAdded(true);
            //RE-FETCH ABR
            let props = {
                msg: "userFetch",
                controller: controller,
                setAllBooksReadData: setAllBooksReadData,
                setABRvolId: setABRvolId,
                isLoading: isLoading

            }
            fetchData(props);                
        },
        function(error){
            console.log(error)
        }
    );
}