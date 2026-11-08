# Express Book Reviews — IBM Final Project

Backend bookshop API using Node.js and Express. This fork preserves the IBM starter layout.

## Setup

Install Node.js 18+ and run:

```bash
cd final_project
npm install
npm start
```

Keep the server running at http://localhost:5000. Open **another terminal** for the requests below.

## Mark submission — collect actual output

Run each command and copy both the command and *the real terminal output* to the corresponding Mark field. Do not submit fabricated output. On Windows PowerShell, use `curl.exe` (not the `curl` alias).

1. **githubrepo** (shows fork's upstream owner)

```bash
curl.exe -s https://api.github.com/repos/erajgjkdhdi8u/expressBookReviews
```
Look for `fork: true` and `parent.full_name: ibm-developer-skills-network/expressBookReviews`. If the grader requires a more concise result, use `gh repo view erajgjkdhdi8u/expressBookReviews --json parent`.

2. **getallbooks**: `curl.exe -i http://localhost:5000/`
3. **getbooksbyISBN**: `curl.exe -i http://localhost:5000/isbn/1`
4. **getbooksbyauthor**: `curl.exe -i "http://localhost:5000/author/Jane%20Austen"`
5. **getbooksbytitle**: `curl.exe -i "http://localhost:5000/title/Pride%20and%20Prejudice"`
6. **getbookreview**: `curl.exe -i http://localhost:5000/review/1`
7. **register**:

```bash
curl.exe -i -X POST http://localhost:5000/register -H "Content-Type: application/json" -d '{"username":"student1","password":"pass123"}'
```

8. **login** — `-c cookies.txt` saves the session for tasks 9 and 10:

```bash
curl.exe -i -c cookies.txt -X POST http://localhost:5000/customer/login -H "Content-Type: application/json" -d '{"username":"student1","password":"pass123"}'
```

9. **reviewadded**:

```bash
curl.exe -i -b cookies.txt -X PUT "http://localhost:5000/customer/auth/review/1?review=Excellent%20book"
```

10. **deletereview**:

```bash
curl.exe -i -b cookies.txt -X DELETE http://localhost:5000/customer/auth/review/1
```

11. **Axios async/await code**: [router/general.js](router/general.js). Run `npm run demo` in another terminal while the API server is running. It demonstrates all four promised-based async functions.

**Note:** Windows PowerShell command-line quoting of JSON arguments differs from Bash. If task 7 gives an invalid JSON error, use PowerShell's `Invoke-RestMethod`:

```powershell
$body = @{username='student1'; password='pass123'} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:5000/register -ContentType 'application/json' -Body $body
```

Then authenticate with:

```powershell
$login = Invoke-RestMethod -Method Post -Uri http://localhost:5000/customer/login -ContentType 'application/json' -Body $body
curl.exe -i -H "Authorization: Bearer $($login.accessToken)" -X PUT "http://localhost:5000/customer/auth/review/1?review=Excellent%20book"
curl.exe -i -H "Authorization: Bearer $($login.accessToken)" -X DELETE http://localhost:5000/customer/auth/review/1
```

### Implementation notes
- Book data comes from the original IBM `router/booksdb.js` and remains unchanged.
- Public endpoints: catalogue, ISBN, author, title, reviews, registration.
- Protected endpoints: add/update review, delete own review. Login returns a JWT and also stores the token in an Express session.
- This is an educational in-memory application. Users and reviews reset on restart; passwords are stored in memory without hashing. Do not deploy as a production authentication service.
- IBM Mark's grading outcome is determined by the course grader; inspect each task's individual instructions before submission.
