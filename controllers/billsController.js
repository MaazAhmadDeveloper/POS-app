import Bills from "../models/billsModel.js";

//for add or fetch
export const getBillsController = async (req, res) => {

    try {

        const bills = await Bills.find().sort({ createdAt: -1 });
        res.send(bills);

    } catch(error) {
        console.log(error);
    }
}

//for add
export const addBillsController = async (req, res) => {

    // console.log(req.body);
        try {
            const newBills = new Bills(req.body);
            await newBills.save();
            res.send("Bill Created Successfully!");
    
        } catch(error) {
            console.log("error", error.message);
        }
};