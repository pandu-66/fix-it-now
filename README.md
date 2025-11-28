# Fix It Now

**Fix It Now** is a web-based maintenance request platform that facilitates connections between residents and local service providers (plumbers, electricians, carpenters, etc.). The application features a dual-role system, allowing residents to report and track issues while enabling service providers to manage and resolve jobs efficiently.

## Features

### For Residents
* **Secure Authentication**: Sign up and login securely.
* **Issue Reporting**: A guided wizard to report maintenance issues by category (Plumbing, Electrical, HVAC, etc.) and urgency.
* **Provider Selection**: Option to broadcast jobs to all providers or select specific professionals based on ratings.
* **Dashboard Tracking**: Monitor active and completed issues in real-time.
* **Rating System**: Rate providers on a 5-star scale after job completion.

### For Service Providers
* **Job Board**: View "Broadcasted Issues" available for pickup within your specific trade category.
* **Request Management**: Accept or reject direct job requests from residents.
* **Workflow Control**: Update job statuses (In Progress, Resolved) and manage assigned tasks.
* **Profile Stats**: Track completed jobs and view average ratings.

## Tech Stack

**Frontend**
* **React (Vite)**
* **React Router v7**
* **Axios** for API communication
* **CSS Modules** for styling

**Backend**
* **Node.js & Express.js**
* **MongoDB & Mongoose**
* **JWT (JSON Web Tokens)** for authentication
* **Joi** for server-side validation

## Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/pandu-66/fix-it-now.git
    cd fix-it-now
    ```

2.  **Install dependencies**
    You need to install dependencies for the root, client, and server folders.

    Root:
    ```bash
    npm install
    ```

    Server:
    ```bash
    cd server
    npm install
    ```

    Client:
    ```bash
    cd ../client
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the `server` directory and add your JWT secret:
    ```env
    JWT_SECRET=your_super_secret_key
    ```

4.  **Database Setup**
    Ensure you have MongoDB running locally on port `27017` or update the connection string in `server/index.js`.

##  Usage

You can run the full stack application using the concurrent script from the root directory:

```bash
npm start
```
This will concurrently start:

* Backend Server at http://localhost:3000
* Frontend Client at http://localhost:5173

## Project Structure

```bash
fix-it-now/
├── client/                 # React Frontend (Vite)
│   ├── src/
│       ├── api/            # API Service configuration
│       ├── Auth/           # Authentication pages & logic
│       ├── Layouts/        # Shared components (Nav, Footer)
│       ├── Resident/       # Resident dashboard & forms
│       └── Provider/       # Provider dashboard components
│   
├── server/                 # Express Backend
│   ├── models/             # Mongoose Models (User, Issue)
│   ├── utils/              # Utilities (Error handling)
│   ├── middleware.js       # Auth & Validation Middleware
│   ├── schema.js           # Joi Validation Schemas
│   └── index.js            # Server entry point
└── package.json            # Root configuration
```