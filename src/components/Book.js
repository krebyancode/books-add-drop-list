import React from "react";
import Button from "react-bootstrap/Button";

const Book = ({ book, deleteBook, editBook }) => {
  const { title, author, id } = book;
  return (
    <tr>
      <td>{title}</td>
      <td>{author}</td>
      <td>
        <Button variant="secondary" size="sm" onClick={() => editBook(id)}>
          Edit
        </Button>
      </td>
      <td>
        <Button variant="danger" size="sm" onClick={() => deleteBook(id)}>
          Remove
        </Button>
      </td>
    </tr>
  );
};

export default Book;
