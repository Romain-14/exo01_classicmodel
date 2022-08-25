import express from 'express';
import "dotenv/config";
import {fileURLToPath} from "url";
import path from "path";

// DB import
import POOL from "./database/db.js";
import {PORT} from './lib/index.js';

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
    const [infoCustomer] = await POOL.execute(`SELECT customerName, contactFirstName, contactLastName, addressLine1, addressLine2, city 
                                               FROM customers
                                               WHERE customerNumber = ?`, [req.params.customerId]);

    const [orderDetail] = await POOL.execute(`SELECT productName, priceEach, quantityOrdered
                                              FROM orderdetails
                                              JOIN orders ON orderdetails.orderNumber = orders.orderNumber
                                              JOIN products ON orderdetails.productCode = products.productCode
                                              WHERE orders.orderNumber = ? ORDER BY productName`, [req.params.orderId] );

    const [totalAmountQ] =  await POOL.execute(`SELECT SUM(priceEach * quantityOrdered) AS totalAmount FROM orderdetails WHERE orderNumber = ?`, [req.params.orderId]);

    const {totalAmount} = totalAmountQ[0];

    res.render("layout", {template: "detail", infoCustomer: infoCustomer[0], orderNumber: req.params.orderId, orderDetail: orderDetail, totalAmount: totalAmount});
})


app.listen(PORT, ()=> {
    console.log(`Listening at http://localhost:${PORT}`);
})