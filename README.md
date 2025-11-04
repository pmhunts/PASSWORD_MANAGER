# SecureVault

A full-stack password management application built with Node.js, Express, and MongoDB. SecureVault provides a secure and user-friendly interface for managing passwords, featuring encryption, JWT authentication, and a responsive design.

## Features

- Secure user registration and login with bcrypt password hashing and JWT tokens
- Encrypted storage of user accounts and password entries in MongoDB
- CRUD operations for password entries (add, view, edit, delete)
- Password masking with temporary reveal functionality
- Built-in strong password generator and strength checker
- Automatic logout after 15 minutes of inactivity
- Data export to JSON for backup
- Modern UI with video background and Material Design colors

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose ODM
- **Security**: bcryptjs, jsonwebtoken

## Installation

### Prerequisites

- Node.js (v18+)
- MongoDB

### Setup

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd SecureVault
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```
   MONGODB_URI=mongodb://localhost:27017/securevault
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

4. Start the server:

   - Production: `npm start`
   - Development: `npm run dev`

5. Open `index.html` in your browser to access the application.

## API Endpoints

| Endpoint            | Method | Description       | Auth Required |
| ------------------- | ------ | ----------------- | ------------- |
| /api/users/register | POST   | Register new user | No            |
| /api/users/login    | POST   | User login        | No            |
| /api/passwords      | GET    | Get all passwords | Yes           |
| /api/passwords      | POST   | Add new password  | Yes           |
| /api/passwords/:id  | PATCH  | Update password   | Yes           |
| /api/passwords/:id  | DELETE | Delete password   | Yes           |

## Project Structure

- `index.html` - Main UI file
- `script.js` - Frontend logic
- `server.js` - Backend API
- `styles.css` - Stylesheets
- `package.json` - Dependencies
- `.env` - Environment variables
- `.gitignore` - Git ignore rules
