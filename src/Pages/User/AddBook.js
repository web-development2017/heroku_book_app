import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { postData } from "../../Data/get_set_Data";
import { sortData } from "../../Utils/SortData";

function fetchDataFromISBN(stripped_isbn, callback, {signal}){
    
    // Function to do an Ajax call
    const fetchData = async () => {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${stripped_isbn}&fields=totalItems,items(id,volumeInfo(title,authors,publisher,publishedDate,imageLinks/thumbnail,industryIdentifiers/type,industryIdentifiers/identifier))`, {signal}); // Generate the Response object
        
        if (response.ok) {
            const jsonValue = await response.json(); // Get JSON value from the response body
            return Promise.resolve(jsonValue);
        } else {
            return Promise.reject('getBooks rejected');
        }
    }
    
    // Call the function and output value or error message to console
    fetchData().then((value) =>{
        callback(value)
    }).catch((error) => {
        console.log(error)
    });
        
}

function findBookToAdd(e, {signal, collection, abr_already_in_collection_volumeid, reading_now_data_already_in_collection_volumeid, setBookAlreadyInCollection, add_abr_setLoading, setBookFoundData}){
    e.preventDefault();
    let isbn;        
    isbn = '';
    isbn = document.getElementById("ISBN").value.trim();
    let stripped_isbn = isbn.replaceAll(' ','');
    // #####################
    add_abr_setLoading(true);
    setBookAlreadyInCollection(false);
    // #####################

    // #5
    function foo(returned_sorted_data){
        console.log(returned_sorted_data[0].totalItems);
        if(returned_sorted_data[0].totalItems === 1){
            setBookFoundData(returned_sorted_data)
        }
    } 

    // #4 Check if already in collection and if not send value to the sort data function
    function isInCollection(value){
        let foundBookId = value.items[0].id;
        let book_already_in_collection_volumeid;
        collection === "Reading Now" ? book_already_in_collection_volumeid = reading_now_data_already_in_collection_volumeid
        :
        collection === "Have Read" ? book_already_in_collection_volumeid = abr_already_in_collection_volumeid
        :
        console.log("bar")

        const already_in_collection_match = book_already_in_collection_volumeid.find(element => element === foundBookId);
        if(already_in_collection_match){
            setBookAlreadyInCollection(true);
            add_abr_setLoading(false);
        }else{
            console.log(`book not in ${collection} collection`);
            let returned_sorted_data = sortData({value: value})
            foo(returned_sorted_data);
        }
        
    }

    // #3 If book found Check if already in collection
    function xy(value){
        if(value.totalItems > 0){
            console.log("book found, check if in collection")
            isInCollection(value)
        }else{
            console.log("no book found")
            setBookFoundData([value]);
            //######################### 
            add_abr_setLoading(false);
            //#########################
        }  
    }

    // #2 
    function callback(value){
        xy(value);
    }
    // #1 Fetch Data
    fetchDataFromISBN(stripped_isbn, callback, {signal: signal});      
       
}

export default function AddBook({ abr_setLoading, abr_already_in_collection_volumeid, reading_now_data_already_in_collection_volumeid, setAllBooksReadData, setABRvolId }){
    
    console.log('%c render' , 'color: red');

    const location = useLocation();

    const [add_abr_loading, add_abr_setLoading] = useState(false);
    const [abr_toadd_data, setBookFoundData] = useState([]);
    const [book_already_in_collection, setBookAlreadyInCollection] = useState(false);
    const [book_added, setBookAdded] = useState(false);

    useEffect(()=>{
        console.log(book_already_in_collection)
    },[book_already_in_collection]);

    useEffect(()=>{
        console.log(abr_toadd_data)
        if(abr_toadd_data.length > 0){
            add_abr_setLoading(false);
        }
    },[abr_toadd_data]);

    useEffect(()=>{
        console.log(book_added);
    },[book_added]);
    
    var controller = new AbortController();
    var signal = controller.signal;

    function selectedBookToAdd(volumeid){
        // console.log("%c clicked", "color:green")
        let props = {
            // msg: "to_add_to_ABR",
            msg: collection,
            volumeid: volumeid,
            setBookAdded: setBookAdded,
            controller: controller,
            setAllBooksReadData: setAllBooksReadData,
            setABRvolId: setABRvolId,
            abr_setLoading: abr_setLoading
        }
        console.log(props.msg)
        // postData(props);
    }

    function Books(props) {
        return <div>
            <h5 className="header">{props.title}</h5>
            <div className="card horizontal">
                <div className="card-image">
                    <img src={props.image} alt={props.title}/>
                </div>
                <div className="card-stacked">
                    <div className="card-content">
                        <li>Title: {props.title}</li>
                        <li>Author: {props.authors}.</li>
                        <li>Published: {props.published}</li>
                        <li>Publisher: {props.publisher}</li>
                        <li>ISBN: {props.isbn_13}</li>
                    </div>
                    <div className="card-action">
                        {/* Add this book */}
                        {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                        AFTER CLICKING THE NAVBAR IS RENDERED FOR SOME REASON?????????????
                        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
                        <button onClick={() => {selectedBookToAdd(props.volumeId)}}>Add this book</button>
                        <button onClick={() => {setBookFoundData([]);setBookAlreadyInCollection(false);controller.abort();}}>Cancel</button>
                    </div>
                </div>
            </div>
        </div> 
    }
    
    const [collection, setcollection] = useState("")
    useEffect(()=>{
        console.log(collection)
    },[collection])

    useEffect(() =>{
        
        //name of collection passed through from Display_ABR_Content.js line 60
        console.log(location.state.collection);
        setcollection(location.state.collection)

        return () =>{            
            //ABORT FETCH
            // https://stackoverflow.com/questions/30233302/promise-is-it-possible-to-force-cancel-a-promise
            
            setBookFoundData([]);
            //#########################
            add_abr_setLoading(false);
            //#########################
            
            console.log("%c controller abort called", 'color: purple')
            controller.abort();
            
        }
    }, []);

    return (
        <>
        <div className="container">
            <h1>Add to {collection}</h1>

            <form id="myForm" onSubmit={(e) => {findBookToAdd(e,{signal:signal, collection: collection, abr_already_in_collection_volumeid: abr_already_in_collection_volumeid, reading_now_data_already_in_collection_volumeid: reading_now_data_already_in_collection_volumeid, setBookAlreadyInCollection: setBookAlreadyInCollection, add_abr_setLoading: add_abr_setLoading, setBookFoundData: setBookFoundData})}}>
                <label>ISBN</label>
                <input
                    id="ISBN"
                    type="text"
                    // pattern="[0-9]+"
                    required
                />
                <button>Find Book To Add</button>
            </form>

        </div>
        {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        SEEMS TO WORK BUT NEEDS A BETTER SOLUTION
        ANY SOLUTIONS WOULD BE VERY MUCH APPRECIATED
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  */}
        {
            add_abr_loading ? 
                <div className="container"><p>Loading...</p></div>
            :
            book_added === true ?
            <div className="container"><p>Book Added</p></div>
            :
            abr_toadd_data.length === 0 && book_already_in_collection === false ?
            <p></p>
            :
            book_already_in_collection === true ?
            <div className="container"><p>Book Already In Collection</p></div>
            :
            abr_toadd_data.length === 1  && abr_toadd_data[0].totalItems === 1?
            <div className="container">            
                <ul className="col s12 m12 l6">
                    <li className="active">
                        <div>
                            <i className="material-icons">book</i>
                            Book Found
                        </div>

                        <div>
                            
                            <ul>
                                {abr_toadd_data.map(book => 
                                <Books 
                                    image={ book.imageLinks }
                                    title={ book.title }
                                    authors={ book.authors }
                                    published={ book.publishedDate }
                                    publisher={ book.publisher }
                                    isbn_13={book.isbn_13}
                                    volumeId={ book.id }
                                    key={ book.id }
                                />)}
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
            :
            abr_toadd_data[0].totalItems === 0 ?
            <div className="container">
                <p>No Book Found</p>
            </div>
            :
            console.log("shouldn't get a message here")
            
        }
        
        </>
    )
}