import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [books, setBooks] = useState([])
  const [title, setTitle] = useState("")
  const [author, SetAuthor] = useState("")
  const [year_released, SetYear_released] = useState(0)


  // Fetch books
  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/")
      const data = await response.json()
      setBooks(data)
    } catch (err) {
      console.log(err)
    }
  }

  // Add books
  const addBooks = async () => {
    const bookData = {
      title: title,
      author: author,
      year_released: year_released
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/create/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData)

      });
      if (response.ok) {
        const data = await response.json();
        setBooks((prev) => ([...prev, data]));

        // Inside addBooks, after setBooks
        setTitle("");
        SetAuthor("");
        SetYear_released(0);
      } else {
        console.log('error creating book');
      }

    } catch (err) {
      console.log(err);
    }

  }


  // Delete books
  const deleteBook = async (pk) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/delete/${pk}/`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setBooks((prev) => prev.filter((book) => book.id != pk))
      } else {
        console.error("Failed to delete the book");
      }


    } catch (err) {
      console.log(err);
    }
  }
  // Edit books

  const editBook = async (pk, newTitle) => {
    if (!newTitle) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/edit_book/${pk}/`, {
        method: "PUT",
        headers: {
          'content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle }),
      });
      const data = await response.json()

      if (response.ok) {
        setBooks((prev) => prev.map((book) => (book.id == pk ? data : book)))
      }
    } catch (err) {
      console.log(err)
    }
  }



  useEffect(() => {
    fetchBooks();
  }, [])


  return (
    <div className="app">
      <div className="glass-card">
        <h1 className="title">📚 My Library</h1>

        <div className="form-grid">
          <input type="text" value={title} placeholder="Book title" onChange={(e) => setTitle(e.target.value)} />
          <input type="text" value={author} placeholder="Author" onChange={(e) => SetAuthor(e.target.value)} />
          <input type="number" value={year_released} placeholder="Release year" onChange={(e) => SetYear_released(e.target.value)} />

          <button onClick={addBooks} className="primary-btn">Add Book</button>
        </div>


        {books.map((book) => (
          <div className="books" key={book.id}>
            <div className="book-card" >
              <div className="book-details">
                <h3>{book.title}</h3>
                <p>{book.author} • {book.year_released}</p>
              </div>

              <div className="book-actions">
                <input type="text" placeholder="Change Title" id={`input-${book.id}`} />
                <button onClick={() => {
                  const newTitle = document.getElementById(`input-${book.id}`).value;
                  editBook(book.id, newTitle);
                }}
                  className="edit-btn">Edit</button>
                <button onClick={() => deleteBook(book.id)} className="delete-btn">Delete</button>
              </div>
            </div>

            <br />
          </div>
        ))}

      </div>
    </div>
  )
}

export default App
