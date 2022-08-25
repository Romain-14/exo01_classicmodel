import express from 'express';
import "dotenv/config";
import {fileURLToPath} from "url";
import path from "path";

// DB import
import POOL from "./database/db.js";
import {PORT} from './lib/index.js';
import { get } from 'http';

const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname + "/public")));

// ROUTES

app.get("/", async function(req, res, next) {
    const [result] = await POOL.execute(`SELECT orderNumber, shippedDate, orderDate, status, orders.customerNumber
                                   FROM orders
                                   JOIN customers ON customers.customerNumber = orders.customerNumber`);
    res.render("layout", {template: "home", datas: result});
});

app.get("/detail/:orderId/:customerId", async function(req,res,next){
    console.log('orderId --> ', req.params.orderId);
    console.log('customerId ---> ', req.params.customerId);
    // res.end à remplacer par la méthode de rendu
    res.end();
})


app.listen(PORT, ()=> {
    console.log(`Listening at http://localhost:${PORT}`);
})