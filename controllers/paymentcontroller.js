const Razorpay = require("razorpay");
const UserModel = require("../Model/UserModel");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_PUBLIC_KEY,
    key_secret: process.env.RAZORPAY_PRIVATE_KEY
})
// create the order so that user can checkout on frontend 
const getPaymentController = async (req, res) =>{
    try{
        const data = await razorpay.orders.create({
            amount: req.body.amount * 100,
            currency: 'INR',
            receipt: 'Recipt_Id' + Date.now()
        });
        res.status(200).json({
            amount: data.amount,
            orderId: data.id 
        });
    }catch(err){
        res.status(500).json({
            message: err.message,
            status: 'failure'
        })
    }
}

// updation of status of premium access
const updatePremiumAccessController = async(req,res) =>{
    try{
        const email = req.body.email;
        const user = await UserModel.findOne({email: email});
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        user.premiumAccess = true;
        await UserModel.findOneAndUpdate(
            {email: email},
            { $set: { isPremium: true } },
            { new: true }
        );
        res.json({ message: { isPremium: true } });
    }catch(err){
        console.log('err', err);
        res.status(500).json({
            status: 'failure',
            message: 'Internal Server Error'
        })
    };
}

module.exports = {getPaymentController, updatePremiumAccessController}