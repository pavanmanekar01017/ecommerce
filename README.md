# Modern Mini E-Commerce App

## Overview
This is a modern, responsive E-Commerce web application built with React and Node.js.
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion. Served via Nginx.
- **Backend**: Node.js, Express. REST APIs with JSON file storage (NoSQL-like).

## Features
- Smooth animations and transitions.
- Shopping Cart with immediate updates from Sidebar.
- Admin Dashboard to Add/Delete products.
- Order history tracking.
- Fully Dockerized.

## 🔐 Default Credentials
- **Username**: `admin`
- **Password**: `admin`

## 🚀 Quick Start (Local)

### Backend
```bash
cd backend
npm install
npm run dev
```
Runs on `http://localhost:8000`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`.

## 🐳 Docker Deployment

To deploy on a single AWS EC2 instance (or any server with Docker):

1. **Build Backend Image**
   ```bash
   cd backend
   docker build -t ecom-backend .
   ```

2. **Run Backend Container**
   ```bash
   docker run -d -p 8000:8000 --restart always --name backend ecom-backend
   ```

3. **Build Frontend Image**
   ```bash
   cd frontend
   docker build -t ecom-frontend .
   ```

4. **Run Frontend Container**
   ```bash
   docker run -d -p 80:80 --restart always --name frontend ecom-frontend
   ```

## ⚠️ Important for AWS EC2
- Ensure your **Security Group** allows Inbound traffic on **Port 80** and **Port 8000**.
- The frontend is configured to communicate with the backend on `port 8000` of the *same host* (`window.location.hostname`). This works perfectly when both containers are on the same machine.

## Data Persistence
Data is stored in `backend/data`. To persist data across container restarts/rebuilds, mount a volume:
```bash
docker run -d -p 8000:8000 -v $(pwd)/data:/app/data --name backend ecom-backend
```
# ecommerce
