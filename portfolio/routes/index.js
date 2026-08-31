import express from "express";
import { signature } from "atharv-mandlavdiya";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Portfolio", signature: signature() });
});

export default router;
