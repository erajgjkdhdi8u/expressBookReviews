const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');
const regd_users = express.Router();
const users = [];
const JWT_SECRET = process.env.JWT_SECRET || 'bookshop-local-development-secret';

const isValid = username => users.some(user => user.username === username);
const authenticatedUser = (username, password) =>
  users.some(user => user.username === username && user.password === password);

regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const accessToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  req.session.authorization = { accessToken, username };
  return res.status(200).json({ message: 'User successfully logged in', accessToken });
});

regd_users.put('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const review = req.query.review ?? req.body.review;
  if (!Object.prototype.hasOwnProperty.call(books, isbn)) {
    return res.status(404).json({ message: 'Book not found' });
  }
  if (typeof review !== 'string' || !review.trim()) {
    return res.status(400).json({ message: 'Review must not be empty' });
  }
  const username = req.user.username;
  const updated = Object.prototype.hasOwnProperty.call(books[isbn].reviews, username);
  books[isbn].reviews[username] = review.trim();
  return res.status(200).json({
    message: updated ? 'Review updated successfully' : 'Review added successfully',
    reviews: books[isbn].reviews
  });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  if (!Object.prototype.hasOwnProperty.call(books, isbn)) {
    return res.status(404).json({ message: 'Book not found' });
  }
  const username = req.user.username;
  if (!Object.prototype.hasOwnProperty.call(books[isbn].reviews, username)) {
    return res.status(404).json({ message: 'You have no review for this book' });
  }
  delete books[isbn].reviews[username];
  return res.status(200).json({ message: 'Review deleted successfully', reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
