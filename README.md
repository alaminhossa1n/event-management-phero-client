# Event Management Web Application

A fully functional Event Management Web Application built with the MERN Stack (MongoDB, Express.js, React.js, and Node.js).

## Features

- **User Authentication**: Custom authentication system with registration and login
- **Event Management**: Create, read, update, and delete events
- **Event Discovery**: Browse all events with search and filter functionality
- **Event Participation**: Join events and track attendee counts
- **Responsive Design**: Modern, mobile-friendly UI built with Tailwind CSS
- **Real-time Updates**: Dynamic UI updates with toast notifications

## Tech Stack

- **Frontend**: React.js, React Router, Axios, Lucide React Icons
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB (API endpoints provided)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd evemt-management-client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx      # Navigation bar
│   ├── PrivateRoute.jsx # Protected route wrapper
│   └── UpdateEventModal.jsx # Event update modal
├── context/            # React context
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── Home.jsx        # Homepage
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── Events.jsx      # All events page
│   ├── AddEvent.jsx    # Create event page
│   └── MyEvents.jsx    # User's events page
├── utils/              # Utility functions
│   └── api.js          # API configuration and endpoints
├── App.jsx             # Main app component
└── main.jsx            # App entry point
```

## API Endpoints

The application integrates with the following backend endpoints:

### Authentication
- `POST /api/user/signup` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/profile` - Get user profile

### Events
- `POST /api/events/create` - Create new event
- `GET /api/events/all` - Get all events (with search/filter)
- `GET /api/events/my-events` - Get user's events
- `POST /api/events/join` - Join an event
- `PATCH /api/events/:eventId` - Update event
- `DELETE /api/events/:eventId` - Delete event

## Features Overview

### 1. Navigation
- Responsive navbar with logo and navigation links
- User profile dropdown with logout functionality
- Mobile-friendly hamburger menu

### 2. Authentication
- User registration with form validation
- User login with error handling
- Protected routes for authenticated users
- Automatic token management

### 3. Event Management
- Create events with title, description, date/time, and location
- View all events with search and filter options
- Join events (one-time only)
- Update and delete user's own events
- Real-time attendee count updates

### 4. Search and Filter
- Search events by title
- Filter by date ranges (today, current week, last week, current month, last month)
- Combined search and filter functionality

### 5. User Experience
- Loading states and error handling
- Toast notifications for user feedback
- Responsive design for all screen sizes
- Form validation with real-time error messages

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
