const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");

mongoose
  .connect("mongodb+srv://nkdasar:nkdasar@cluster0.hiqmtqx.mongodb.net/")
  .then(() => {
    console.log("Connected to MongoDb");
  })
  .catch((err) => {
    console.log("Error connecting to mongoDb", err);
  });

app.listen(port, () => {
  console.log("Server is running on port 8000");
});

// const User = require("../models/User");
const User = require("./models/user");

// Function to send verification email to user
const sendVerificationEmail = async (email, verificationToken) => {
  // create a nodemailer transport
  const transporter = nodemailer.createTransport({
    //configure the email service
    service: "gmail",
    auth: {
      user: "nkdasar@gmail.com",
      pass: "gpuw pxis cylk gvwp",
    },
  });

  //compose the email message
  const mailOptions = {
    from: "wearme.com",
    to: email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email : http://localhost:8000/verify/${verificationToken}`,
  };

  //Send the mail
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email successfully send");
  } catch (error) {
    console.log("Error sending verification email", error);
  }
};

// Endpoint to register User
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);
    // check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    // Create a new user
    const newUser = new User({ name, email, password });

    // Generate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    //save the user to the database
    await newUser.save();

    //send Verification email to the user
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    return res.json({ name: newUser.email, token: newUser.verificationToken });
  } catch (error) {
    console.log("Error regestering user", error);
    res.status(500).json({ message: "Registration Failed" });
  }
});

// EndPoint to verify the email

app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    console.log(token);

    //find the user
    const user = await User.findOne({ verificationToken: token });
    // console.log("Before verification", user)

    if (!user) {
      return res.status(404).json({ message: "invalid verification token" });
    }

    // Mark the user as verified
    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Email verification failed" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};
const secretKey = generateSecretKey();

// Endpoint to login the user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body.user;
    console.log('logun api', req.body)
    // check if user exists
    const user = await User.findOne({ email });
    console.log(user);
  
    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    // check if password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    //Generate a token
    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

// Endpoint to store a new address to the backend
app.post("/addresses", async (req, res) => {
  try {
    const { userId, Address } = req.body;
    console.log("Server is hitting ");

    //Find the user by the userId
    const user = await User.findById(userId);
    console.log("User Email => ", user.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //Add the new address to the user's addresses array
    // const pushAdd = JSON.parse(JSON.stringify(Address));
    user.addresses.push(Address);
    console.log("IT REACHES HERE =====> ");
    //Save the new address to the user's addresses array
    await user.save();

    res.status(200).json({ message: "Address created Successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding address" });
  }
});

//Endpoint to get all the addresses of a particular user
app.get("/addresses/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const addresses = user.addresses;
    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the addresses" });
  }
});

//Endpoint to store all the orders
const Order = require("./models/order");
app.post("/orders", async (req, res) => {
  console.log("Order Endpoint is Hitting");
  try {
    const { userId, cartItems, totalPrice, shippingAddress, paymentMethod } =
      req.body;
    const user = await User.findById(userId);
    // console.log(user, req.body);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create an array of product objects from the cart items
    const products = cartItems.map((item) => ({
      name: item?.title,
      quantity: item.quantity,
      price: item.price,
      image: item?.image,
    }));
    
    //Create a new order
    const order = new Order({
      user: userId,
      products: products,
      totalPrice: totalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
    });

    await order.save();

    res.status(200).json({ message: "Order created successfully!" });
  } catch (error) {
    console.log("error creating orders", error);
    res.status(500).json({ message: "Error creating orders" });
  }
});

//get the user profile
app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving " });
  }
});

app.get("/order/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId }).populate("user");
    if (!orders || orders.length === 0) {
      res.status(404).json({ message: "No orders found for this user" });
    }
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});
