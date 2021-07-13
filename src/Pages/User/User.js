import { useEffect, useState } from "react";
import { fetchData } from "../../Data/fetchData";
import { sortData } from "../../Utils/SortData";
import Display_ABR_Content from "./Display_ABR_Content";

//#region fetch_abr_data
const fetch_abr_data = ({ setAllBooksReadData, controller, isLoading, setABRvolId })=>{
    
  const fetchData = new Promise(function(resolve, reject){
    controller.signal.addEventListener('abort', () => {
        reject([])
    });
    const request = window.gapi.client.request({
      'method': 'GET',
      'path': 'books/v1/mylibrary/bookshelves/4/volumes?fields=totalItems, items(id, volumeInfo/title, volumeInfo/authors, volumeInfo/publishedDate, volumeInfo/industryIdentifiers, volumeInfo/imageLinks)'
    });

    // // Execute the API request.
    request.execute( function(response) {
      // const obj = response.result;
      resolve(response);
      
      reject("Error");          

    });   
  });

  fetchData.then((value)=>{
      if(value.totalItems > 0){
        // sortData({ value, all_books_read_data, setAllBooksReadData, isLoading, setABRvolId });
        let props = {
          msg: "sort_ABR_Data_User",
          value: value,
          setAllBooksReadData: setAllBooksReadData,
          isLoading: isLoading,
          setABRvolId: setABRvolId
        }
        sortData(props);
      }else{
        setAllBooksReadData(value);
      }
      
  }).catch((error)=>{
      console.log(error)//error shows an empty array when controller abort called
  });
}
//#endregion

export default function User({ loading, isLoading, all_books_read_data, setAllBooksReadData, setABRvolId, onCollapsibleClick }){
    console.log("User rendered");

    var controller = new AbortController();

    useEffect(() => {
    
        if(all_books_read_data.length === 0){
          /**
           * covers initial state and abort controller
           */
          console.log("nothing in all_books_read_data");

          isLoading(true);
          // fetch_abr_data({ setAllBooksReadData, controller, isLoading, setABRvolId });
          let props = {
            msg: "userFetch",
            controller: controller,
            setAllBooksReadData: setAllBooksReadData,
            isLoading: isLoading,
            setABRvolId: setABRvolId

          }
          fetchData(props);
    
          //totalItems = total number of books.
        }else if(all_books_read_data.totalItems === 0){
          /**
           * should cover no books state
           */
          console.log("no books");
        //   console.log(all_books_read_data);
    
        }else if(all_books_read_data.length > 0){
          console.log("already have data");
          // isLoading(false);
        }
        else{
          console.log("this message should never display. Error in User.js file - in useEffect if else branching");
        }
    
        return () =>{
          //Cause promise to reject with an empty array on UNMOUNT
          //Test:
          //1. Refresh browser 
          //2. F12 in browser
          //3. Network tab set to SLOW 3G
          //4. Click console tab
          //5. Sign In
          //6. Click About on Navbar.
          //7. Click Home
          //8. Loading... is displayed while data is being fetched as it was previously aborted on UNMOUNT
          //Although, in the Network tab the data has still been fetched and returned 
          //but at least the Promised was rejected.
          
          controller.abort();    
        }
    }, []);

    return loading ? (
    
        <div className="container">
          <h1>Welcome</h1>
          <p>Loading...</p>
        </div>
    
      ) :
      (
        <div className="container">
          <h1>Welcome</h1>
          {/* {all_books_read_data.totalItems === 0 ? <p>no books</p> : <ul>{all_books_read_data.map(books => <li key={books.id}>{books.title}</li>)}</ul>} */}
          {
            all_books_read_data.totalItems === 0 ? 
              <p>no books</p> : 
              <Display_ABR_Content 
                all_books_read_data={all_books_read_data}
                onCollapsibleClick={onCollapsibleClick}
                controller={controller}
                setAllBooksReadData={setAllBooksReadData}
                setABRvolId={setABRvolId}

              />
          }
          
        </div>
        
      ) 
}