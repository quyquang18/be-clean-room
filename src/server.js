require('dotenv').config();
import cors from 'cors';
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
let app = express();
app.use(cors({ credentials: true, origin: [process.env.URL_REACT,'http://192.168.1.102/'] }));
// app.use(cors())
//config app

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

viewEngine(app);
initWebRoutes(app);
connectDB();

let port = process.env.PORT || 6969;

app.listen(port, () => {
  console.log("Backend Nodejs is runing on the port : " + port);
});
