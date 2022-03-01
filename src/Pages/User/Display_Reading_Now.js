import {Link} from 'react-router-dom';
import { postData } from '../../Data/get_set_Data';

export default function Display_Reading_Now({ reading_now_data, setReadingNowData, onCollapsibleClick, controller }){

    console.log('%c render' , 'color: red');

    function Books(props) {

        function deleteReadingNowBookFn(volumeid){

            setReadingNowData([]);
            let props = {
                msg: "deleteBook_ReadingNow_03",
                volumeid: volumeid,
                controller: controller,
                setReadingNowData: setReadingNowData,
                // setABRvolId: setABRvolId,
                // abr_setLoading: abr_setLoading

            }
            postData(props);
        }
        
        return <>
            <div className="foo">
            <h5 className="header">{props.title} <a onClick={() => {deleteReadingNowBookFn(props.id)}} title="delete" className="addBookReadDelete right" to="/deleteBook" ><i className="material-icons red-text">delete</i></a> </h5>
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

    return reading_now_data[0]?.totalItems === 0 ? (
        <ul className="col s12 m12 l6">
            <li>

                <div className="collapsible-header">
                    <i className="material-icons">book</i>
                    {reading_now_data[0]?.totalItems} Books Reading Now
                    <Link title="add books" id="addBookRead" to={{pathname: "/addBook", state:{collection: "Reading Now"}}}><i className="material-icons">add</i></Link>                                
                </div>

                <div className="collapsible-body">
                    
                </div>
            </li>
        </ul>
    )
    :(
        <ul className="collapsible col s12 m12 l6" id="collapsible" onClick={onCollapsibleClick}>
            <li>

                <div className="collapsible-header">
                    <i className="material-icons">book</i>
                    {reading_now_data[0]?.totalItems} Books Reading Now
                    <Link title="add books" id="addBookRead" to={{pathname: "/addBook", state:{collection: "Reading Now"}}}><i className="material-icons">add</i></Link>                                
                </div>

                <div className="collapsible-body">
                    
                    {reading_now_data.map(book => 
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