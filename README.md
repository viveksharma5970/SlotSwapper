# SlotSwapper

A peer-to-peer time-slot scheduling application where users can swap calendar slots with each other.

## Project Structure

```
SlotSwapper/
├── backend/          # Node.js + Express + MongoDB backend
└── frontend/         # React + TypeScript frontend
```

## Features

- User authentication (JWT)
- Calendar management (CRUD operations)
- Slot swapping system
- Real-time swap requests and responses
- Marketplace for available slots

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env` file and update MongoDB URI and JWT secret
   - Default MongoDB URI: `mongodb://localhost:27017/slotswapper`

4. Start the server:
   ```bash
   npm run dev
   ```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Events
- `GET /api/events` - Get user's events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Swaps
- `GET /api/swaps/swappable-slots` - Get available slots from other users
- `POST /api/swaps/swap-request` - Create swap request
- `POST /api/swaps/swap-response/:requestId` - Respond to swap request
- `GET /api/swaps/requests` - Get user's swap requests

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18
- TypeScript
- React Router for navigation
- Axios for HTTP requests
- Context API for state management

## Database Schema

### User
- name, email, password (hashed)

### Event
- title, startTime, endTime, status (BUSY/SWAPPABLE/SWAP_PENDING), userId

### SwapRequest
- requesterUserId, targetUserId, requesterSlotId, targetSlotId, status (PENDING/ACCEPTED/REJECTED)