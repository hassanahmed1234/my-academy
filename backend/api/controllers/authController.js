import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Cookie options for Production vs Development
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true, // XSS attacks se bachane ke liye (JS can't access it)
    secure: isProduction, // Production (HTTPS) par true rahega
    sameSite: isProduction ? "none" : "lax", // Cross-site requests ke liye 'none' (agar frontend/backend alag domains par hain)
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

// ==========================================
// REGISTER USER
// ==========================================
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "student",
    });

    if (user) {
      // Set token inside HTTP-only cookie
      generateToken(res, user._id);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// LOGIN USER
// ==========================================
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Set token inside HTTP-only cookie
    generateToken(res, user._id);

    const userData = user.toObject();
    delete userData.password;

    res.json({
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// LOGOUT USER (New Cookie Clear Endpoint)
// ==========================================
export const logoutUser = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", "", {
    httpOnly: true,
    secure: isProduction,                   // Login wala hi rule
    sameSite: isProduction ? "none" : "lax", // Login wala hi rule
    expires: new Date(0),                    // Turant expire kar dega
  });

  return res.status(200).json({ 
    success: true,
    message: "Logged out successfully" 
  });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

