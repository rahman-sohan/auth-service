# Auth Service

A microservice for authentication and authorization in the Lyxa system.

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [RabbitMQ Setup](#rabbitmq-setup)
  - [Environment Variables](#environment-variables)
- [Running the Service](#running-the-service)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
  - [Using Docker](#using-docker)
  - [Using Docker Compose](#using-docker-compose)
- [Testing](#testing)
- [Inter-Service Communication Flow](#inter-service-communication-flow)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Project Overview

The Auth Service provides authentication and authorization functionality for the Lyxa microservices architecture. It handles user registration, login, token management, and verification of user credentials.

## Tech Stack

- [NestJS](https://nestjs.com/) - A progressive Node.js framework
- [MongoDB](https://www.mongodb.com/) (with Mongoose ODM)
- [RabbitMQ](https://www.rabbitmq.com/) - Message broker for inter-service communication
- [JWT](https://jwt.io/) - JSON Web Token for authentication
- [Docker](https://www.docker.com/) - Containerization
- [Passport](https://www.passportjs.org/) - Authentication middleware

## Setup Instructions

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js (v20 or higher)
- pnpm package manager
- MongoDB
- RabbitMQ
- Docker & Docker Compose (for containerized setup)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd auth-service
```

2. Install dependencies:
```bash
pnpm install
```

### Database Setup

1. Start MongoDB server locally or use a cloud service like MongoDB Atlas.

2. The service will automatically connect to MongoDB using the connection string provided in the environment variables.

### RabbitMQ Setup

1. Start RabbitMQ server locally:
```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

2. Access the RabbitMQ management console at http://localhost:15672 (default credentials: guest/guest)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```dotenv
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/auth-service

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=1h
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_REFRESH_EXPIRATION=7d

# RabbitMQ
RABBITMQ_URI=amqp://localhost:5672
```

## Running the Service

### Development Mode

```bash
# Start in development mode with hot-reload
pnpm run start:dev
```

### Production Mode

```bash
# Build the application
pnpm run build

# Start in production mode
pnpm run start:prod
```

### Using Docker

Build and run the service using Docker:

```bash
# Build the Docker image
docker build -t auth-service .

# Run the Docker container
docker run -p 3000:3000 --env-file .env auth-service
```

### Using Docker Compose

We use Docker Compose to run multiple services together. Create a `docker-compose.yml` file in your project root:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - microservices_network

  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbitmq
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - microservices_network

  auth-service:
    build:
      context: ./auth-service
    container_name: auth-service
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/auth
      - RABBITMQ_URI=amqp://rabbitmq:5672
    depends_on:
      - mongodb
      - rabbitmq
    networks:
      - microservices_network

  product-service:
    build:
      context: ./product-service
    container_name: product-service
    ports:
      - "3001:3001"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/products
      - RABBITMQ_URI=amqp://rabbitmq:5672
      - AUTH_SERVICE_URL=http://auth-service:3000
    depends_on:
      - mongodb
      - rabbitmq
      - auth-service
    networks:
      - microservices_network

networks:
  microservices_network:
    driver: bridge

volumes:
  mongodb_data:
  rabbitmq_data:
```

Run all services with:

```bash
docker-compose up -d
```

## Testing

```bash
# Run unit tests
pnpm run test

# Run end-to-end tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## Inter-Service Communication Flow

The Auth Service communicates with other microservices primarily through RabbitMQ message broker:

1. **User Registration Flow**:
   - Auth Service receives registration request via REST API
   - Validates user data and creates a new user in the database
   - Emits a `user.registered` event to RabbitMQ
   - Other services (e.g., User Profile Service, Notification Service) listen for this event and perform their actions

2. **Authentication Flow**:
   - Client sends login credentials to Auth Service
   - Auth Service validates credentials and issues JWT tokens
   - Token is used for subsequent authenticated requests to any service

3. **Authorization Flow**:
   - Other services send token verification requests to Auth Service via RabbitMQ
   - Auth Service verifies token and responds with user information and permissions
   - The requesting service determines if the user is authorized for the requested action

4. **Event-Driven Communication**:
   - Auth Service listens for events that might affect user authentication (e.g., user.deleted, user.locked)
   - Auth Service emits events when authentication-related actions occur (e.g., user.logged_in, password.changed)

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Authenticate user and receive tokens
- `POST /auth/refresh` - Refresh access token using refresh token
- `POST /auth/logout` - Invalidate current tokens

