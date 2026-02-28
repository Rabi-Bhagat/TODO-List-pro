# ToDo Pro - Agile Workflow

ToDo Pro is a premium, full-stack Task Management application featuring gamification, comprehensive authentications, real-time in-app notifications, and a responsive, interactive UI built with React and Framer Motion. 

---

## 🚀 Tech Stack

### Frontend
- **React 19 & Vite:** Fast, modern frontend framework and build tool.
- **Tailwind CSS v4:** Utility-first CSS framework for rapid, responsive styling.
- **Framer Motion:** Used extensively for micro-interactions, layout transitions, the notification dropdown, and the bespoke loading screen.
- **React Router DOM:** Client-side routing for navigating between Login, Signup, and the Main Dashboard.
- **Lucide React:** Beautiful, consistent iconography.
- **Axios:** For handling HTTP requests to the backend API.

### Backend
- **Node.js & Express:** Robust backend server framework.
- **MongoDB & Mongoose:** NoSQL database and Object Data Modeling (ODM) library for storing users and tasks.
- **JWT (JSON Web Tokens):** Secure, stateless user authentication.
- **Bcryptjs:** Secure password hashing.
- **Nodemailer:** Handles sending OTP (One Time Password) verification emails.

---

## ✨ Key Features
- **Gamification System:** Completing tasks earns you XP and increases your level. Daily activity builds your "Current Streak."
- **Interactive Dashboard:** Tabbed navigation between Tasks, Time Control (Stopwatch), and Alerts (Alarms).
- **In-App Notifications:** A bell icon tracks task Creation, Updates, and Deletions dynamically.
- **Mobile-First Responsive Design:** Stacking header layouts and horizontal scroll containers ensure perfect visual alignment on devices as small as the iPhone SE.
- **Dynamic Theming:** Built-in Dark/Light mode toggle stored in memory.

---

## 🔌 API Documentation (Backend Endpoints)

The backend is built as a RESTful API using Express. It strictly uses JSON for request payloads and responses. 
Most routes are protected by a JWT authorization middleware (`auth.js`), meaning the client must pass a valid token in their headers to access them.

### Auth API (`/api/auth`)
These endpoints handle user registration, login, and profile management.

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| **POST** | `/send-otp` | Sends a generated 6-digit OTP code to the provided `email` using Nodemailer. | No |
| **POST** | `/verify-otp` | Verifies the OTP passed by the client. If valid, logs the user in (or registers them if they are new) and returns a JWT. | No |
| **POST** | `/register` | Traditional registration. Requires `username`, `email`, and `password`. Hashes the password and returns a JWT. | No |
| **POST** | `/login` | Traditional login. Validates credentials and returns a JWT along with user stats (XP, level, streak). | No |
| **GET** | `/profile` | Retrieves the profile data of the currently authenticated user (excluding their password). | **Yes** |
| **PUT** | `/profile` | Updates the current user's profile information (e.g., `username`, `bio`, `profileImage`). | **Yes** |
| **PUT** | `/change-password` | Allows a user to change their password by validating their `oldPassword` and saving the `newPassword`. | **Yes** |

### Todos API (`/api/todos`)
These endpoints handle the full CRUD (Create, Read, Update, Delete) lifecycle for tasks and directly control the gamification system.

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Fetches an array of all tasks belonging to the authenticated user, sorted by newest first. | **Yes** |
| **POST** | `/` | Creates a new task. Expects `task` (title), `details`, `priority`, and `category` in the request body. | **Yes** |
| **PUT** | `/:id` | Updates an existing task by its MongoDB `_id`. <br><br>**Gamification Trigger:** If the `completed` boolean is changed to `true`, the backend automatically awards the user +15 XP, recalculates their total Level, and updates their Daily Streak logic in the same database transaction. | **Yes** |
| **DELETE** | `/:id` | Deletes a specific task from the database by its `_id`. | **Yes** |

---

## 🛠️ How to Run Locally

### 1. Backend Setup
1. Navigate to the `backend/` directory.
2. Run `npm install` to install dependencies.
3. Create a `.env` file referencing your MongoDB connection string and email credentials:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   GMAIL_USER=your_email@gmail.com
   GMAIL_PASS=your_app_password
   ```
4. Run `npm start` (or `node server.js`) to boot the API.

### 2. Frontend Setup
1. Navigate to the `frontend/` directory.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the Vite development server. 
4. Open the provided `localhost` URL in your browser.
