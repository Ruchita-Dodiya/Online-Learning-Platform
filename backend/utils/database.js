const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const getFilePath = (filename) => path.join(dataDir, filename);

const readData = (filename) => {
  const filePath = getFilePath(filename);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeData = (filename, data) => {
  const filePath = getFilePath(filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// User management
const getUsers = () => readData('users.json');
const saveUsers = (users) => writeData('users.json', users);

// Course management
const getCourses = () => readData('courses.json');
const saveCourses = (courses) => writeData('courses.json', courses);

// Enrollment management
const getEnrollments = () => readData('enrollments.json');
const saveEnrollments = (enrollments) => writeData('enrollments.json', enrollments);

// Progress management
const getProgress = () => readData('progress.json');
const saveProgress = (progress) => writeData('progress.json', progress);

module.exports = {
  getUsers,
  saveUsers,
  getCourses,
  saveCourses,
  getEnrollments,
  saveEnrollments,
  getProgress,
  saveProgress
};
