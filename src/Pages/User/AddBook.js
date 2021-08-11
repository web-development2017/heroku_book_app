import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { postData } from "../../Data/get_set_Data";
import { sortData } from "../../Utils/SortData";

export default function AddBook({ abr_setLoading, abr_already_in_collection_volumeid, setAllBooksReadData, setABRvolId }){
    
    console.log('%c render' , 'color: red');

    const location = useLocation();
    
    /* ################################
    Used in DisplayBook.js
    STATES:
    No message for intial state
    Book found and IS in collection
    Book found and NOT in collection
    Book Not Found
    Loading
    ################################ */

    //**add_abr_setLoading** 
    // set FALSE IF fetchData returns a value.totalItems <= 0
    // set FALSE IF abr_toadd_data.length > 0
    const [add_abr_loading, add_abr_setLoading] = useState(false);

    //**setBookFoundData** -> Utils/sortData **WHERE IT IS SET**
    // SET with value returned from fetchData if value.totalItems <= 0
    // set with EMPTY ARRAY when CANCEL BTN CLICKED + ON UNMOUNT
    const [abr_toadd_data, setBookFoundData] = useState([]);

    // **setBookAlreadyInCollection** set FALE HandleISBNSubmit clicked
    // set TRUE when already in collection
    // set FALSE when CANCEL BTN CLICKED
    const [book_already_in_collection, setBookAlreadyInCollection] = useState(false);

    // **setBookAdded** -> Data/get_set_Data/postData **WHERE IT IS SET TRUE**
    const [book_added, setBookAdded] = useState(false);

    useEffect(()=>{
        console.log(book_already_in_collection)
    },[book_already_in_collection]);

    useEffect(()=>{
        if(abr_toadd_data.length > 0){
            add_abr_setLoading(false);
        }
    },[abr_toadd_data]);

    useEffect(()=>{
        console.log(book_added);
    },[book_added]);


    let isbn;
    var controller = new AbortController();
    var signal = controller.signal;

    //#region GET BOOK DETAILS
    function HandleISBNSubmit(e){
        e.preventDefault();
        isbn = '';
        isbn = document.getElementById("ISBN").value.trim();
        let stripped_isbn = isbn.replaceAll(' ','');
        //#########################
        add_abr_setLoading(true);
        //#########################
        setBookAlreadyInCollection(false);
        setBookAdded(false);

        //CHECK IF BOOK IS ALREADY IN COLLECTION
        function isInCollection(value){
            // console.log(`%c ${value}`, 'color:red');

            let foundBookId = value.items[0].id;
            const already_in_collection_match = abr_already_in_collection_volumeid.find(element => element === foundBookId);
            if(already_in_collection_match){
                //#########################
                add_abr_setLoading(false);
                //#########################
                setBookAlreadyInCollection(true);
               
            }else{
                // //#########################
                // add_abr_setLoading(true);
                // //#########################
                console.log("not in collection")
                let props = {
                    msg: "sortBookToAddToABR",
                    value: value,
                    setBookFoundData: setBookFoundData
                }
                sortData(props)
            }
        }
        
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
            if(value.totalItems > 0){
                isInCollection(value);
            }else{
                console.log('google books couldn\'t find the book with that isbn');
                setBookFoundData(value);
                //######################### 
                add_abr_setLoading(false);
                //#########################
            }   
        }).catch((error) => {
            console.log(error)
        });   
    }
    //#endregion GET BOOK DETAILS

    function selectedBookToAdd(volumeid){
        // console.log("%c clicked", "color:green")
        let props = {
            msg: "to_add_to_ABR",
            volumeid: volumeid,
            setBookAdded: setBookAdded,
            controller: controller,
            setAllBooksReadData: setAllBooksReadData,
            setABRvolId: setABRvolId,
            abr_setLoading: abr_setLoading
        }
        postData(props);
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
    
    useEffect(() =>{
        
        console.log(location.state);

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
            <h1>Add Book</h1>

            <form id="myForm" onSubmit={(e) => {HandleISBNSubmit(e)}}>
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
            abr_toadd_data.length === 1 ?
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
            <div className="container">
                <p>No Book Found</p>
            </div>
            
        }
        
        </>
    )
}