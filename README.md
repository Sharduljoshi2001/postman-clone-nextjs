# 🚀 Postman Clone - Minimalist REST Client

A lightweight, web-based API testing tool built with **Next.js**, **TypeScript**, and **MikroORM**. This application allows developers to send HTTP requests (GET, POST, PUT, DELETE), visualize JSON responses in real-time, and maintain a persistent history of interactions using **PostgreSQL**.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)
![MikroORM](https://img.shields.io/badge/MikroORM-6.0-green)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)

## 🌟 Features

* **HTTP Methods:** Supports GET, POST, PUT, and DELETE requests.
* **Request History:** Automatically logs every request to a PostgreSQL database.
* **Restore Sessions:** Click on any history item to reload the URL, Method, Body, and Headers.
* **JSON Visualization:** Beautifully formatted JSON response viewer with syntax highlighting.
* **Validation:** Strict input validation using **Zod** schema.
* **Layered Architecture:** Built using a scalable Controller-Service-Repository pattern.
* **Responsive UI:** Clean and modern interface designed with Tailwind CSS.

---

## 🏗️ Architecture

This project follows a strict **Separation of Concerns** principle to ensure scalability and maintainability.

```text
src/
├── app/api/           # Controllers (Next.js Route Handlers)
├── services/          # Business Logic (Axios calls, Error handling)
├── repositories/      # Database Access (MikroORM queries)
├── validators/        # Input Validation (Zod schemas)
├── db/entities/       # Database Models
└── components/        # React UI Components
The Data Flow
Frontend sends a request to the Next.js API Route.

Controller validates the input using Zod.

Service executes the external HTTP request and calculates metrics (duration, status).

Repository persists the transaction log into PostgreSQL via MikroORM.

Controller returns the formatted response to the UI.

🛠️ Tech Stack
Framework: Next.js (App Router)

Language: TypeScript

Database: PostgreSQL

ORM: MikroORM (with PostgreSQL driver)

Styling: Tailwind CSS & Lucide React (Icons)

Validation: Zod

HTTP Client: Axios

📸 Screenshots
1. Dashboard View
2. Request & Response
3. History Sidebar
(Note: Ensure screenshots are placed in the screenshots folder)

🚀 Getting Started
Follow these steps to set up the project locally.

Prerequisites
Node.js (v18+)

PostgreSQL installed and running

1. Clone the Repository
Bash

git clone [https://github.com/YOUR_USERNAME/internship-assignment-6.git](https://github.com/YOUR_USERNAME/internship-assignment-6.git)
cd internship-assignment-6
2. Install Dependencies
Bash

npm install
Note: If you encounter peer dependency issues with React 19, use:

Bash

npm install --legacy-peer-deps
3. Configure Environment Variables
Create a .env file in the root directory:

Code snippet

# Database Configuration
DB_NAME=postman_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# App Config
NEXT_PUBLIC_API_URL=http://localhost:3000
4. Database Setup
Make sure your PostgreSQL server is running and you have created an empty database named postman_db. Then run:

Bash

npm run db:sync
This command uses MikroORM CLI to generate the schema tables automatically.

5. Run the Server
Bash

npm run dev
Open http://localhost:3000 in your browser.

🧪 Testing
You can test the application using the following public API endpoints:

GET Request:

URL: https://jsonplaceholder.typicode.com/todos/1

POST Request:

URL: https://jsonplaceholder.typicode.com/posts

Body:

JSON

{
  "title": "foo",
  "body": "bar",
  "userId": 1
}
Error Handling (404):

URL: https://jsonplaceholder.typicode.com/invalid-url