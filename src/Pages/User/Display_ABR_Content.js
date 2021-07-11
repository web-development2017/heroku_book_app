import {Link} from 'react-router-dom';
import '../../css/dply_abr_content.css'
export default function Display_ABR_Content({ all_books_read_data, onCollapsibleClick }){
    function Books(props) {

        return <>
            <div className="foo">
            <h5 className="header">{props.title} <Link title="delete" className="addBookReadDelete right" to="/deleteBook" ><i className="material-icons red-text">delete</i></Link> </h5>
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