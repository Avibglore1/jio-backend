import express from "express"
export const PaymentRouter = express.Router();
import {
    getPaymentController,
    updatePremiumAccessController,
} from "../controllers/paymentcontroller.js";

PaymentRouter.post("/order", getPaymentController);
PaymentRouter.patch("/update-premium-access", updatePremiumAccessController);

