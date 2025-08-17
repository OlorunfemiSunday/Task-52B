
# Blog API

A Node.js + Express + MongoDB REST API implementing Posts and Comments with:
- JWT authentication for protected routes
- Role-based control (user/admin)
- Pagination & filtering for `GET /api/posts`
- Rate limiting, Helmet, input sanitization (XSS & Mongo injection)
- Validation using `express-validator`

## Quick start

1. Clone repository
```bash
git clone <your-repo-url>
cd blog-api
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`) and set values:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/blog-api
JWT_SECRET=supersecret
JWT_EXPIRES_IN=7d
```

4. Run (development):
```bash
npm run dev
```

## Endpoints (summary)

### Auth
- `POST /api/auth/register` — Register (name, email, password)
- `POST /api/auth/login` — Login (email, password)

### Posts
- `GET /api/posts` — List posts (public) — supports `?page=1&limit=10&author=<id>&tags=tag1,tag2&dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD`
- `POST /api/posts` — Create post (authenticated) — body: `{ title, content, tags }`
- `GET /api/posts/:id` — Get single post
- `PUT /api/posts/:id` — Update post (owner or admin)
- `DELETE /api/posts/:id` — Delete post (owner or admin)

### Comments
- `POST /api/posts/:id/comments` — Add comment to post (authenticated) — `{ content }`
- `GET /api/posts/:id/comments` — List comments for a post (public)
- `DELETE /api/comments/:id` — Delete comment (owner or admin)

## Notes on Pagination & Filtering

- Pagination query params: `page` (default 1), `limit` (default 10).
- Filter by author id using `author=<userId>`.
- Filter by tags with `tags=tag1,tag2` (returns posts that have any of listed tags).
- Filter by date range using `dateFrom` and/or `dateTo` (YYYY-MM-DD).

## Security & Middleware
- Helmet for secure HTTP headers
- express-rate-limit to limit requests
- express-mongo-sanitize and xss-clean to sanitize inputs
- express-validator to validate request bodies

## Push to GitHub
1. `git init`
2. `git add . && git commit -m "Initial commit - blog-api"`
3. Create GitHub repo and `git remote add origin <url>`
4. `git push -u origin main`

---
