# Park Reports - Community Report System

## Overview
A community reporting system for park-related issues using pure HTML, CSS, and JavaScript. Features user authentication with localStorage for data persistence.

## Project Structure
```
├── index.html              # Redirect to login page
├── server.py               # Python HTTP server
├── html/
│   ├── login.html          # Login page
│   ├── signup.html         # Registration page
│   └── dashboard.html      # Main application dashboard
├── css/
│   ├── GS.css              # Styles for login/signup pages
│   └── styles.css          # Styles for dashboard
├── js/
│   ├── auth.js             # Authentication logic (login/signup)
│   └── app.js              # Main application logic
└── attached_assets/        # Reference files
```

## Features
- **User Authentication**: Registration and login with localStorage
- **Session Management**: Users stay logged in until logout
- **Account Types**: User and Government account options
- **Report Management**: Create, view, and filter reports
- **Comments**: Add comments to reports
- **Data Persistence**: All data stored in localStorage

## Tech Stack
- Pure HTML5, CSS3, JavaScript (Vanilla)
- Bootstrap 5 for UI components
- Bootstrap Icons
- Python HTTP server for development

## localStorage Keys
- `parkReports_users`: Registered user accounts
- `parkReports_currentUser`: Current logged-in session
- `parkReports_allReports`: All park reports with comments

## Running the Application
```bash
python server.py
```
Access at http://0.0.0.0:5000

## User Preferences
- Design to be added by user for login/signup pages
- Using object-based database (localStorage) as per user request
