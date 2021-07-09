require("dotenv").config();
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { routes } from "@/routes";
import { polling } from "@/pollings";
const app = express();

app.use(
  session({
    secret: "keyboard cat",
    store: MongoStore.create({
      mongoUrl: process.env.mondoDB,
    }),
    resave: false,
    saveUninitialized: true,
  })
);
routes(app);
polling();

app.listen(80, () => {
  console.log(`Example app listening at http://localhost`);
});
