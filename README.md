# ⚡ Debounce & Throttle Playground

A modern, interactive React application designed to visualize and teach the core performance optimization concepts of **Debouncing** and **Throttling**.

![Project Status](https://img.shields.io/badge/status-complete-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📖 Overview

In modern frontend development, handling high-frequency user events (like typing, scrolling, or resizing) is critical for performance. Without optimization, these events can overwhelm the browser or backend APIs.

This application provides a real-time visualization playground where developers can:
1.  **Experiment** with different execution strategies (None, Debounce, Throttle).
2.  **Visualize** the difference between "Raw Input" events and "Executed Function" calls on a live timeline.
3.  **Adjust** delays dynamically to see how timing impacts execution.

## 🚀 Features

* **Interactive Control Panel**: seamless switching between execution modes.
* **Real-time Visualization**: Live Chart.js timeline showing event frequency.
* **System Console Log**: A terminal-style log panel tracking every event with millisecond precision.
* **Responsive Dashboard**: A professional, split-pane layout optimized for desktop analysis.
* **Dockerized**: Fully containerized for consistent deployment.

## 🛠️ Tech Stack

* **Frontend**: React (Vite)
* **Styling**: Tailwind CSS
* **Logic**: Lodash (debounce/throttle)
* **Visualization**: Chart.js & React-Chartjs-2
* **Containerization**: Docker & Docker Compose

## 📦 Installation & Running

### Option 1: Using Docker (Recommended)

This project includes a Docker configuration for a one-command setup.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd debounce-throttle-playground
    ```

2.  **Run with Docker Compose:**
    ```bash
    docker-compose up --build
    ```

3.  **Access the App:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Local Development

If you prefer running it without Docker:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start the Development Server:**
    ```bash
    npm run dev
    ```

3.  **Access the App:**
    Open the URL provided in the terminal (usually `http://localhost:5173`).

## 🧠 Concepts Explained

### 1. Debounce
**"Wait for silence."**
Debouncing ensures that a function is only executed after a specified period of inactivity. If the user keeps typing, the timer resets.
* *Best for:* Search bar auto-completions, saving drafts.

### 2. Throttle
**"Pace yourself."**
Throttling ensures that a function is executed at most once every specified period (e.g., once every 1000ms), regardless of how frequently the event is triggered.
* *Best for:* Infinite scrolling, window resizing, game inputs.

## 📂 Project Structure
├── public/ # Static assets 
├── src/
│ ├── App.jsx # Main application logic & UI 
│ ├── index.css # Tailwind global styles 
│ └── main.jsx # React entry point 
├── Dockerfile # Docker build instructions 
├── docker-compose.yml # Container orchestration 
├── .dockerignore # Docker build exclusions 
├── .env.example # Environment variables documentation 
└── package.json # Project dependencies