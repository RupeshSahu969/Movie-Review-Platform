# MERN Movie App

Develop a movie review platform where users can browse movies, read and write reviews, and rate films. The application should have a React frontend and a Node.js backend using Express and SQL/MongoDB  

---

## Features

### Backend (Node.js + Express + MongoDB)
- User authentication (JWT-based login/register/logout)  
- Profile management with profile picture upload  
- Movie management (add, list, filter movies)  
- Reviews with star ratings  
- Watchlist functionality  
- Secure routes with middleware  
- CORS, Helmet, and Morgan for security & logging  

#### API Endpoints

- **Auth**
    - `POST /api/auth/register` – Register a new user
    - `POST /api/auth/login` – Login user
    - `POST /api/auth/logout` – Logout user

- **User**
    - `GET /api/users/:id` – Get current user profile
    - `PUT /api/users/:id` – Update profile (with image upload)

- **Movies**
    - `GET /api/movies` – List/filter movies
    - `POST /api/movies` – Add new movie
    - `GET /api/movies/:id` – Get movie details

- **Reviews**
    - `POST /api/movies/:id/reviews` – Add review to movie
    - `GET /api/movies/:id/reviews` – Get reviews for a movie

- **Watchlist**
    - `POST /api/users/me/watchlist` – Add movie to watchlist
    - `GET /api/users/me/watchlist` – Get user watchlist
    - `DELETE /api/users/me/watchlist/:movieId` – Remove movie from watchlist

### Frontend (React + Tailwind CSS)
- Responsive UI with modern design  
- Home page with **Featured & Trending** movies  
- Movie listing with **search and filters** (genre, year, rating)  
- Individual movie page with details, cast, and reviews  
- Profile page with **watchlist and review history**  
- Review submission form with star rating  
- Auth context for login/register/logout  
- State management with Context API  
- Error handling & loading states  

#### Custom React Hooks Used

- `useAuth()` – Handles authentication state and actions
- `useMovies()` – Fetches and manages movie data
- `useMovie(id)` – Fetches details for a single movie
- `useReviews(movieId)` – Fetches and submits reviews for a movie
- `useWatchlist()` – Manages user watchlist
- `useProfile()` – Fetches and updates user profile
- `useFetch()` – Generic data fetching with loading/error states

---

## Tech Stack
- **Frontend:** React, React Router, TailwindCSS, Axios  
- **Backend:** Node.js, Express.js, MongoDB, Mongoose  
- **Authentication:** JWT (JSON Web Tokens)  
- **Storage:** Multer for image uploads (profile pictures & posters)  
- **Other:** Helmet, Morgan, CORS  

---

## Installation

###  Clone the Repository
```bash
git clone https://github.com/your-username/movie-app.git
cd movie-app
```

###  Backend Setup

Navigate to the backend directory (e.g., `server` or `backend`):

```bash
cd backend
```

Install backend dependencies:

```bash
npm install
```

**Main backend dependencies in `package.json`:**
- express
- mongoose
- bcryptjs
- jsonwebtoken
- multer
- cors
- helmet
- morgan
- dotenv
- nodemon (dev)

You can install them with:

```bash
npm install express mongoose bcryptjs jsonwebtoken multer cors helmet morgan dotenv
npm install --save-dev nodemon
```

###  Frontend Setup

Navigate to the frontend directory (e.g., `client` or `frontend`):

```bash
cd ../frontend
```

Install frontend dependencies:

```bash
npm install
```

**Main frontend dependencies in `package.json`:**
- react
- react-dom
- react-router-dom
- axios
- tailwindcss
- @headlessui/react
- @heroicons/react
- postcss
- autoprefixer

You can install them with:

```bash
npm install react react-dom react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
npm install @headlessui/react @heroicons/react
npx tailwindcss init -p
```

---
