import { useEffect, useState } from "react";
import Display_ABR_Content from "./Display_ABR_Content";
const sortData = ({ value, all_books_read_data, setAllBooksReadData, isLoading, setABRvolId }) =>{
    
    if(value.totalItems > 0){
        let abr_data = value.items;

        console.log("put data in array");
        let books_array = [];

        setAllBooksReadData(books_array);

        //the resonse from Google Books needs to be sorted because
        //there is two different ISBN numbers and they are not
        //always returned in the same order - isbn_13 could be the first index 
        //or second index of the "industryIdentifiers" array.
        abr_data.forEach(book => {
            let obj0 = {
                isbn_13: book.volumeInfo.industryIdentifiers[0].identifier,
                title: book.volumeInfo.title,
                authors: book.volumeInfo.authors,
                published: book.volumeInfo.publishedDate,
                publisher: book.volumeInfo.publisher,
                imageLinks: book.volumeInfo.imageLinks.thumbnail,
                id: book.id
            }
            let obj1 = {
                isbn_13: book.volumeInfo.industryIdentifiers[1].identifier,
                title: book.volumeInfo.title,
                authors: book.volumeInfo.authors,
                published: book.volumeInfo.publishedDate,
                publisher: book.volumeInfo.publisher,
                imageLinks: book.volumeInfo.imageLinks.thumbnail,
                id: book.id

            }
            book.volumeInfo.industryIdentifiers[0].type === "ISBN_13" ? books_array.push(obj0) :
            book.volumeInfo.industryIdentifiers[1].type === "ISBN_13" ? books_array.push(obj1) :
            console.log("no ISBN_!3");
        });
        isLoading(false);
                
        setABRvolId(abr_data.map(book =>book.id));
    }else{

      //No books
      console.log(value)//{kind: "books#volumes", totalItems: 0}
      setAllBooksReadData(value);
      isLoading(false);
    }
}

const fetch_abr_data = ({ all_books_read_data, setAllBooksReadData, controller, isLoading, setABRvolId })=>{
    
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
        // console.log(value.items);
        // let abr_data = value.items;
        // setAllBooksReadData(abr_data);
        // isLoading(false);
        sortData({ value, all_books_read_data, setAllBooksReadData, isLoading, setABRvolId });  
    }).catch((error)=>{
        console.log(error)//error shows an empty array when controller abort called
    });

}

export default function User({ all_books_read_data, setAllBooksReadData, isLoading, loading, setABRvolId, onCollapsibleClick }){
    console.log("User rendered");
    
    var controller = new AbortController();

    useEffect(() => {
    
        if(all_books_read_data.length === 0){
          /**
           * covers initial state and abort controller
           */
          console.log("nothing in all_books_read_data");

          isLoading(true);
          fetch_abr_data({ all_books_read_data, setAllBooksReadData, controller, isLoading, setABRvolId });
    
          //totalItems = total number of books.
        }else if(all_books_read_data.totalItems === 0){
          /**
           * should cover no books state
           */
          console.log("no books");
        //   console.log(all_books_read_data);
    
        }else if(all_books_read_data.length > 0){
          console.log("already have data");
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
              />
          }
          
        </div>
        
      ) 
}