# Travel Itinerary API

## Overview
This project is a **Travel Itinerary API** built with **Node.js (Express.js) and MongoDB (Mongoose ORM)**. It enables users to **create, manage, and share** travel itineraries while incorporating authentication, caching, and performance optimizations.

---

## Features
- **User Authentication** (JWT-based login & registration)
- **CRUD Operations** for managing travel itineraries
- **Query Optimization** (pagination, sorting, filtering)
- **Caching** using **Redis**
- **Shareable Public Links** for itineraries
- **Unit & Integration Testing** (Jest & Supertest)
- **Dockerized Deployment**

---

## Tech Stack
| Component        | Technology  |
|-----------------|-------------|
| **Backend**      | Node.js (Express.js) |
| **Database**     | MongoDB (Mongoose ORM) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Caching**      | Redis / Node-cache |
| **Documentation** | Swagger / Postman |
| **Testing**      | Jest & Supertest |
| **Containerization** | Docker & Docker Compose |

---

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- Node.js (v16+)
- MongoDB
- Redis (for caching)
- Docker (if running in containers)

### Clone the Repository
```sh
git clone https://github.com/tikam-cm/TravelItinerary.git
```

### Install Dependencies
```sh
npm install
```

### Configure Environment Variables
Create a `.env` file and add:
```
PORT=8000
MONGO_URI=mongodb://localhost:27017/itineraries
JWT_SECRET=your_secret_key
```

### Run the API
```sh
npm start
```

### Run with Docker
```sh
docker-compose up -d
```

---

## API Endpoints

### **Authentication**
| Method | Endpoint | Description |
|--------|----------|------------|
| **POST** | `/api/auth/register` | Register a new user |
| **POST** | `/api/auth/login` | Login & get JWT token |

### **Itinerary Management**
| Method | Endpoint | Description |
|--------|----------|------------|
| **POST** | `/api/itineraries` | Create an itinerary |
| **GET** | `/api/itineraries` | Get all itineraries (supports filtering) |
| **GET** | `/api/itineraries/:id` | Get a specific itinerary |
| **PUT** | `/api/itineraries/:id` | Update an itinerary |
| **DELETE** | `/api/itineraries/:id` | Delete an itinerary |

### **Query Features**
| Feature | Example Usage |
|---------|--------------|
| **Pagination** | `/api/itineraries?page=1&limit=10` |
| **Sorting** | `/api/itineraries?sort=startDate` |
| **Filtering** | `/api/itineraries?destination=Paris` |

### **Performance Optimizations**
| Optimization | Implementation |
|-------------|---------------|
| **Database Indexing** | Index `userId` & `destination` |
| **Caching** | Cache itinerary details (`GET /api/itineraries/:id`) for 5 mins |

### **Sharing Feature**
| Method | Endpoint | Description |
|--------|----------|------------|
| **GET** | `/api/itineraries/share/:shareableId` | Public link (Excludes sensitive data) |

---

## **Rate Limiting**
To prevent excessive API usage, we implement rate limiting using **Express Rate Limit**.

### **Configuration**
```js
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Each IP is limited to 100 requests per window (15 minutes)
  standardHeaders: 'draft-8', // Uses combined `RateLimit` header (draft-8 standard)
  legacyHeaders: false // Disables `X-RateLimit-*` headers
};
```

## **Node Mailer**
Nodemailer makes sending email from a Node.js application straightforward and secure, without pulling in a single runtime dependency.

### **Configuration**
```js
const mailerConfig = {
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  secure: false,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  }
};
```


### **Behavior**
- Each IP address can make **100 requests** within a **15-minute window**.
- Standard headers (`RateLimit`) are used instead of legacy headers.
- Once the limit is reached, further requests from the same IP will be **blocked** until the window resets.

---

## Testing
Run unit & integration tests:
```sh
npm run test
```

---

## Docker Deployment
Build and run using Docker:
```sh
docker-compose up --build -d
```

---

## License
This project is **MIT Licensed**.

---
