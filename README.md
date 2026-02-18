# Online Learning Platform

A full-stack web application where instructors can upload courses and students can enroll, watch lessons, and track their progress.

## Features

### For Instructors
- Create and manage courses
- Upload video lessons
- Add course descriptions, categories, and pricing
- View all created courses in dashboard

### For Students
- Browse available courses
- Enroll in courses
- Watch video lessons
- Track learning progress
- View completion percentage and statistics

## Tech Stack

### Backend
- **Node.js** with Express.js
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **JSON file-based storage** (can be easily migrated to a database)

### Frontend
- **React** with React Router
- **Axios** for API calls
- **React Player** for video playback
- Modern CSS with responsive design

## Project Structure

```
Online Learning Platform/
├── backend/
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── utils/           # Database utilities
│   ├── uploads/         # Uploaded video files
│   ├── data/            # JSON data files
│   └── server.js        # Main server file
├── frontend/
│   ├── public/          # Public assets
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── context/     # React context
│       └── App.js       # Main app component
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, for custom configuration):
```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, if backend is on different port):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### Creating an Account

1. Click "Sign Up" in the navigation
2. Choose your role:
   - **Student**: To enroll and learn from courses
   - **Instructor**: To create and manage courses
3. Fill in your details and create an account

### For Instructors

1. **Create a Course**:
   - Go to "Instructor Dashboard"
   - Click "Create New Course"
   - Fill in course details (title, description, category, price)
   - Add lessons with video files
   - Click "Create Course"

2. **Manage Courses**:
   - View all your courses in the dashboard
   - Click "View" to see course details
   - Delete courses if needed

### For Students

1. **Browse Courses**:
   - Go to "Browse Courses" or "Courses" in navigation
   - Search for courses by title, description, or category
   - Click on any course to view details

2. **Enroll in a Course**:
   - View course details
   - Click "Enroll Now" button
   - Start watching lessons immediately

3. **Track Progress**:
   - View progress percentage on course page
   - See completed lessons marked with checkmarks
   - Progress is automatically saved as you watch videos

4. **Watch Lessons**:
   - Select a lesson from the sidebar
   - Video will play in the main area
   - Click "Mark as Complete" when finished
   - Progress is tracked automatically

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `GET /api/courses/instructor/:instructorId` - Get instructor's courses
- `POST /api/courses` - Create course (Instructor only)
- `PUT /api/courses/:id` - Update course (Instructor only)
- `DELETE /api/courses/:id` - Delete course (Instructor only)
- `POST /api/courses/:id/lessons` - Add lesson to course (Instructor only)

### Enrollments
- `POST /api/enrollments` - Enroll in a course
- `GET /api/enrollments/my-courses` - Get student's enrollments
- `GET /api/enrollments/check/:courseId` - Check enrollment status

### Progress
- `POST /api/progress` - Update lesson progress
- `GET /api/progress/course/:courseId` - Get progress for a course
- `GET /api/progress/course/:courseId/summary` - Get progress summary

## Data Storage

The application currently uses JSON files for data storage:
- `backend/data/users.json` - User accounts
- `backend/data/courses.json` - Course data
- `backend/data/enrollments.json` - Enrollment records
- `backend/data/progress.json` - Progress tracking

**Note**: For production use, consider migrating to a proper database (MongoDB, PostgreSQL, etc.)

## File Uploads

Video files are stored in `backend/uploads/videos/`. The server serves these files statically at `/uploads/videos/`.

**Note**: For production, consider using cloud storage (AWS S3, Cloudinary, etc.) for better scalability.

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- File uploads are restricted to video files
- File size limit: 500MB per video

**Important**: Change the JWT_SECRET in production!

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Cloud storage for videos
- User profiles and avatars
- Course reviews and ratings
- Discussion forums
- Certificates upon completion
- Payment integration
- Email notifications
- Admin dashboard
- Advanced search and filtering

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please check the code comments or create an issue in the repository.
