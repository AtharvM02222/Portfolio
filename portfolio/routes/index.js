import express from "express";
import { sign } from "atharv-mandlavdiya";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Portfolio", signature: sign() });
});

router.get("/work", (req, res) => {
  res.render("work", { title: "Work" });
});

router.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

export default router;
