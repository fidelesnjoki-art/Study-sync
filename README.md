# StudySync-Student Dashboard

## Description
StudySync is a responsive web application designed to help students manage academic tasks and improve productivity. The platform provides a centralized dashboard where users can organize study activities, track tasks, and manage schedules efficiently.

## What It Does

Students use multiple tools for tasks, calendars, and notes, which makes staying organized hard. StudySync solves this by giving students a simple, tailored productivity dashboard for managing study activities across devices.

## Features

### Core MVP
- **User Authentication**: Email/password and Google social login
- **Protected Routes**: Secure dashboard using React Router
- **Task Management**: Create, delete, and mark tasks complete
- **Study Schedules**: View and manage schedules in one place
- **Cloud Sync**: Data persistence with Firebase Firestore
- **Responsive UI**: Works seamlessly on mobile and desktop
- **Performance**: Lazy loading for faster load times
- **Testing**: Unit tests with Vitest and React Testing Library
- **CI/CD**: Automated deployment via GitHub Actions

### User Features
- Registration and login with error handling
- Protected user dashboard
- Persistent cloud-based data storage
- Loading and error states for better UX
- Logout functionality

### Admin Features
- View total user count
- View total task count
- Basic activity monitoring

## Tech Stack

**Frontend**
- React
- React Router
- CSS
- JavaScript

**Backend**
- Firebase Authentication
- Firebase Firestore

**Testing & Deployment**
- Vitest
- React Testing Library
- GitHub Actions

## Getting Started

### Dependencies
- Node.js
- npm 
- Firebase project with Auth and Firestore enabled

### Installation

1. Clone the repo-git clone git@github.com:fidelesnjoki-art/Study-sync.git
2. Install the dependencies  **npm install**
3. Set up firebase
4. Run the app **npm run dev**

### Usage

1. Sign up or log in with email or Google
2. Create tasks and set deadlines from the dashboard
3. Mark tasks complete and track your progress
4. Access your data from any device

### Running Tests
npm run test

## Deployment
Github Actions  
Live demo: [add link here]

### Contributing

1. Fork the repo
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Open a Pull Request
