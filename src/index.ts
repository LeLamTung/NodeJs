// src/index.ts
import express, { NextFunction, Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import "reflect-metadata";
import ApiRouter from "@routes/api.router";
import WebRouter from "@routes/web.router";
import { AppDataSource } from "@databases/data-source";
import multer from "multer";
const upload = multer({ dest: 'uploads/' })
// const multer  = require('multer')
import cors from "cors";


dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(cors());


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//config static file
app.use(express.static('public'));

// config views engine
app.set('view engine', 'ejs');
app.set('views', './src/views');
// parse cookies
app.use(cookieParser());
app.use(session({
  secret: 'mykey', // ma hoa ID session
  resave: false, // khong luu lai session neu khong thay doi
  saveUninitialized: true, // luu lai session khi chua duoc khoi tao
}))
app.use((req, res,next) => {
  res.locals.session  = req.session;
  next();
})

app.get("/", (req: Request, res: Response) => {
  res.send("Checking Server");
});
AppDataSource.initialize().then(() => {
  console.log('initialized db')
}).catch(() => {
  console.error('Error while connecting to the database')
  process.exit(1)  // exit with error code 1 to indicate failure to connect to the database
});

app.use("/api",ApiRouter)
app.use("/",WebRouter);
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});