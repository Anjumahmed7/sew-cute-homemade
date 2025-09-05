import jwt from "jsonwebtoken";
import Users from "../Models/userModel.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const sendAuth = (user, statusCode, res) => {
  const token = signToken(user._id);
  // cookie (optional for SPA; Header tokens also fine)
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  // hide password
  user.password = undefined;
  res.status(statusCode).json({ status: "success", token, data: { user } });
};

export const signup = async (req, res, next) => {
  try {
    let { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({
        status: "Failed",
        message: "Fullname, Email, Password required",
      });
    }
    email = email.toLowerCase().trim();

    const existing = await Users.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ status: "Failed", message: "Email already in use" });
    }

    const user = await Users.create({ fullName, email, password });

    sendAuth(user, 201, res);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.email) {
      return res
        .status(409)
        .json({ status: "fail", message: "Email already in use" });
    }

    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ status: "fail", message: "Email and password required" });

    const user = await Users.findOne({ email }).select("+password");
    if (!user)
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid credentials" });

    const ok = await user.comparePassword(password, user.password);
    if (!ok)
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid credentials" });

    sendAuth(user, 200, res);
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res) => {
  const user = await Users.findById(req.user.id);
  res.json({ status: "success", data: { user } });
};

// middleware
export const protect = async (req, res, next) => {
  try {
    let token;
    // get from Authorization header or cookie
    if (req.headers.authorization?.startsWith("Bearer"))
      token = req.headers.authorization.split(" ")[1];
    else if (req.cookies?.jwt) token = req.cookies.jwt;

    if (!token)
      return res.status(401).json({ status: "fail", message: "Not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const freshUser = await Users.findById(decoded.id);
    if (!freshUser)
      return res
        .status(401)
        .json({ status: "fail", message: "User no longer exists" });

    req.user = { id: freshUser._id, role: freshUser.role };
    next();
  } catch (err) {
    next(err);
  }
};

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ status: "fail", message: "Forbidden" });
    next();
  };
