import Categories from "../models/categoriesModel.js";
import axios from "axios";

//for add or fetch
export const getCategoriesController = async (req, res) => {
    try {

        const categories = await Categories.find().sort({ createdAt: -1 });
        res.send(categories);

    } catch(error) {
        console.log(error);
    }
}

//for add
export const addCategoriesController = async (req, res) => {

        try {
            const newCategories = new Categories(req.body);
            await newCategories.save();
            res.send("Category Created Successfully!");
    
        } catch(error) {
            console.log("error");
        }


}
// for update
export const updateCategoriesController = async (req, res) => {

    try {

        await Categories.findOneAndUpdate({_id: req.body.productId}, req.body, {new: true})
        res.status(201).json("Product Updated!");
    } catch(error) {
        res.status(400).send(error);
        console.log(error);
    }

}
// for delete
export const deleteCategoriesController = async (req, res) => {
    console.log(req.body);
    try {

        await Categories.findOneAndDelete({_id: req.body.productId})
        res.status(200).json("Product Deleted!");
    } catch(error) {
        res.status(400).send(error);
        console.log(error);
    }
};