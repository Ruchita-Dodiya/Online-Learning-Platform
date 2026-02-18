# Quick Start Guide

## Quick Setup (5 minutes)

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Start Backend Server
```bash
npm start
```
The backend will run on `http://localhost:5000`

### Step 3: Install Frontend Dependencies (in a new terminal)
```bash
cd frontend
npm install
```

### Step 4: Start Frontend Development Server
```bash
npm start
```
The frontend will open at `http://localhost:3000`

## First Steps

1. **Create an Instructor Account**:
   - Click "Sign Up"
   - Choose "Teach (Instructor)" role
   - Register with your email and password

2. **Create Your First Course**:
   - Go to "Instructor Dashboard"
   - Click "Create New Course"
   - Fill in course details
   - Add at least one lesson with a video file
   - Click "Create Course"

3. **Test as a Student**:
   - Logout and create a new account with "Learn (Student)" role
   - Browse courses
   - Enroll in a course
   - Watch lessons and track progress

## Video File Requirements

- Supported formats: MP4, WebM, OGG
- Maximum file size: 500MB
- Recommended: MP4 format for best compatibility

## Troubleshooting

**Backend won't start?**
- Make sure port 5000 is not in use
- Check that all dependencies are installed

**Frontend won't start?**
- Make sure backend is running first
- Check that port 3000 is available
- Verify all dependencies are installed

**Can't upload videos?**
- Check file format (MP4, WebM, or OGG)
- Ensure file size is under 500MB
- Verify backend/uploads/videos directory exists

**API errors?**
- Ensure backend server is running
- Check browser console for detailed error messages
- Verify JWT token is being sent in requests

## Development Tips

- Use `npm run dev` in backend for auto-reload during development
- Backend data is stored in JSON files in `backend/data/`
- Uploaded videos are stored in `backend/uploads/videos/`
- Clear browser cache if you see authentication issues
