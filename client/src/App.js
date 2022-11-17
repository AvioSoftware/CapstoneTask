import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [filterSelection, setFilterSelection] = useState("All");
  let [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = () => {
      if (filterSelection === "All") {
        fetch("http://localhost:5000/books").then((response) => {
          response.json().then((result) => {
            setBooks(result.result);
          });
        });
      } else {
        fetch("http://localhost:5000/books", {
          method: "POST",
          body: JSON.stringify({
            status: filterSelection === "CheckedOut",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          response.json().then((result) => {
            setBooks(result.result);
          });
        });
      }
    };

    fetchBooks();
  }, [filterSelection]);

  const handleFilterSelection = (event) => {
    setFilterSelection(event.target.value);
  };

  const handleCheckOut = (bookId) => {
    fetch("http://localhost:5000/books/checkOut/" + bookId, {
      method: "POST",
      body: JSON.stringify({
        checkedOutBy: books.filter((book) => book.id === bookId).at(0)
          .checkedOutBy,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      window.location.reload();
    });
  };

  const handleCheckIn = (bookId) => {
    fetch("http://localhost:5000/books/checkIn/" + bookId, {
      method: "POST",
    }).then(() => {
      window.location.reload();
    });
  };

  const handleChangeCheckedOutBy = (e, bookId) => {
    books.filter((book) => book.id === bookId).at(0).checkedOutBy =
      e.target.value;
  };

  return (
    <div className="App">
      <div className="select-filter-option">
        Show:{" "}
        <select onChange={handleFilterSelection} value={filterSelection}>
          <option value="All">All</option>
          <option value="CheckedOut">CheckedOut</option>
          <option value="CheckedIn">CheckedIn</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>CheckedOutBy</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.isbn}</td>
              <td>
                {book.status ? (
                  "On " +
                  new Date(book.dueDate).toLocaleDateString() +
                  "checked out by " +
                  book.checkedOutBy
                ) : (
                  <input
                    type="text"
                    onChange={(e) => handleChangeCheckedOutBy(e, book.id)}
                  ></input>
                )}
              </td>
              <td>
                {book.status ? (
                  <button onClick={() => handleCheckIn(book.id)}>
                    Check In
                  </button>
                ) : (
                  <button onClick={() => handleCheckOut(book.id)}>
                    Check Out
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
