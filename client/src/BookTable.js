import React from "react";

class BookTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
    };
  }

  fetchBooks(filterSelection) {
    if (filterSelection === "All") {
      fetch("http://localhost:5000/books").then((response) => {
        response.json().then((result) => {
          this.setState({
            books: result.result,
          });
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
          this.setState({
            books: result.result,
          });
        });
      });
    }
  }

  componentDidMount() {
    this.fetchBooks("All");
  }

  handleFilterSelection(e) {
    this.fetchBooks(e.target.value);
  }

  handleCheckOut(bookId) {
    fetch("http://localhost:5000/books/checkOut/" + bookId, {
      method: "POST",
      body: JSON.stringify({
        checkedOutBy: this.state.books
          .filter((book) => book.id === bookId)
          .at(0).checkedOutBy,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      window.location.reload();
    });
  }

  handleCheckIn(bookId) {
    fetch("http://localhost:5000/books/checkIn/" + bookId, {
      method: "POST",
    }).then(() => {
      window.location.reload();
    });
  }

  handleChangeCheckedOutBy = (e, bookId) => {
    this.state.books.filter((book) => book.id === bookId).at(0).checkedOutBy =
      e.target.value;
  };

  render() {
    return (
      <>
        <div className="select-filter-option">
          Show:{" "}
          <select onChange={(e) => this.handleFilterSelection(e)}>
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
            {this.state.books.map((book) => (
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
                      onChange={(e) =>
                        this.handleChangeCheckedOutBy(e, book.id)
                      }
                    ></input>
                  )}
                </td>
                <td>
                  {book.status ? (
                    <button onClick={() => this.handleCheckIn(book.id)}>
                      Check In
                    </button>
                  ) : (
                    <button onClick={() => this.handleCheckOut(book.id)}>
                      Check Out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
}
export default BookTable;
