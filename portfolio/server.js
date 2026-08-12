import express from "express";
import expressLayouts from "express-ejs-layouts";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import indexRouter from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");
app.use(express.static(join(__dirname, "public")));

app.use("/", indexRouter);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(port, () => {
  console.log(`Atharv Mandlavdiya`);
});
