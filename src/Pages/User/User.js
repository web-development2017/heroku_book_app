import { useEffect } from "react";
import { Link } from 'react-router-dom';
import { getData } from "../../Data/get_set_Data";
import DisplayAbrContent from "./Display_ABR_Content";

import '../../css/home.css';
import Display_Reading_Now from "./Display_Reading_Now";
import { sortData } from "../../Utils/SortData";

function books_read({ controller, setAllBooksReadData, setABRvolId }){
  let url = 'books/v1/mylibrary/bookshelves/4/volumes?fields=totalItems, items(id, volumeInfo/title, volumeInfo/authors, volumeInfo/publishedDate, volumeInfo/publisher, volumeInfo/industryIdentifiers, volumeInfo/imageLinks)';
  // #4 Store Volume Id
  function store_volumeId({returned_sorted_data}){
    setABRvolId(returned_sorted_data.map(book =>book.id))
  }
  // #3 Store Data
  function store_sorted_data({returned_sorted_data}){
    setAllBooksReadData(returned_sorted_data);
  }
  // #2 Sort Data
  function sorted_data_callback(value){
    if(value.totalItems === 0){
      console.log("no books in collection")
    }else{
      console.log("books in All Books Read collection")
      let returned_sorted_data = sortData({value: value})
      store_sorted_data({returned_sorted_data: returned_sorted_data})
      store_volumeId({returned_sorted_data: returned_sorted_data})

    }
  }
  // #1 Get Data
  getData({url: url, controller: controller}, sorted_data_callback);
  
}

function reading_now({ controller, setReadingNowData, setRNDvolId }){
  // getData({msg: "getReadingNow", controller: controller, setReadingNowData: setReadingNowData})

  let url = 'books/v1/mylibrary/bookshelves/3/volumes?fields=totalItems, items(id, volumeInfo/title, volumeInfo/authors, volumeInfo/publishedDate, volumeInfo/publisher, volumeInfo/industryIdentifiers, volumeInfo/imageLinks)';

  // #4 Store Volume Id
  function store_volumeId({returned_sorted_data}){
    setRNDvolId(returned_sorted_data.map(book =>book.id));
    // returned_sorted_data.map(book => console.log(book.id))
  }
  // #3 Store Data
  function store_sorted_data({returned_sorted_data}){
    setReadingNowData(returned_sorted_data);
  }
  // #2 Sort Data
  function sorted_data_callback(value){
    if(value.totalItems === 0){
      console.log("no books in Reading Now collection")
    }else{
      console.log("books in Reading Now collection");
      let returned_sorted_data = sortData({value: value});
      store_sorted_data({returned_sorted_data: returned_sorted_data});
      store_volumeId({returned_sorted_data: returned_sorted_data});
    }
  }
  // #1 Get Data
  getData({url: url, controller: controller}, sorted_data_callback);
}

function initGetBooksData({ controller, all_books_read_data, reading_now_data, setAllBooksReadData, setReadingNowData, setABRvolId, setRNDvolId }){
  let arrayofcollections = [all_books_read_data, reading_now_data]

  arrayofcollections.forEach((array) => {

    if (array.length === 0) {
      // Nothing in array so need to get the data
      arrayofcollections.indexOf(array) === 0 ?
        // 0 is "books read" collection
        books_read({ controller: controller, setAllBooksReadData: setAllBooksReadData, setABRvolId: setABRvolId })
        
      : 
      arrayofcollections.indexOf(array) === 1 ? 
    
        reading_now({ controller: controller, setReadingNowData: setReadingNowData, setRNDvolId: setRNDvolId })
      : 
      console.log("Shouln't get a message here")

    } 
    else if (array[0]?.totalItems === 0) {
      console.log("no books");
    }
    else if(array.length > 0){
      console.log("Already have data");
    }
    else{console.log("This message should never display")}
  });
}

export default function User(
  { 
    arb_loading,
    abr_setLoading,
    all_books_read_data,
    setAllBooksReadData,
    reading_now_data,
    setReadingNowData,
    setABRvolId,
    setRNDvolId,
    onCollapsibleClick 
  }
){

  console.log('%c render' , 'color: red');

  var controller = new AbortController();

  

  useEffect(() => {
    //Initial Request For All Books In All Collections
    initGetBooksData({
      controller: controller,
      all_books_read_data: all_books_read_data,
      reading_now_data: reading_now_data,
      setAllBooksReadData: setAllBooksReadData,
      setReadingNowData: setReadingNowData,
      setABRvolId: setABRvolId,
      setRNDvolId: setRNDvolId
    });
    
    return () =>{      
      controller.abort();    
    }
  }, []);

  return arb_loading === true ? (
  
    <div className="container">
      <h1>Welcome</h1>
      <p>Loading...</p>
    </div>

  ) :
  (
    <div className="container">
      <h1 className="paddingToMatchCard">Welcome</h1>
      {
        //##############################################
        // BRAND NEW USER WITH NOTHING IN ANY COLLECTION
        //##############################################
        all_books_read_data.totalItems === 0 && reading_now_data.totalItems === 0 ? 
          // <div><p>no books</p><Link title="add books" id="addBookRead" to="/addBook">Add Book</Link></div> 
          <div className="row">
            <div className="col s12 m6">
                <div className="card">
                    <div className="card-content">
                      <h4>No books in collection</h4>
                      <p>To start adding books to your collection <Link title="add books" id="addBookRead" to="/addBook">Click Here</Link></p>
                    </div>
                    <div className="card-action">
                      <Link title="add books" id="addBookRead" to="/addBook">Add Books</Link>
                    </div>
                </div>
            </div>
          </div>
        : <>
            <DisplayAbrContent 
              all_books_read_data={all_books_read_data}
              onCollapsibleClick={onCollapsibleClick}
              controller={controller}
              abr_setLoading={abr_setLoading}
              setAllBooksReadData={setAllBooksReadData}
              setABRvolId={setABRvolId}
            />
            <Display_Reading_Now 
              reading_now_data={ reading_now_data }
              onCollapsibleClick={ onCollapsibleClick }
              setReadingNowData={setReadingNowData}
              controller={controller}
            />
          </>
      }
      
    </div>    
  )
     
}