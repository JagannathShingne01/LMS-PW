import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import { razorpay } from "../server.js";
import AppError from "../utils/error.util.js";
import crypto from "crypto";

export const getRazorpayApiKey = async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Razarpay API key",
        key: process.env.RAZORPAY_KEY_ID
    })
};

export const buySubscription = async (req, res, next) => {
    try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
        return next(
            new AppError("Unauthorized, please login")
        )
    }

    if (!user.role === "ADMIN") {
        return next("Admin cannot purchase a subscription", 400)
    }

    const subscription = await razorpay.subscriptions.create({
        plan_id: process.env.RAZORPAY_PLAN_ID,
        customer_notify: 1,
        total_count: 12, // for 1-year subscription
    });

    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Subscribed Sucessfully",
        subscription_id: subscription.id
    });

    } catch (e) {
        return next(
            new AppError(e.message, 500)
        )
    }
};

export const verifySubscription = async (req, res, next) => {
   try {
    const { id } = req.user;
    const { razorpay_payment_id, razorpay_signature, razorpay_subscription_id } = req.body;

    const user = await User.findById(id);
    if (!user) {
        return next(
            new AppError("Unauthorized, please login")
        )
    }

    const subscriptionID = user.subscription.id;

    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(`${razorpay_payment_id}|${subscriptionID}`)
        .digest("hex");

    if(generatedSignature !== razorpay_signature) {
        return next(
            new AppError("Payment not verified please try again", 500)
        )
    }    

    await Payment.create({
        razorpay_payment_id,
        razorpay_signature,
        razorpay_subscription_id
    });

    user.subscription.status = "active";
    await user.save();

    res.status(200).json({
        success: true,
        message: "Payment verified successfully!"
    })
   } catch (e) {
        return next(
        new AppError(e.message, 500)
)
}
};

export const cancleSubscription = async (req, res, next) => {
   try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
        return next(
            new AppError("Unauthorized, please login")
        )
    }

    if (!user.role === "ADMIN") {
        return next("Admin cannot purchase a subscription", 400)
    }

    const subscriptionID = user.subscription.id;

    const subscription = await razorpay.subscriptions.cancel(
        subscriptionID
    )

    user.subscription.status = subscription.status;

    await user.save();
    }catch (e) {
         return next(
         new AppError(e.message, 500)
        )
    }
}

export const allPayments = async (req, res, next) => {
    const { count } = req.query;
    
    const subscriptions = await razorpay.subscriptions.all({
        count: count || 10,
    });

    res.status(200).json({
        success: true,
        message: "All payments",
        subscriptions
    })
}