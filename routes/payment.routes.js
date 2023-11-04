import { Router } from "express";
import { allPayments, buySubscription, cancleSubscription, getRazorpayApiKey, verifySubscription } from "../controllers/payment.controller.js";
import { authorizedRoles, authorizedSubscriber, isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router();

router 
    .route("/razorpay-key")
    .get(
        isLoggedIn,
        getRazorpayApiKey
        );

router 
    .route("/subscription")
    .post(
        isLoggedIn,
        buySubscription
        );    

router 
    .route("/verify")
    .post(
        isLoggedIn,
        verifySubscription
        ); 
   
 router 
    .route("/unsubscribe")
    .post(
        isLoggedIn,
        authorizedSubscriber,
        cancleSubscription
        );

router
    .route("/")
    .get(
        isLoggedIn,
        authorizedRoles("ADMIN"),
        allPayments
        );

export default router;    