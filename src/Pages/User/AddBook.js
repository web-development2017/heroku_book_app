import { useEffect, useState } from "react";
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

    let isbn;
    var controller = new AbortController();
    
    function HandleISBNSubmit(e){
        e.preventDefault();
        isbn = '';
        isbn = document.getElementById("ISBN").value;
        setLoading(true);
        setBookAlreadyInCollection(false);
    }

    useEffect(() =>{

        return () =>{            
            //ABORT FETCH
            // https://stackoverflow.com/questions/30233302/promise-is-it-possible-to-force-cancel-a-promise
            
            setBookFoundData([]);
            setLoading(false);
            
            // let abort = {"abort": true};
            
            // GetBookToAddData({ abort })
            controller.abort();
            
        }
    }, []);

    return (
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
    )
}