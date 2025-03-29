import Razorpay from  "razorpay";
import User from "./../models/User.js"

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// create the order so that user can checkout on frontend 
export const getPaymentController = async (req, res) => {
    console.log("req", req);
    try {
        const data = await razorpay.orders.create({
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: "Receipt_Id" + Date.now(),
        });
        res.json({
            amount: data.amount,
            orderId: data.id,
        });
    } catch (err) {
        console.log(err);
    }
};

// updation of status of premium access
export const updatePremiumAccessController = async (req, res) => {
    try {
        const { email } = req.body;

        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: { isPremium: true } },
            { new: true } // Returns the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: { isPremium: updatedUser.isPremium } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

