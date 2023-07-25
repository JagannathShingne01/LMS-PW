import express from "express";

import { Router } from "express";
import { getProfile, login, logout, register } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.midddleware.js";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me",isLoggedIn, getProfile);


export default router;