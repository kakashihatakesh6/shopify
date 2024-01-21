const mongoose = require('mongoose');

const {Schema} = mongoose;

const OrderSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                required: true
            },
           
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    shippingAddress: {
        name: {
            type: String,
            required: true
        },
        mobileNo: {
            type: String,
            required: true
        },
        houseNo: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        landmarks: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
    },
    paymentMethod: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: Date()
    }
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
