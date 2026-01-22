# Admin Panel Setup Guide

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional, defaults are provided):
```bash
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
```

## Running the Server

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## Default Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change the default password in production!

## Admin Panel Access

Access the admin panel at: `http://localhost:3000/admin`

## Features

### Contact Form Submissions
- View all form submissions
- Filter by status (new, read, archived)
- View detailed submission information
- Update submission status
- Delete submissions

### Statistics
- Total submissions count
- Submissions in last 7 days
- Breakdown by status
- Breakdown by form type

### Database
- SQLite database (`database.db`) is automatically created
- All submissions are stored with timestamps
- Admin users are stored securely with bcrypt hashed passwords

## API Endpoints

### Public Endpoints
- `POST /api/submit` - Submit contact form

### Admin Endpoints (Require Authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/submissions` - Get all submissions
- `GET /api/admin/submissions/:id` - Get single submission
- `PATCH /api/admin/submissions/:id` - Update submission status
- `DELETE /api/admin/submissions/:id` - Delete submission
- `GET /api/admin/stats` - Get statistics

## Security Notes

1. Change the default admin password immediately
2. Use a strong JWT_SECRET in production
3. Consider adding rate limiting for form submissions
4. Add HTTPS in production
5. Regularly backup the `database.db` file

## Database Schema

### submissions
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- email (TEXT)
- phone (TEXT)
- company (TEXT, nullable)
- message (TEXT, nullable)
- saved_calculation (TEXT, nullable)
- form_type (TEXT, default: 'main')
- created_at (DATETIME)
- status (TEXT, default: 'new')

### admin_users
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- password (TEXT, bcrypt hashed)
- created_at (DATETIME)
