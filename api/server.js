const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

const USERS = [
  { username: "mekanxsari", special: true, passcode: "1234" },
  { username: "ali", special: false },
];

// Middleware
app.use(cors({
  origin: "https://be15-185-172-129-155.ngrok-free.app", // Vue frontend
  credentials: true
}));

app.use(bodyParser.json());

app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

// Check user route
app.post("/api/check-user", (req, res) => {

  const { username } = req.body;
  const user = USERS.find(u => u.username === username);

  if (!user) {
    return res.json({ exists: false });
  }
  res.json({ exists: true, special: user.special });
});

// Login regular user
app.post("/api/login", (req, res) => {

  const { username } = req.body;
  const user = USERS.find(u => u.username === username && !u.special);

  if (!user) {
    return res.status(401).json({ success: false });
  }

  req.session.user = { username, special: false };
  res.json({ success: true });
});

// Login special user
app.post("/api/login-special", (req, res) => {
  const { username, passcode } = req.body;
  const user = USERS.find(u => u.username === username && u.special);

  if (!user) {
    return res.status(401).json({ success: false });
  }

  if (user.passcode !== passcode) {
    return res.status(401).json({ success: false });
  }

  req.session.user = { username, special: true };
  res.json({ success: true });
});

// Check current session
app.get("/api/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ loggedIn: false });
  }

  res.json({ loggedIn: true, user: req.session.user });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running: http://localhost:${PORT}`);
});
