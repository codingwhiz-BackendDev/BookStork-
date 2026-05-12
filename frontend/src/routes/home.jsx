import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  viewBooks,
  createBook as createBookAPI,
  deleteBook as deleteBookAPI,
  editBook as editBookAPI,
  isAuthenticated as isAuthenticatedAPI,
} from "../endpoints/api";

import '../App.css'

function App() {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [year_released, setYearReleased] = useState(0)
  const [message, setMessage] = useState({ text: "", type: "" });

  // 1. Fetch books
  const fetchBooks = async () => {
    // If not logged in, just don't fetch (silent fail)
    if (!isAuthenticatedAPI()) return;

    try {
      const data = await viewBooks();
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  // 2. Add books
  const addBooks = async () => {
    // Security check: Show a message instead of crashing
    if (!isAuthenticatedAPI()) {
      setMessage({ text: "Please login to add books!", type: "error" });
      return;
    }

    const bookData = { title, author, year_released };

    try {
      const data = await createBookAPI(bookData);
      setBooks((prev) => [...prev, data]);
      setTitle("");
      setAuthor("");
      setYearReleased(0);
      setMessage({ text: "Book added successfully!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (err) {
      setMessage({ text: "Failed to add book.", type: "error" });
    }
  };

  // 3. Delete books
  const deleteBook = async (pk) => {
    try {
      await deleteBookAPI(pk);
      setBooks((prev) => prev.filter((book) => book.id !== pk));
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Edit books
  const editBook = async (pk, newTitle) => {
    if (!newTitle) return;
    try {
      const data = await editBookAPI(pk, { title: newTitle });
      setBooks((prev) => prev.map((book) => (book.id === pk ? data : book)));
      document.getElementById(`input-${pk}`).value = "";
    } catch (err) {
      setMessage({ text: "Unauthorized action.", type: "error" });
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // JSX RETURN BLOCK
  return (
    <div className="app">
      <div className="glass-card">
        <h1 className="title">📚 My Library</h1>

        {message.text && (
          <div className={`message-banner ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="form-grid">
          <input 
            type="text" 
            value={title} 
            placeholder="Book title" 
            onChange={(e) => setTitle(e.target.value)} 
          />
          <input 
            type="text" 
            value={author} 
            placeholder="Author" 
            onChange={(e) => setAuthor(e.target.value)} 
          />
          <input 
            type="number" 
            value={year_released} 
            placeholder="Release year" 
            onChange={(e) => setYearReleased(e.target.value)} 
          />
          <button onClick={addBooks} className="primary-btn">Add Book</button>
        </div>

        <div className="books-container">
          {books.length > 0 ? (
            books.map((book) => (
              <div className="books" key={book.id}>
                <div className="book-card">
                  <div className="book-details">
                    <h3>{book.title}</h3>
                    <p>{book.author} • {book.year_released}</p>
                  </div>

                  <div className="book-actions">
                    <input type="text" placeholder="New Title" id={`input-${book.id}`} />
                    <button 
                      onClick={() => {
                        const newTitle = document.getElementById(`input-${book.id}`).value;
                        editBook(book.id, newTitle);
                      }}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button onClick={() => deleteBook(book.id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </div>
                <br />
              </div>
            ))
          ) : (
            <p style={{textAlign: 'center', marginTop: '20px'}}>
              {isAuthenticatedAPI() ? "No books found." : "Please login to see your books."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} // Closing brace for the App function

export default App;