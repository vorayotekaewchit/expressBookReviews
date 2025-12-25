const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn], null, 4));
    } else {
        res.status(404).json({message: "Book not found"});
    }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let booksByAuthor = [];
    
    let bookKeys = Object.keys(books);
    
    bookKeys.forEach(key => {
        if (books[key].author === author) {
            booksByAuthor.push(books[key]);
        }
    });
    
    if (booksByAuthor.length > 0) {
        res.send(JSON.stringify(booksByAuthor, null, 4));
    } else {
        res.status(404).json({message: "No books found by this author"});
    }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let booksByTitle = [];
    
    let bookKeys = Object.keys(books);
    
    bookKeys.forEach(key => {
        if (books[key].title === title) {
            booksByTitle.push(books[key]);
        }
    });
    
    if (booksByTitle.length > 0) {
        res.send(JSON.stringify(booksByTitle, null, 4));
    } else {
        res.status(404).json({message: "No books found with this title"});
    }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        res.status(404).json({message: "Book not found"});
    }
});

// Task 10: Get all books using async callback
public_users.get('/async/books', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });
    
    getBooks.then((booksData) => {
        res.send(JSON.stringify(booksData, null, 4));
    }).catch((error) => {
        res.status(500).json({message: "Error fetching books"});
    });
});

// Task 11: Get book details based on ISBN using async
public_users.get('/async/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    const getBookByISBN = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject(new Error("Book not found"));
        }
    });
    
    getBookByISBN.then((book) => {
        res.send(JSON.stringify(book, null, 4));
    }).catch((error) => {
        res.status(404).json({message: error.message});
    });
});

// Task 12: Get book details based on author using async
public_users.get('/async/author/:author', function (req, res) {
    const author = req.params.author;
    
    const getBooksByAuthor = new Promise((resolve, reject) => {
        let booksByAuthor = [];
        let bookKeys = Object.keys(books);
        
        bookKeys.forEach(key => {
            if (books[key].author === author) {
                booksByAuthor.push(books[key]);
            }
        });
        
        if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
        } else {
            reject(new Error("No books found by this author"));
        }
    });
    
    getBooksByAuthor.then((authorBooks) => {
        res.send(JSON.stringify(authorBooks, null, 4));
    }).catch((error) => {
        res.status(404).json({message: error.message});
    });
});

// Task 13: Get book details based on title using async
public_users.get('/async/title/:title', function (req, res) {
    const title = req.params.title;
    
    const getBooksByTitle = new Promise((resolve, reject) => {
        let booksByTitle = [];
        let bookKeys = Object.keys(books);
        
        bookKeys.forEach(key => {
            if (books[key].title === title) {
                booksByTitle.push(books[key]);
            }
        });
        
        if (booksByTitle.length > 0) {
            resolve(booksByTitle);
        } else {
            reject(new Error("No books found with this title"));
        }
    });
    
    getBooksByTitle.then((titleBooks) => {
        res.send(JSON.stringify(titleBooks, null, 4));
    }).catch((error) => {
        res.status(404).json({message: error.message});
    });
});

module.exports.general = public_users;