import {Link} from 'react-router-dom';
import '../../css/dply_abr_content.css';
import { sortData } from '../../Utils/SortData';

const fetch_abr_data = ({ controller, setAllBooksReadData, setABRvolId })=>{

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
        // console.log(value);
        if(value.totalItems > 0){
            let props = {
                msg: "reFetchABRData",
                value: value,
                setAllBooksReadData: setAllBooksReadData,
                setABRvolId: setABRvolId

            }
            // sortData(props);
            sortData(props)
        }else{sortData(value);}
        
        
    }).catch((error)=>{
        console.log(error)//error shows an empty array when controller abort called
    });

}

export default function Display_ABR_Content({ all_books_read_data, onCollapsibleClick, controller, setAllBooksReadData, setABRvolId }){
    

    function Books(props) {

        function deleteBookFn(volumeid){

            setAllBooksReadData([]);

            const deleteSelectedbookPromise = new Promise(function(resolve, reject){
                const request = window.gapi.client.request({
                    'method': 'POST',
                    'path': `books/v1/mylibrary/bookshelves/4/removeVolume?volumeId=${volumeid}`,
                });
                // // Execute the API request.
                request.execute( function(response) {
                    const obj = response;
                    resolve(obj);
                    reject("Error");
                });
            });
            
            deleteSelectedbookPromise.then(
                function(result){
                    console.log(result)
                    fetch_abr_data({ controller, setAllBooksReadData, setABRvolId })
                                   
                },
                function(error){
                    console.log(error)
                }
            );
        }
        return <>
            <div className="foo">
            <h5 className="header">{props.title} <a onClick={() => {deleteBookFn(props.id)}} title="delete" className="addBookReadDelete right" to="/deleteBook" ><i className="material-icons red-text">delete</i></a> </h5>
            </div>
            
            <div className="card horizontal">
                <div className="card-image">
                    <img alt="book cover" src={props.image} />
                </div>

                <div className="card-stacked">
                    <div className="card-content">
                        <ul>
                        <li>Title: {props.title}</li>
                        <li>Author: {props.authors}.</li>
                        <li>Published: {props.published}</li>
                        <li>Publisher: {props.publisher}</li>
                        <li>ISBN: {props.isbn}</li>
                        </ul>
                       
                    </div>
                </div>
            </div>
        </>          
    }

    return (
        
        <ul className="collapsible col s12 m12 l6" id="collapsible" onClick={onCollapsibleClick}>
            <li className="active">

                <div className="collapsible-header">
                    <i className="material-icons">book</i>
                    Books Read
                    <Link title="add books"id="addBookRead" to="/addBook" ><i className="material-icons">add</i></Link>                                
                </div>

                <div className="collapsible-body">
                    
                    {all_books_read_data.map(book => 
                    <Books
                    image={book.imageLinks}
                    title={book.title}
                    authors={book.authors}
                    published={book.published}
                    publisher={book.publisher}
                    isbn={book.isbn_13}
                    id={book.id}
                    key={book.id} 
                    />)}
                    
                </div>                    
            </li>
        </ul>
    )
    
}