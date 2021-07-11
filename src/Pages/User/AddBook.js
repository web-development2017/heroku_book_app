import { useEffect, useState } from "react";
import { sortData } from "../../Utils/SortData";
export default function AddBook({ abr_already_in_collection_volumeid }){
    /* ################################
    Used in DisplayBook.js
    STATES:
    No message for intial state
    Book found and IS in collection
    Book found and NOT in collection
    Book Not Found
    Loading
    ################################ */
    const [loading, setLoading] = useState(false);
    const [bookfounddata, setBookFoundData] = useState([]);
    const [book_already_in_collection, setBookAlreadyInCollection] = useState(false);
    const [nomessage, setNoMessage] = useState(true);

    useEffect(() =>{
        console.log(book_already_in_collection)

    },[book_already_in_collection])

    useEffect(()=>{
        if(bookfounddata.length > 0){
            console.log(bookfounddata[0].isbn_13);
            console.log(bookfounddata[0].totalItems);
        }else{
            console.log(bookfounddata)
        }
        
    },[bookfounddata])

    let isbn;
    var controller = new AbortController();
    var signal = controller.signal;
    
    function HandleISBNSubmit(e){
        e.preventDefault();
        isbn = '';
        isbn = document.getElementById("ISBN").value;
        setLoading(true);
        setBookAlreadyInCollection(false);

        function isInCollection(value){
            console.log("here")
            let foundBookId = value.items[0].id;
            const already_in_collection_match = abr_already_in_collection_volumeid.find(element => element === foundBookId);
            if(already_in_collection_match){
                console.log(already_in_collection_match);
                setLoading(false);
                setBookAlreadyInCollection(true);
               
            }else{
                console.log("not in collection")
                let props = {
                    msg: "getBookToAddToABR",
                    value: value,
                    setBookFoundData: setBookFoundData,
                    setLoading: setLoading
                }
                sortData(props)
            }
        }

        // Function to do an Ajax call
        const getData = async () => {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&fields=totalItems,items(id,volumeInfo(title,authors,publisher,publishedDate,imageLinks/thumbnail,industryIdentifiers/type,industryIdentifiers/identifier))`, {signal}); // Generate the Response object
            if (response.ok) {
                const jsonValue = await response.json(); // Get JSON value from the response body
                return Promise.resolve(jsonValue);
            } else {
                return Promise.reject('getBooks rejected');
            }
        }
    
        // Call the function and output value or error message to console
        getData().then((value) =>{
            // console.log(value)
            if(value.totalItems > 0){
                // let props = {
                //     msg: "getBookToAddToABR",
                //     value: value,
                //     setBookFoundData: setBookFoundData,
                //     setLoading: setLoading
                // }
                // sortData(props)
                isInCollection(value);
            }else{
                console.log('google books couldn\'t find the book with that isbn');
                setBookFoundData(value);
                setLoading(false);
            }
            
        }).catch((error) => {
            console.log(error)
        });
         
    }

    function Books(props) {
        return <div>
            <h5 className="header">{props.title}</h5>
            <div className="card horizontal">
                <div className="card-image">
                    <img src={props.image} />
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
                        {/* <button onClick={selectedBookToAdd}>Add this book</button> */}

                        {/* {bookadded && <ADD_BOOK_MODAL onModalAgreeBtnClick={onModalAgreeBtnClick} title={props.title} setAllBooksReadData={setAllBooksReadData} setABRvolId={setABRvolId} />} */}
                    </div>
                </div>
            </div>
        </div> 
    }

    useEffect(() =>{

        return () =>{            
            //ABORT FETCH
            // https://stackoverflow.com/questions/30233302/promise-is-it-possible-to-force-cancel-a-promise
            
            setBookFoundData([]);
            setLoading(false);
            
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
                    required
                />
                <button>Find Book To Add</button>
            </form>

        </div>
        {
            loading ? 
                <div className="container"><p>Loading...</p></div>
            :
            bookfounddata.length === 0 &&  book_already_in_collection === false ?
            <p></p>
            :
            book_already_in_collection === true ?
            <div className="container"><p>Book Already In Collection</p></div>
            :
            bookfounddata.length > 0 ?
                
            
            <div className="container">            
                <ul className="col s12 m12 l6">
                    <li className="active">
                        <div>
                            <i className="material-icons">book</i>
                            Book Found
                        </div>

                        <div>
                            
                            <ul>
                                {bookfounddata.map(book => 
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