// categoriesModel.js
import mongoose from "mongoose";

// Define the schema for categories
const categoriesSchema = new mongoose.Schema({
    category: { type: String, required: true },
    image: { type: String, required: true }
}, {
    timestamps: true // Include timestamps
});

// Define the model with the correct name "Categories"
const Categories = mongoose.model("Categories", categoriesSchema);

export default Categories;
