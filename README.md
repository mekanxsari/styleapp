# StyleApp

**Your personal stylist now as a Telegram Mini App.**

![StyleApp](https://i.ibb.co/nq7fR8B4/StyleApp.png)

StyleApp helps you discover, organize, and share outfits effortlessly.  
Designed to merge fashion with convenience — right inside Telegram.  

---

## ✨ Features
- 👗 Create and save outfit capsules  
- 🛍️ Add and manage clothing items  
- 🔄 Mix and match outfits with ease  
- 👥 Share your style collections  
- 🔐 Secure and personalized experience  

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16+ recommended)  
- **PostgreSQL** (v12+)  
- **Telegram Bot** (for the Mini App)  

### Installation

```bash
# Clone the repository
git clone https://github.com/mekanxsari/styleapp.git
cd styleapp

# --- Set up the API ---
cd api

# Install dependencies
npm install

# Configure database settings in db.js
# (edit with your PostgreSQL credentials)

# Start the API server
npm start

# --- Set up the Dashboard ---
cd ../stylist-dashboard

# Configure API settings in api.js
# (set your API URL)

# Install dependencies
npm install

# Start the dashboard
npm run dev

# --- Set up the Application ---
cd ../application

# Install dependencies
npm install

# Configure API settings in api.js
# (set your API URL)

# Build the application
npm run build

# --- Done! ---