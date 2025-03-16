# Project Name: Assignment Management System

## Overview
This project is a React Native-based assignment management system that allows users to enter genuine input data, store it successfully in MongoDB, and generate downloadable PDFs.

## Features
- **User Authentication**: Secure login and signup system.
- **Data Storage**: Stores user assignments in MongoDB with validation.
- **PDF Download**: Users can generate and download PDFs of their assignments.
- **React Native UI**: Smooth and interactive UI built with React Native.

## Tech Stack
- **Frontend**: React Native, Expo Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **State Management**: React Hooks
- **PDF Generation**: Integrated using `react-native-print` (or similar library)

## Installation
1. **Clone the Repository**:
   ```sh
   git clone <repo-url>
   cd assignment-final-main
   ```
2. **Install Dependencies**:
   ```sh
   npm install
   ```
3. **Start the Backend Server**:
   ```sh
   cd server
   node server.js
   ```
4. **Start the Frontend**:
   ```sh
   npx expo start
   ```

## MongoDB Data Storage
- **Database Name**: `assignmentDB`
- **Collection**: `users`
- **Schema**:
  ```js
  const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      assignments: [{
          title: String,
          content: String,
          createdAt: { type: Date, default: Date.now }
      }]
  });
  ```
- **Validation**:
  - Each field is required and validated before insertion.
  - Only genuine input data is accepted.

## PDF Download Feature
- **Files Handling PDF**:
  - `step-3-goals.tsx`
  - `step-4-plan.tsx`
- **Functions Handling PDF Generation**:
  - `generatePDF()`
  - `handleDownloadPlan()`
- **Download Button Implementation**:
  ```tsx
  <TouchableOpacity onPress={generatePDF} style={styles.downloadButton}>
      <Download size={20} color="#000" />
      <Text style={styles.downloadText}>Download PDF</Text>
  </TouchableOpacity>
  ```
- **File Format**:
  - UTI: `.pdf`
  - MIME Type: `application/pdf`

## API Endpoints
| Method | Endpoint                 | Description                      |
|--------|--------------------------|----------------------------------|
| POST   | `/api/users/register`    | Registers a new user            |
| POST   | `/api/users/login`       | Authenticates user               |
| PUT    | `/api/users/:id/goals`   | Updates user goals               |
| PUT    | `/api/users/:id/plan`    | Updates user plan details        |
| GET    | `/api/users/:id/pdf`     | Generates and serves the PDF     |

## How to Use
1. **Sign up and log in.**
2. **Enter assignment details.**
3. **Save data (automatically stored in MongoDB).**
4. **Click 'Download PDF' to generate a PDF file.**

## Conclusion
This project successfully integrates **MongoDB for data storage**, ensures **data validation**, and allows **users to generate and download PDFs** seamlessly. 🚀

