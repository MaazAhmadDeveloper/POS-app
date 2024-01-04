import Product from "../models/productModel.js";
import mongoose from "mongoose";
import axios from "axios";

//for add or fetch
export const getProductController = async (req, res) => {
    try {

        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).send(products);

    } catch(error) {
        console.log(error);
    }
}

//for add
export const addProductController = async (req, res) => {

    console.log("add router hitted");
    try {

        const newProducts = new Product(req.body);
        
        console.log(newProducts);

        await newProducts.save();
        res.status(200).send("Products Created Successfully!");

    } catch(error) {
        console.log(error);
    }

}

//for update
export const updateProductController = async (req, res) => {
    try {

        await Product.findOneAndUpdate({_id: req.body.productId}, req.body, {new: true})
        res.status(201).json("Product Updated!");
    } catch(error) {
        res.status(400).send(error);
        console.log(error);
    }
}

//for delete
export const deleteProductController = async (req, res) => {

    if (Array.isArray(req.body.productsIdArray) ) {

        // to delete all products by deleting one category 
        try {

            const objectIdsToDelete = req.body.productsIdArray.map(id => mongoose.Types.ObjectId(id));
            console.log(objectIdsToDelete);
            await Product.deleteMany({ _id: { $in: objectIdsToDelete } });
        
            res.status(200).json("All Products of one category Deleted!");
          } catch (error) {
            console.error("Error deleting documents:", error);
          }
    }else{

        // to delete one product by products sections
        try {
            await Product.findOneAndDelete({_id: req.body.productId});
            res.status(200).json("Product Deleted!");
        } catch(error) {
            res.status(400).send(error);
            console.log(error);
        }
    }
};