import { useEffect, useState } from "react";
import { getData } from "../../Data/get_set_Data";
import Display_ABR_Content from "./Display_ABR_Content";

export default function User({ arb_loading, abr_setLoading, all_books_read_data, setAllBooksReadData, setABRvolId, onCollapsibleClick }){
    // console.log("User rendered");

    var controller = new AbortController();

    useEffect(() => {
    
        if(all_books_read_data.length === 0){
          /**
           * covers initial state and abort controller
           */
          console.log("nothing in all_books_read_data so GET DATA...");
          
          let props = {
            msg: "userFetch",
            controller: controller,
            setAllBooksReadData: setAllBooksReadData,
            setABRvolId: setABRvolId

          }
          getData(props);
    
          //totalItems = total number of books.
        }else if(all_books_read_data.totalItems === 0){
          /**
           * should cover no books
           */
          console.log("no books");
    
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

    return arb_loading === true ? (
    
        <div className="container">
          <h1>Welcome</h1>
          <p>Loading...</p>
        </div>
    
      ) :
      (
        <div className="container">
          <h1>Welcome</h1>
          {
            all_books_read_data.totalItems === 0 ? <p>no books</p> 
            : <Display_ABR_Content 
                all_books_read_data={all_books_read_data}
                onCollapsibleClick={onCollapsibleClick}
                controller={controller}
                abr_setLoading={abr_setLoading}
                setAllBooksReadData={setAllBooksReadData}
                setABRvolId={setABRvolId}
              />
          }
          
        </div>
        
      ) 
}