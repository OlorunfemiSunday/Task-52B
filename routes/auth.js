
import express from "express";
import { body } from "express-validator";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register",
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  registerUser
);

router.post("/login", loginUser);

export default router;
