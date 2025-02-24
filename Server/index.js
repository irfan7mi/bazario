import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import multer from 'multer'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import UserModel from './models/user.js'
import ProductModel from './models/product.js'
import orderRouter from './routes/orderRouter.js'
import reviewRouter from './routes/reviewRouter.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
import 'dotenv/config'
import authMiddleWare from './middleware/auth.js'
import AdminModel from './models/admin.js'
const JWT_SECRET = process.env.JWT_SECRET || "random#secret"
const url = process.env.MONGO_URI || 'mongodb+srv://mi2268242:q0zQ2HuspFPfohf0@doorfood.gxuxa.mongodb.net/?retryWrites=true&w=majority&appName=bazario';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
const port = 4000
const app= express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome to bazario API!' });
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

app.use(cors({ origin: 'https://bazario-app.vercel.app/' }));
app.use(cors({ origin: 'https://bazario-admin.vercel.app/' }));

app.use(cors({
  origin: "*", // Allow all origins (for development)
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

const createToken = (id) => {
  return jwt.sign({id}, JWT_SECRET)
}

app.post("/admin/login1",async (req, res) => {
  const {email, password} = req.body
  try{
    const exist = await AdminModel.findOne({email})
    if (exist) {
      return res.json({success:false, message:"Admin already exist!"})
    }
    if (!validator.isEmail(email)) {
      return res.json({success:false, message:"Please enter valid email address!"})
    }
    if (password.length<8) {
      return res.json({success:false, message:"Please enter strong password!"})
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    
    const newUser = new AdminModel({
      email: email,
      password: hashedPassword
    })
    let user = await newUser.save()
    const token = createToken(user._id)
    return res.send({success: true,message: "Register successfully",token})
  }
  catch (e) {
    console.log(e)
    res.send({success:false, message: "Error"})
  }
})

app.post("/admin/login", async (req, res) => {
  const{email, password} = req.body
  try{
    let user = await AdminModel.findOne({email})
    if (!user) {
      return res.json({success: false, message: "Admin doesn't exist!"})
    }
    const isMatch = bcrypt.compare(email, password)
    if (!isMatch) {
      return res.json({success: false, message: "Invalid credentials"})
    }
    const token = createToken(user._id)
    return res.send({success:true, message: "Login successfully", token})
  }
  catch (e) {
    console.log(e)
    res.send({success: false, message: "Error"})
  }
})

app.post("/user/signin",async (req, res) => {
  const {name, mobile, email, password} = req.body
  try{
    const exist = await UserModel.findOne({email})
    if (exist) {
      return res.json({success:false, message:"User already exist!"})
    }
    if (!validator.isEmail(email)) {
      return res.json({success:false, message:"Please enter valid email address!"})
    }
    if (password.length<8) {
      return res.json({success:false, message:"Please enter strong password!"})
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    
    const newUser = new UserModel({
      name: name,
      mobile: mobile,
      email: email,
      password: hashedPassword
    })
    let user = await newUser.save()
    const token = createToken(user._id)
    let userId = await user._id
    let userCartData = await user.cartData
    return res.send({success: true,message: "Register successfully",token, userId, userCartData})
  }
  catch (e) {
    console.log(e)
    res.send({success:false, message: "Error"})
  }
})


app.post("/user/login", async (req, res) => {
  const{email, password} = req.body
  try{
    let user = await UserModel.findOne({email})
    if (!user) {
      return res.json({success: false, message: "User doesn't exist!"})
    }
    let userId = await user._id
    let userCartData = await user.cartData
    const isMatch = bcrypt.compare(email, password)
    if (!isMatch) {
      return res.json({success: false, message: "Invalid credentials"})
    }
    const token = createToken(user._id)
    return res.send({success:true, message: "Login successfully", token, userId, userCartData})
  }
  catch (e) {
    console.log(e)
    res.send({success: false, message: "Error"})
  }
})

app.get("/user/list", async (req, res) => {
  try{
    const food = await UserModel.find()
    let userCount = await UserModel.find({}).countDocuments()
    res.send({success: true, data: food, userCount})
  }
  catch (e) {
    console.log(e)
    res.send({success: false, message: "Error"})
  }
})

cloudinary.config({
  cloud_name: "dit8o6iph", 
  api_key: "715248412946731",      
  api_secret: "Cc1x3XX6Ti7eC8sJm7pN1u_-jf0", 
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bazario-app", 
    allowed_formats: ["jpg", "png", "jpeg"], 
  },
});

const upload = multer({ storage });

app.post("/add", upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category || !req.file) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    const product = new ProductModel({
      image: req.file.path,
      name,
      description,
      price: parseFloat(price),
      category
    });

    await product.save();

    res.json({ success: true, message: "Item added successfully." });
  } catch (e) {
    console.error("Error adding item:", e);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/product/rate", async (req, res) => {
  const { productId, userId, rating } = req.body;

  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Add new rating
    product.ratings.push({ userId, rating });
    // Calculate the average rating
    product.averageRating =
    product.ratings.reduce((sum, r) => sum + r.rating, 0) / product.ratings.length;

    await product.save();
    res.json({ success: true, message: "Rating added", averageRating: product.averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add rating" });
  }
});

app.get("/product/list", async (req, res) => {
  const { search } = req.query;

  try {
    // Define search filter
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const productItems = await ProductModel.find(filter);

    const updatedProductItems = productItems.map((item) => {
      let adjustedPrice = item.price;

      return {
        ...item.toObject(),
        price: adjustedPrice,
        averageRating: item.averageRating, // Ensure average rating is included
        showRating: item.averageRating !== null,
      };
    });

    // Respond with the updated data
    res.json({ success: true, data: updatedProductItems, foodCount: updatedProductItems.length });
  } catch (error) {
    console.error("Error fetching product items:", error);
    res.status(500).json({ success: false, message: "Error fetching product items" });
  }
});

app.get("/product/:id", async (req, res) => {
  const id = req.params.id
  try{
    const productItems = await ProductModel.findById({_id: id})
    const updatedProductItems = {
        ...productItems.toObject(),
        price: productItems.price,
        averageRating: productItems.averageRating, // Ensure average rating is included
        showRating: productItems.averageRating !== null,
      };

    res.send({success: true, data: updatedProductItems})
  }
  catch (e) {
    console.log(e)
    res.send({success: false, message: "Error"})
  }
})

app.get("/product/list/:id", async (req, res) => {
  const id = req.params.id
  try{
    const product = await ProductModel.findById({_id: id})
    res.send({success: true, data: product})
  }
  catch (e) {
    console.log(e)
    res.send({success: false, message: "Error"})
  }
})

app.post("/product/list/update/:id", upload.single('image'), async (req, res) => {
  let imageFile = req.file.filename
  try{
    await ProductModel.findByIdAndUpdate(req.params.id, {
      image: imageFile,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category
    })
    res.send({success: true, message: "Status Updated!"})
  }
  catch (e) {
    console.log(e)
    res.send({success: false, message: "Error!"})
  }
})

app.post("/product/delete/:id", async (req, res) => {
  const id = req.params.id
  try{
    const product = await ProductModel.findById({_id : id})
    fs.unlink(`${product.image}`, ()=> {})
    await ProductModel.findByIdAndDelete({_id: id})
    res.json({success:true, message:"Item removed"})
  }
  catch (e) {
    res.json({success:false, message: "Item not removed"})
  }
})

app.post("/cart/add", async(req, res) => {
  const {email, itemId} = req.body
  try{
    let userData = await UserModel.findOne({email})
    if(!userData) {
      return res.send({success: false, message: "User Not LogIn Your Account!"})
    }
    let userId = await userData._id
    let cartData = await userData.cartData
    if(!cartData[itemId]){
      cartData[itemId]= 1
    }
    else{
      cartData[itemId] += 1
    }
    await UserModel.findByIdAndUpdate(userId, {cartData})
    return res.send({success: true, message: "Added To Cart", cartData})
  }
  catch(e) {
    console.log(e)
    res.send({success: false, message: "Error"})
  }
})

app.post("/cart/remove", async(req, res) => {
  const {email, itemId} = req.body
  try{
    let userData = await UserModel.findOne({email})
    let userId = await userData._id;
    let cartData = await userData.cartData
    if(cartData[itemId] > 0){
      cartData[itemId] -= 1
    }
    await UserModel.findByIdAndUpdate(userId, {cartData})
    return res.send({success: true, message: "Removed From Cart", cartData})
  }
  catch(e) {
    console.log(e)
    res.send({success: false, message: "Error"})
  }
})

app.use("/order", orderRouter)
app.use("/review", reviewRouter)

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log('DB Connected');
  } catch (err) {
    console.error('DB Connection Error:', err);
  }
};

app.listen(port, () => {
  console.log(`Server started on ...`)
})
connectDB()
