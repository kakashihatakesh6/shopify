const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    addresses: [
        {
            name: String,
            mobileNo: String,
            houseNo: String,
            street: String,
            landmarks: String,
            city: String,
            country: String,
            postalCode: String
        }
    ],
    orders: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Order"
        }
    ],
    createdAt: {
        type: String,
        default: Date()
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;