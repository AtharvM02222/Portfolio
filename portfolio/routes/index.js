import express from "express";
import { sign } from "atharv-mandlavdiya";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Portfolio", signature: sign() });
});

export default router;
