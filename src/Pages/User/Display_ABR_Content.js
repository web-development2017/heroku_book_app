import {Link} from 'react-router-dom';
import '../../css/dply_abr_content.css';
import { postData } from '../../Data/get_set_Data';

export default function DisplayAbrContent({ abr_setLoading, all_books_read_data, onCollapsibleClick, controller, setAllBooksReadData, setABRvolId }){
    
    console.log('%c render' , 'color: red');

    function Books(props) {

        function deleteBookFn(volumeid){

            setAllBooksReadData([]);
            let props = {
                msg: "deleteBook_ABR_04",
                volumeid: volumeid,
                controller: controller,
                setAllBooksReadData: setAllBooksReadData,
                setABRvolId: setABRvolId,
                abr_setLoading: abr_setLoading

            }
            postData(props);
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
        //HAVE READ COLLECTION
        <ul className="collapsible col s12 m12 l6" id="collapsible" onClick={onCollapsibleClick}>
            <li>

                <div className="collapsible-header">
                    <i className="material-icons">book</i>
                    {all_books_read_data[0]?.totalItems} Book{all_books_read_data[0]?.totalItems === 1 ? " " : "s"} Read
                    {/* state is passed through to AddBook.js in the useEffect hook
                    why? so can keep track of collection type ie have read, to read, reading now etc
                     */}
                    <Link title="add books" id="addBookRead" to={{pathname: "/addBook", state:{collection: "Have Read"}}}><i className="material-icons">add</i></Link>                                
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