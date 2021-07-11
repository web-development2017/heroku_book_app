export const sortData = ({ msg, value, setBookFoundData, setLoading }) => {
    
    console.log(value);
    let dataToSort = value.items;

    console.log("put data in array");
    let books_array = [];

    msg === "getBookToAddToABR" ? setBookFoundData(books_array) :
    console.log(msg);
    // setAllBooksReadData(books_array);

    //the resonse from Google Books needs to be sorted because
    //there is two different ISBN numbers and they are not
    //always returned in the same order - isbn_13 could be the first index 
    //or second index of the "industryIdentifiers" array.
    dataToSort.forEach(book => {
        let obj0 = {
            totalItems: value.totalItems,
            isbn_13: book.volumeInfo.industryIdentifiers[0].identifier,
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors,
            published: book.volumeInfo.publishedDate,
            publisher: book.volumeInfo.publisher,
            imageLinks: book.volumeInfo.imageLinks.thumbnail,
            id: book.id
        }
        let obj1 = {
            totalItems: value.totalItems,
            isbn_13: book.volumeInfo.industryIdentifiers[1].identifier,
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors,
            published: book.volumeInfo.publishedDate,
            publisher: book.volumeInfo.publisher,
            imageLinks: book.volumeInfo.imageLinks.thumbnail,
            id: book.id

        }
        book.volumeInfo.industryIdentifiers[0].type === "ISBN_13" ? books_array.push(obj0) :
        book.volumeInfo.industryIdentifiers[1].type === "ISBN_13" ? books_array.push(obj1) :
        console.log("no ISBN_!3");
    });
    setLoading(false);
   
}