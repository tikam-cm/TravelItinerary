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
PORT=5000
MONGO_URI=mongodb://localhost:27017/itineraries
JWT_SECRET=your_secret_key
REDIS_HOST=localhost
REDIS_PORT=6379
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
