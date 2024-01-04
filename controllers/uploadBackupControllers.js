import axios from "axios";
import mongoose from "mongoose";
import Product from "../models/productModel.js";
import Categories from "../models/categoriesModel.js";
import Bills from "../models/billsModel.js";

const connectToDatabase = async (uri, dbName) => {
    try {
      await mongoose.connect(uri);
      console.log(`Connected to ${dbName} DB`);
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  };

export const uploadBackupController = async(req, res)=>{
    try {
    const UserInfo = req.body;

    const response = await axios.post("http://16.171.43.209:3001/api/userdata/uploadData", UserInfo);
      console.log(response.data);

      if (response.data !== "out dated") {
                // getting all data from local DB
        const allProductsOfLocal = await Product.find();
        const allCategoriesOfLocal = await Categories.find();
        const allBillsOfLocal = await Bills.find();

        // disconnect Database of Local
        await mongoose.disconnect(); 

        // Connect from second Cloud Database

        // lofername1125@gmail.com
        await connectToDatabase("mongodb+srv://user:user@posclient.lq5unfm.mongodb.net/?retryWrites=true&w=majority", "Mongo Cloud Server" );
        // await connectToDatabase("mongodb://0.0.0.0:27017/ForUserTestAsCloudDB", "ForUserTestAsCloudDB" );

        // deleting all data exist at past in the second DB
        await Product.deleteMany();
        await Categories.deleteMany();
        await Bills.deleteMany();

        // Inserting all new data which was gathered from local
        await Product.insertMany(allProductsOfLocal);
        await Categories.insertMany(allCategoriesOfLocal);
        await Bills.insertMany(allBillsOfLocal);

        // disconnect from second Database
        await mongoose.disconnect();   

        // again connect to first local DB 
        await connectToDatabase("mongodb://0.0.0.0:27017/fivePOSdb", "fivePOSdb" );

        res.status(200).send("Data Backup successfully");
      } else {
        res.status(200).send("out dated");
      }

    } catch (error) {
      console.log("Error While backup ", error.message);
      res.status(400).send("Error in Backup");
    }
};

export const getBackupController = async(req, res)=>{
  try {
    // disconnect Database of Local
    await mongoose.disconnect(); 

    // Connect from second Cloud Database
    await connectToDatabase("mongodb+srv://user:user@posclient.lq5unfm.mongodb.net/?retryWrites=true&w=majority", "Mongo Cloud Server" );
    // await connectToDatabase("mongodb://0.0.0.0:27017/ForUserTestAsCloudDB", "ForUserTestAsCloudDB" );

    // getting all data from cloud DB
    const allProductsOfCloud = await Product.find();
    const allCategoriesOfCloud = await Categories.find();
    const allBillsOfCloud = await Bills.find();

    // disconnect from second Database
    await mongoose.disconnect();   

    // again connect to first local DB 
    await connectToDatabase("mongodb://0.0.0.0:27017/fivePOSdb", "fivePOSdb" );

    // Inserting all new data which was gathered from local
    
    await Product.insertMany(allProductsOfCloud);
    await Categories.insertMany(allCategoriesOfCloud);
    await Bills.insertMany(allBillsOfCloud);

    res.status(200).send("Data Backup successfully");

    } catch (error) {
      console.log("Error While backup ", error.message);
      res.status(400).send("Error in Backup");
    }
}