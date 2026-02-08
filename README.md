# SMARTSTROKE: Intelligent Supply Chain Management System

SMARTSTROKE is a comprehensive platform designed to optimize the supply chain for architectural coatings (paints). It leverages AI-driven insights to predict demand, manage inventory efficiency, and minimize dead stock across regional hubs in India.

## 🚀 Quick Start

From the root directory, run:

```bash
npm install
npm run dev
```

This will concurrently start both the **Backend** (Node.js) and the **Frontend** (React/Vite).

---

## 🏗️ Project Architecture

The project is split into two main components:

### 1. Backend ([backend/](file:///e:/data2042025/Desktop/SMARTSTOCK/backend))
- **Tech Stack**: Node.js, Express, CORS.
- **State Management**: File-based JSON storage for simpler persistence.
- **Core Logic**: `controllers/aiLogic.js` handles regional demand calculations, dead stock aging, and stock health scores.
- **Endpoints**:
  - `/api/analytics/dashboard`: Aggregated stats for the main UI.
  - `/api/analytics/demand`: Detailed regional demand data.
  - `/api/paints`: Inventory management.
  - `/api/orders`: Order tracking and creation.

### 2. Frontend ([frontend/](file:///e:/data2042025/Desktop/SMARTSTOCK/frontend))
- **Tech Stack**: React 19, Vite, Tailwind CSS (v4), Framer Motion, Lucide React, Recharts.
- **Authentication**: Context-based auth supporting three roles: **Admin**, **Dealer**, and **Buyer**.
- **Design System**: A premium, high-fidelity UI featuring glassmorphism, micro-animations, and dynamic visualizers.

---

## 🌟 Key Features

### 📊 AI Dashboard
- **Regional Demand Heatmap**: An interactive SVG map of India with glowing pulse effects highlighting high-demand zones.
- **Compliance & Audits**: Simulated AI-driven auditing for regional nodes.

### 📦 Inventory & Logistics
- **Smart Filtering**: Filter inventory by Region (North, South, etc.) or Category.
- **Capital Lock Analysis**: Dedicated views for aging stock highlighting how much capital is "locked" in unsold items.

### 🛒 Dealer & Buyer Portals
- **Dealer Insights**: Performance metrics and order fulfillment tracking.
- **Buyer Experience**: A stylized browsing experience with product color swatches and instant order placement.

### 🔔 Alert System
- **Intelligent Notifications**: Automated warnings for critical low stock or high dead-stock risks.

---

## 🛠️ Developed Scripts

- `npm run start-backend`: Starts the Express server on port 5000.
- `npm run start-frontend`: Starts the Vite development server.
- `npm run dev`: Executes both servers concurrently.

---

## 🎨 UI/UX Philosophy
The project emphasizes **Aesthetics and Interactivity**. 
- **Icons**: Custom package and branding icons throughout.
- **Animations**: Smooth page transitions and state-aware interactions using Framer Motion.
- **Avatars**: Personalized user profile colors that sync across the global layout.
