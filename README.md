# Bazario Project

![Bazario Logo](https://example.com/logo.png)  <!-- Replace with your logo -->

**Bazario** is an e-commerce web application featuring modern user authentication, payment integration, and product management. The project is built with React on the frontend and Node.js/Express on the backend.

This README will guide you through the content and setup of the `package.json` files for both the client and server directories of the project.

---

## Overview of `package.json` Files

### Server `package.json`

The server `package.json` file defines the server-side dependencies and scripts for running the application backend.

#### Key Components:

| **Component**         | **Description**                                                                                  |
|-----------------------|--------------------------------------------------------------------------------------------------|
| **Scripts**           |                                                                                                  |
| `start`               | Starts the server using `nodemon`, which automatically restarts the server when there are changes in the code. |
| `postinstall`         | Rebuilds the `bcrypt` package from source after installation to ensure proper compatibility (especially for native dependencies). |
| **Dependencies**      |                                                                                                  |
| `express`             | A fast, minimalist web framework for Node.js to handle HTTP requests.                            |
| `mongoose`            | A MongoDB object modeling library to interact with the database.                                 |
| `bcryptjs`            | A library for hashing passwords, ensuring secure user authentication.                            |
| `jsonwebtoken`        | A library for generating and verifying JSON Web Tokens (JWT), used for secure user authentication and authorization. |
| `stripe`              | A payment processing library to handle secure online payments.                                   |
| `cloudinary`          | A cloud storage service for storing images, used for storing product images in the app.          |
| `multer` and `multer-storage-cloudinary` | Middleware for handling file uploads, particularly for Cloudinary.                |
| `axios`               | A promise-based HTTP client for making requests to external APIs, such as OpenAI for product recommendations. |
| `dotenv`              | Loads environment variables from a `.env` file for managing sensitive information securely.       |

#### Development Tools:

| **Tool**      | **Description**                                                                                  |
|---------------|--------------------------------------------------------------------------------------------------|
| `nodemon`     | Used in development to automatically restart the server when changes are made to the code.       |

---

### Client `package.json`

The client `package.json` file defines the frontend dependencies and scripts for running the React application.

#### Key Components:

| **Component**         | **Description**                                                                                  |
|-----------------------|--------------------------------------------------------------------------------------------------|
| **Scripts**           |                                                                                                  |
| `dev`                | Starts the development server with `Vite`, a fast build tool and development server that offers features like hot module replacement (HMR). |
| `build`              | Builds the production version of the application.                                                |
| `lint`               | Runs `ESLint` to lint JavaScript and JSX files with specific rules.                              |
| `preview`            | Previews the production build locally.                                                          |
| **Dependencies**      |                                                                                                  |
| `react`              | The core React library for building user interfaces.                                             |
| `react-dom`          | Allows React to render components to the DOM.                                                    |
| `react-router-dom`   | Enables client-side routing, allowing navigation between pages without reloading the browser.    |
| `@mui/material`      | Provides Material UI components for building visually appealing user interfaces.                |
| `axios`              | Used to make HTTP requests to the backend API (for fetching product data, user authentication, etc.). |
| `react-toastify`     | Provides toast notifications for alerts and status updates.                                      |
| `@emotion/react` and `@emotion/styled` | CSS-in-JS libraries used for styling React components.                                |

#### Development Tools:

| **Tool**                        | **Description**                                                                                  |
|----------------------------------|--------------------------------------------------------------------------------------------------|
| `@vitejs/plugin-react`           | Vite plugin that provides fast React development with hot module replacement (HMR).             |
| `eslint`                         | Linting tool for maintaining code quality.                                                       |
| `eslint-plugin-react` and `eslint-plugin-react-hooks` | ESLint plugins for ensuring best practices with React components and hooks.  |
| `vite`                           | A fast build tool that provides an extremely fast development experience.                       |

---

How to Use This Project
Server Installation
Clone the repository:
git clone https://github.com/irfan7mi/bazario.git
cd bazario
Navigate to the server directory:
cd server
Install dependencies:
npm install
Ensure that your .env file is set up with necessary environment variables (e.g., DB_URI, JWT_SECRET, CLOUDINARY_CLOUD_NAME).
Run the server:
npm run start
The backend will be running at http://localhost:5000.

Client Installation
Navigate to the client directory:
cd client
Install dependencies:
npm install
Start the development server:
npm run dev
The frontend will be available at http://localhost:3000.
