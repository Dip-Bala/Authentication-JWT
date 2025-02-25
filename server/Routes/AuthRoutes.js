import express from "express";
import { register, login, secret} from "../Controllers/AuthControllers.js";

const router = express.Router();

router.post("/");
router.post("/register", register);
router.post("/login", login);

export default router;
