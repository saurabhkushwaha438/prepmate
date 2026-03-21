# PrepMate – Placement Assistant

A modern, full-stack AI chatbot web app designed specifically for placement preparation (OS, DBMS, CN, HR, DSA). 

Built with React (Vite), Tailwind CSS, Framer Motion, and the OpenAI API.

## Features
- **4 Dedicated Modes**: OS Interview Prep, DBMS Concepts, HR Questions, Mock Interview Mode.
- **Smart UX**: Smooth animations, auto-scrolling chat, loading states, error handling, quick suggestion chips.
- **Interactive UI**: Clean, glassmorphic design with dark mode aesthetics.
- **Mock Interview Mode**: Asks one question at a time and evaluates your answer before proceeding.

## Project Structure
```text
prepmate/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   │   ├── ChatInterface.jsx # The main chat view
│   │   ├── InputBox.jsx      # Message input and send button
│   │   ├── Landing.jsx       # Welcome screen with 4 clickable cards
│   │   └── MessageBubble.jsx # Individual chat messages with copy/retry options
│   ├── services/           # External API integrations
│   │   └── api.js          # OpenAI API connection and prompt logic
│   ├── App.jsx             # Main application state and routing
│   ├── index.css           # Tailwind directives and global styles
│   └── main.jsx            # React entry point
├── .gitignore
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite configuration
```

## How to Run Locally

### 1. Install Dependencies
Make sure you have Node.js installed. Open your terminal in the `prepmate` directory and run:
```bash
npm install
```

### 2. Configure OpenAI API (Optional)
The app runs in a "Mock Mode" by default if an API key is not provided. To get real AI responses:
1. Run the app, click the **Settings ⚙️** icon in the top right.
2. Enter your OpenAI API Key and click "Save & Close". (The key is securely stored in your browser's `localStorage`).

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the app!

## How to Deploy on Vercel

Vite applications are incredibly simple to deploy on Vercel.

1. **Push to GitHub**: Initialize a Git repository and push your project to GitHub.
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # Link and push to your remote repo
   ```
2. **Import to Vercel**: 
   - Go to [vercel.com](https://vercel.com/) and log in.
   - Click "Add New..." -> "Project".
   - Import your GitHub repository.
3. **Configure Settings**:
   - Vercel will automatically detect that it's a **Vite** project.
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. **Deploy**:
   - Click "Deploy".
   - Your site will be live securely in seconds!
