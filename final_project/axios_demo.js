const { getAllBooks, getBookByISBN, getBooksByAuthor, getBooksByTitle } = require('./router/general.js');

async function main() {
  for (const [label, task] of [
    ['All books', getAllBooks],
    ['ISBN 1', () => getBookByISBN('1')],
    ['Author Jane Austen', () => getBooksByAuthor('Jane Austen')],
    ['Title Pride and Prejudice', () => getBooksByTitle('Pride and Prejudice')]
  ]) {
    try {
      console.log('\n' + label + ':');
      console.log(JSON.stringify(await task(), null, 2));
    } catch (err) {
      console.error(label + ' failed:', err.response?.data || err.message);
      process.exitCode = 1;
    }
  }
}
main();
