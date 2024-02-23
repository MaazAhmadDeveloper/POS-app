import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productRouter from './routes/productsRoutes.js';
import billsRouter from './routes/billsRoutes.js';
import categoriesRouter from './routes/categoriesRouter.js';
import userDataRouter from './routes/userDataUploadRouter.js'; 
//require('colors');

dotenv.config();

//Connect with MongoDB
await mongoose.connect("mongodb+srv://user:user@posclient.lq5unfm.mongodb.net/?retryWrites=true&w=majority").then(() => {
// await mongoose.connect("mongodb://0.0.0.0:27017/fivePOSdb").then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    // console.log(err.message);
});

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan("dev"));

//routes
app.use('/api/products/', productRouter);
app.use('/api/bills/', billsRouter);
app.use('/api/categories/', categoriesRouter);
app.use('/api/userData/', userDataRouter);

//Create Port 
const PORT = process.env.PORT || 5000;

//Listen
app.listen(PORT, () => {
    console.log(`Serve at running on the port: http://localhost:${PORT}`);
} )