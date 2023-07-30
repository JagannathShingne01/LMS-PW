import AppError from "../utils/error.util";


export const getRazorpayApiKey = async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Razarpay API key",
        key: process.env.RAZORPAY_KEY_ID
    })
};

export const buySubscription = async (req, res, next) => {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
        return next(
            new AppError("Unauthorized, please login")
        )
    }

    if (!user.role === "ADMIN") {
        return next(
            "Adim connot purchase a subscription", 400
        )
    }


};

export const verifySubscription = async (req, res, next) => {
    
};

export const cancleSubscription = async (req, res, next) => {
    
};
export const allPayments = async (req, res, next) => {
    
};