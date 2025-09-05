import { Router } from "express";
import { signup, login, me, protect } from "../Controller/authController.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, me);

// Logout clear cookie
router.post("/logout", (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
  });
  res.json({ status: "success", message: "Logged out" });
});

export default router;
