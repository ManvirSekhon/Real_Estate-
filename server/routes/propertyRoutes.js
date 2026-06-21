const express = require('express');
const route = express.Router();
const {cloudinary, upload} = require('../cloudinaryconfig');
const {authMiddleware} = require('../middleware/authMiddleware');
const {addProperty,getUserProperties ,getAllProperties, deleteProperty, updateProperty, getPropertyById}=require('../Controller/PropertyController')

route.post('/add', upload.single('image'), authMiddleware,addProperty);
route.get('/user-properties', authMiddleware, getUserProperties);
route.get('/all', getAllProperties);
route.get('/get/:id', authMiddleware ,getPropertyById);
route.put('/update/:id', upload.single('image'), authMiddleware, updateProperty);
route.delete('/delete/:id', deleteProperty);

module.exports = route;