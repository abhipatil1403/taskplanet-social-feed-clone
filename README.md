# TaskPlanet Social Feed Clone

This is a production-ready, full-stack social feed application inspired by the Social Page of the TaskPlanet application, built with React, Material UI (MUI), Node.js, Express, and MongoDB Atlas.

---

## Features

1. **Authentication**:
   - Secure Sign Up & Login pages.
   - JWT-based authentication.
   - Password hashing via `bcryptjs`.
2. **Social Feed**:
   - Create post with image only, text only, or both.
   - View all posts sorted with the latest posts first.
   - Responsive design with custom modern MUI cards.
3. **Interactions**:
   - Like and Unlike posts dynamically with instant UI updates.
   - Expandable comment section to read and add comments.

---

## Project Structure

```
root/
├── backend/          # Express.js backend
│   ├── config/       # DB connection
│   ├── controllers/  # API controllers
│   ├── middleware/   # Authentication middleware
│   ├── models/       # Mongoose Schemas (User & Post)
│   ├── routes/       # API Routes
│   └── server.js     # Entry point
│
├── frontend/         # React.js Vite frontend
│   ├── src/
│   │   ├── components/ # Navbar, CreatePost, PostCard
│   │   ├── pages/      # Feed, Login, Signup
│   │   ├── theme.js    # Custom MUI theme (Outfit font)
│   │   └── App.jsx     # App configuration and routes
│   └── vite.config.js
│
└── README.md
```

---

## Tech Stack

- **Frontend**: React, React Router, Axios, Material UI (MUI)
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT)
- **Database**: MongoDB Atlas, Mongoose

---

## Local Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (Local instance or MongoDB Atlas Cloud Cluster)

---

## MongoDB Setup Procedure

You can choose either a local MongoDB installation or MongoDB Atlas (recommended for production/Render deployment).

### Option A: MongoDB Atlas Cloud (Recommended)
1. **Sign Up/Log In**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. **Create a Database**: Build a new database cluster using the **M0 Free Tier**.
3. **Database Access User**:
   - Go to **Security > Database Access**.
   - Click **Add New Database User**.
   - Set authentication method to **Password**, create a username/password, and set database privileges to **Read and write to any database**.
4. **Network Access (IP Whitelist)**:
   - Go to **Security > Network Access**.
   - Click **Add IP Address**.
   - Select **Allow Access From Anywhere** (`0.0.0.0/0`) or add your specific local IP. Click **Confirm**.
5. **Get Connection String**:
   - Go to **Deployment > Databases**.
   - Click **Connect** on your cluster.
   - Choose **Drivers** under "Connect to your application".
   - Copy the connection string. It looks like:
     ```text
     mongodb+srv://<db_username>:<db_password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```
6. **Configure Environment File**:
   - Open `/backend/.env` and paste this string into `MONGO_URI`.
   - Replace `<db_username>` and `<db_password>` with the credentials you created in step 3.

### Option B: Local MongoDB Setup
1. **Download & Install**: Download and run the installer for [MongoDB Community Server](https://www.mongodb.com/try/download/community).
2. **Start Service**: Ensure the MongoDB service is running (on Windows, it runs automatically as a system service. Otherwise, run `mongod`).
3. **Configure Connection**:
   - Use the local URI in your `/backend/.env`:
     ```env
     MONGO_URI=mongodb://127.0.0.1:27017/taskplanet
     ```

### 1. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```
3. Configure the `.env` variables:
   - `PORT`: Server port (default: 5000)
   - `MONGO_URI`: Your MongoDB database connection string (e.g., `mongodb://localhost:27017/taskplanet`)
   - `JWT_SECRET`: A secure string for token signing
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run the dev server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite local development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser at `http://localhost:5173` (or the printed port).

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Posts
- `GET /api/posts` - Get all posts sorted by newest first
- `POST /api/posts` - Create a new post (Protected)
- `PUT /api/posts/:id/like` - Like/Unlike a post (Protected)
- `POST /api/posts/:id/comment` - Add a comment (Protected)

---

## Deployment

### Frontend (Netlify)
- Set Environment Variable `VITE_API_URL` to your backend's deployed URL.

### Backend (Render)
- Add Environment Variables:
  - `MONGO_URI` (MongoDB Atlas URI)
  - `JWT_SECRET` (Secure key)
  - `NODE_ENV` (`production`)
