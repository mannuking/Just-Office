# Just-Office

Just-Office is a full-stack web application built with React.js frontend and Node.js/Express backend for managing office spaces and bookings.

## Prerequisites

Before setting up the project, ensure you have the following installed on your system:

1. **Node.js and npm**
   - Windows: Download and install from [Node.js official website](https://nodejs.org/)
   - macOS: 
     ```bash
     brew install node
     ```
   - Linux:
     ```bash
     sudo apt update
     sudo apt install nodejs npm
     ```

2. **MongoDB**
   - Windows: Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - macOS:
     ```bash
     brew tap mongodb/brew
     brew install mongodb-community
     ```
   - Linux:
     ```bash
     sudo apt update
     sudo apt install mongodb
     sudo systemctl start mongodb
     ```

## Project Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd just-office
```

### 2. Frontend Setup

1. Install frontend dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
REACT_APP_API_URL=http://localhost:5000
```

### 3. Backend Setup

1. Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

2. Create a `.env` file in the backend directory:
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/just-office
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

Note: Replace `your_jwt_secret_here` with a secure random string for production use.

### 4. Database Setup

1. Ensure MongoDB is running:
   - Windows: MongoDB should be running as a service
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongodb`

2. The database will be automatically created when you start the backend server.

## Running the Application

### 1. Start the Backend Server

In the backend directory:
```bash
# Development mode with auto-reload
npm run dev

# OR Production mode
npm start
```

The backend server will start on http://localhost:5000

### 2. Start the Frontend Development Server

In the root directory:
```bash
npm start
```

The frontend development server will start on http://localhost:3000

## Available Scripts

In the project directory, you can run:

- `npm start`: Runs the frontend in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the frontend for production
- `npm run eject`: Ejects from create-react-app

In the backend directory:
- `npm run dev`: Runs the backend with nodemon for development
- `npm start`: Runs the backend in production mode

## Project Structure

```
just-office/
├── backend/             # Backend server files
│   ├── config/         # Configuration files
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── server.js       # Server entry point
├── public/             # Static files
├── src/                # Frontend source files
│   ├── components/     # React components
│   ├── data/          # Static data files
│   └── images/        # Image assets
└── package.json        # Project dependencies
```

## Troubleshooting

1. **MongoDB Connection Issues**
   - Ensure MongoDB is running on your system
   - Check if the MONGO_URI in backend/.env is correct
   - Verify MongoDB port is not blocked by firewall

2. **Port Conflicts**
   - If port 3000 or 5000 is in use, modify the respective port in:
     - Frontend: Create a `.env` file with `PORT=3001`
     - Backend: Modify `PORT` in backend/.env

3. **Node Module Issues**
   - Try removing node_modules and package-lock.json:
     ```bash
     rm -rf node_modules package-lock.json
     npm install
     ```

## Production Deployment

For production deployment:

1. Build the frontend:
```bash
npm run build
```

2. Set environment variables in production:
   - Set NODE_ENV=production
   - Use secure MONGO_URI
   - Use strong JWT_SECRET
   - Configure CORS settings in backend

3. Serve the static build files using the backend server or a CDN

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
