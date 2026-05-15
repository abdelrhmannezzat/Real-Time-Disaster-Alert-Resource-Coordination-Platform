# Real-Time Disaster Coordination & Alert Platform

A real-time, event-driven system for disaster reporting, geospatial incident discovery, and live alert streaming. Built using FastAPI, WebSockets, and RabbitMQ to simulate a scalable distributed crisis-response architecture.

---

## Overview

This system demonstrates a backend architecture for handling real-time disaster events with:

- Event-driven communication
- Real-time streaming
- Geospatial querying for location-aware results
- Role-based access control
- Asynchronous background processing

The focus is on building a **scalable distributed backend system** rather than a monolithic application.

---

## System Architecture

The platform is composed of multiple loosely-coupled components:

### FastAPI Backend
- REST APIs for authentication, disaster operations, and user management
- JWT-based authentication with role-based authorization
- Core business logic and request orchestration

### RabbitMQ (CloudAMQP)
- Message broker enabling event-driven communication
- Asynchronous processing of disaster events
- Decouples event production from consumption for scalability

### WebSocket Real-Time Layer
- Persistent connections for live alert streaming
- User-specific event delivery
- Location-aware filtering of real-time updates

### Geospatial Query Engine
- Efficient radius-based querying for nearby incidents
- Filtering by severity and disaster type
- Location-aware data retrieval for real-time decision support

### React + TypeScript Frontend
- Interactive dashboard for visualization and interaction
- Live alerts monitoring interface
- Authentication and role-based UI rendering

---

## Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication system
- Role-based access control:
  - Admin
  - Coordinator
  - Volunteer
- Secure endpoint protection for sensitive operations

---

### ⚡ Event-Driven Architecture
- RabbitMQ-based asynchronous event processing (CloudAMQP)
- Decoupled producer/consumer workflow
- Scalable design for high-throughput event handling

---

### 🌐 Real-Time Alert Streaming
- WebSocket-based live communication layer
- Instant delivery of disaster events to connected users
- Session-based and user-aware broadcasting

---

### 📍 Location-Aware Disaster Discovery
- Radius-based geospatial querying for nearby incidents
- Filtering by severity and disaster type
- Supports real-time situational awareness for users

---

## Tech Stack

### Backend
- FastAPI (Python)
- RabbitMQ (CloudAMQP)
- WebSockets
- JWT Authentication
- Asynchronous task processing

### Frontend
- React + TypeScript
- TailwindCSS

### System Design Concepts
- Event-Driven Architecture
- Distributed Systems Design
- Real-Time Streaming Systems
- Geospatial Data Processing
- Producer–Consumer Messaging Pattern

---

## Project Flow

1. Disaster event is created via API or internal trigger  
2. Event is published to RabbitMQ (CloudAMQP)  
3. Background consumers process and enrich event data  
4. Processed events are broadcast via WebSockets  
5. Connected clients receive real-time alerts  
6. Users query nearby incidents using geospatial filters  

---

## Example Use Case

- A disaster event occurs in a specific location  
- Backend processes and classifies severity and type  
- Volunteers connected via WebSockets receive instant alerts  
- Users can query nearby disasters based on their location and radius  
- Coordinators can create and manage disaster events in real time  

---

## Future Improvements

- Volunteer assignment and task coordination system  
- Disaster lifecycle management (active → resolved → archived)  
- Guaranteed message delivery with retry mechanisms  
- Observability layer (logging, metrics, monitoring dashboard)  
- Containerization and production deployment (Docker + CI/CD)  
