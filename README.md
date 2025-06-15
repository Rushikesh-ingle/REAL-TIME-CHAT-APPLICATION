# REAL-TIME-CHAT-APPLICATION

*COMPANY*: CODTECH IT SOLUTIONS

*NAME*: RUSHIKESH INGLE

*INTERN ID*: CT08DF124

*DOMAIN*: FRONT END DEVELOPMENT

*DURATION*: 4 WEEEKS

*MENTOR*: NEELA SANTOSH

## HERE THE DESCRIPTION


# 🟢 Real-Time Chat Application

Real-Time Chat Application is a full-stack messaging app that enables users to communicate instantly through WebSocket-powered connections. It features a modern, responsive UI built with React and Tailwind CSS, and a lightweight Node.js server for handling real-time communication. Designed with performance and simplicity in mind, this app showcases the power of WebSockets and Vite for building lightning-fast and interactive user experiences.


---

## 🚀 Features

- 🔁 Real-time messaging with WebSocket
- 💬 Clean and modern chat UI
- ⚡ Fast Vite-powered frontend
- 🧠 TypeScript for type safety
- 🎨 Tailwind CSS for styling
- 🌐 Node.js WebSocket server

---

## 📁 Project Structure


project/
├── src/               # React frontend
├── server/            # WebSocket backend
├── public/            # Static assets
├── dist/              # Production build
├── index.html         # Main HTML
├── vite.config.ts     # Vite configuration
├── tailwind.config.js # Tailwind setup
├── package.json       # Scripts and dependencies

````



## 🧑‍💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Rushikesh-ingle/REAL-TIME-CHAT-APPLICATION.git
cd REAL-TIME-CHAT-APPLICATION/project
````

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development servers

```bash
npm run dev
```

This will:

* Start the WebSocket server on [http://localhost:8080](http://localhost:8080)
* Start the Vite frontend server on [http://localhost:5173](http://localhost:5173)

---

## ⚙️ Build for Production

```bash
npm run build
```

To serve the built frontend with the backend:

* Modify `server/index.js` to serve `dist/`
* Run:

  ```bash
  npm run build
  node server/index.js
  ```

---


