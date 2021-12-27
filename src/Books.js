import React, { useState, useEffect } from "react";
import { db } from "./auth/FirebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import Book from "./components/Book";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";

const Books = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [books, setBooks] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [editedID, setEditedID] = useState("");

  const colRef = collection(db, "books");

  const q = query(colRef, orderBy("createdAt"));

  const getBooks = () => {
    getDocs(q)
      .then((snapshot) => {
        let books = [];
        snapshot.docs.forEach((doc) => {
          books.push({ ...doc.data(), id: doc.id });
        });
        console.log(books);
        setBooks(books);
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    getBooks();
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!isEditable) {
      addDoc(colRef, {
        title,
        author,
        createdAt: serverTimestamp(),
      }).then(() => {
        getBooks();
        setTitle("");
        setAuthor("");
      });
    } else {
      const docRef = doc(db, "books", editedID);
      updateDoc(docRef, {
        title,
        author,
      }).then(() => {
        setTitle("");
        setAuthor("");
        setIsEditable(false);
        setEditedID("");
        getBooks();
      });
    }
  };

  const editBook = (id) => {
    const [toBeEdited] = books.filter((book) => book.id === id);
    setTitle(toBeEdited.title);
    setAuthor(toBeEdited.author);
    setEditedID(toBeEdited.id);
    setIsEditable(true);
  };

  const deleteBook = (id) => {
    const docRef = doc(db, "books", id);
    deleteDoc(docRef).then(() => {
      getBooks();
    });
  };

  return (
    <Container className="col-md-6 mx-auto">
      <Form onSubmit={handleAdd}>
        <Form.Group className="mb-3">
          <Form.Label>Title: </Form.Label>
          <Form.Control
            type="text"
            placeholder="Title of book"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Author: </Form.Label>
          <Form.Control
            type="text"
            placeholder="Author of book"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </Form.Group>
        <div class="d-flex justify-content-center">
          <Button
            as="input"
            type="submit"
            value="Add a new book"
            className="mb-3 text-center"
          />
        </div>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Edit</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <Book
              key={book.id}
              book={book}
              deleteBook={deleteBook}
              editBook={editBook}
            />
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Books;
